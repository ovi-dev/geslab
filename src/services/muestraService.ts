import axios from 'axios';
import { Muestra } from '@/types/muestra';

const API_URL = 'https://rest-desarrollo.canagrosa.com';
const TOKEN_KEY = 'auth_token';

// Cache para las muestras
let muestrasCache: Muestra[] = [];
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// Función para obtener el token de autenticación
const getAuthToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(TOKEN_KEY);
    }
    return null;
};

// Configuración de axios
const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
});

// Interceptor para añadir el token a las peticiones
api.interceptors.request.use(
    (config) => {
        const token = getAuthToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar errores
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Manejar error de autenticación
            localStorage.removeItem(TOKEN_KEY);
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Función para obtener todas las muestras
export const fetchMuestras = async (): Promise<Muestra[]> => {
    const now = Date.now();
    
    // Si hay caché válido, devolver datos cacheados
    if (muestrasCache.length > 0 && now - lastFetchTime < CACHE_DURATION) {
        return muestrasCache;
    }

    try {
        console.log('Intentando obtener muestras...');
        const token = getAuthToken();
        console.log('Token:', token ? 'Presente' : 'No presente');
        
        const response = await api.get<Muestra[]>('/muestras/list');
        console.log('Respuesta de la API:', response.data);
        
        muestrasCache = response.data;
        lastFetchTime = now;
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error de API:', {
                status: error.response?.status,
                data: error.response?.data,
                headers: error.response?.headers,
                config: error.config
            });
            
            if (error.code === 'ECONNABORTED') {
                throw new Error('Tiempo de espera agotado. Por favor, intente de nuevo.');
            }
            if (error.response?.status === 401) {
                throw new Error('No autorizado. Por favor, inicie sesión de nuevo.');
            }
            if (error.response?.status === 403) {
                throw new Error('No tiene permisos para acceder a este recurso.');
            }
            if (error.response?.status === 404) {
                throw new Error('El recurso solicitado no existe.');
            }
        }
        throw new Error('Error al obtener las muestras. Por favor, intente de nuevo.');
    }
};

// Función para obtener una muestra por ID
export const getMuestraById = async (id: number): Promise<Muestra> => {
    try {
        // Primero buscar en caché
        const cachedMuestra = muestrasCache.find(m => m.ID_MUESTRA === id);
        if (cachedMuestra) {
            return cachedMuestra;
        }

        const response = await api.get<Muestra>(`/muestras/${id}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error de API:', error.response?.data);
        }
        throw new Error('Error al obtener la muestra. Por favor, intente de nuevo.');
    }
};

// Función para crear una nueva muestra
export const createMuestra = async (muestra: Omit<Muestra, 'ID_MUESTRA'>): Promise<Muestra> => {
    try {
        const response = await api.post<Muestra>('/muestras', muestra);
        // Actualizar caché
        muestrasCache = [...muestrasCache, response.data];
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error de API:', error.response?.data);
        }
        throw new Error('Error al crear la muestra. Por favor, intente de nuevo.');
    }
};

// Función para actualizar una muestra
export const updateMuestra = async (id: number, muestra: Partial<Muestra>): Promise<Muestra> => {
    try {
        const response = await api.put<Muestra>(`/muestras/${id}`, muestra);
        // Actualizar caché
        muestrasCache = muestrasCache.map(m => 
            m.ID_MUESTRA === id ? response.data : m
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error de API:', error.response?.data);
        }
        throw new Error('Error al actualizar la muestra. Por favor, intente de nuevo.');
    }
};

// Función para eliminar una muestra
export const deleteMuestra = async (id: number): Promise<void> => {
    try {
        await api.delete(`/muestras/${id}`);
        // Actualizar caché
        muestrasCache = muestrasCache.filter(m => m.ID_MUESTRA !== id);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error de API:', error.response?.data);
        }
        throw new Error('Error al eliminar la muestra. Por favor, intente de nuevo.');
    }
};

// Función para limpiar la caché
export const clearMuestrasCache = () => {
    muestrasCache = [];
    lastFetchTime = 0;
}; 
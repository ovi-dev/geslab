import axios from 'axios';
import { Cliente } from "@/types/cliente";

/**
 * Dirección web donde se encuentra la API de clientes
 */
const API_URL = "https://rest-desarrollo.canagrosa.com/api/clientes";

// Nombre de la clave para el token en localStorage - unificado
const TOKEN_KEY = 'token';

/**
 * Cache de clientes para evitar peticiones innecesarias
 */
let clientesCache: Cliente[] = [];
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos en milisegundos

/**
 * Obtiene el token de autenticación desde el almacenamiento local
 */
const getAuthToken = (): string | null => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      console.warn('No se encontró token de autenticación en localStorage');
    }
    return token;
  } catch (error) {
    console.error('Error al obtener token de localStorage:', error);
    return null;
  }
};

/**
 * Configuración para comunicarse con la API de clientes
 */
const clienteAPI = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  // Timeout de 30 segundos
  timeout: 30000
});

// Interceptor para añadir el token de autorización a todas las peticiones
clienteAPI.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      // Usar el mismo formato que los otros servicios
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Para depuración en desarrollo, no en producción
    if (process.env.NODE_ENV !== 'production') {
      console.log('Headers de la petición:', config.headers);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor para manejar respuestas y detectar problemas de autenticación
 */
clienteAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    // Manejo de errores de autenticación
    if (error.response && error.response.status === 401) {
      console.error('Error de autenticación (401)');
      // Limpiar token inválido
      localStorage.removeItem(TOKEN_KEY);
      // Redirigir al login
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    }
    
    // Manejo de errores de red
    if (error.code === 'ECONNABORTED' || !error.response) {
      console.error('Error de conexión con el servidor');
    }
    
    return Promise.reject(error);
  }
);

/**
 * Obtiene la lista completa de todos los clientes con soporte para caché
 */
export const fetchClientes = async (forceRefresh = false): Promise<Cliente[]> => {
  const now = Date.now();
  
  // Usar caché si está disponible y no ha expirado, y no se fuerza la actualización
  if (!forceRefresh && clientesCache.length > 0 && (now - lastFetchTime) < CACHE_DURATION) {
    return clientesCache;
  }
  
  try {
    const response = await clienteAPI.get('/list');
    clientesCache = response.data;
    lastFetchTime = now;
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('No autorizado. Verifique sus credenciales o inicie sesión nuevamente.');
      } else if (error.response?.status === 404) {
        throw new Error('El recurso solicitado no existe.');
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('La petición ha excedido el tiempo de espera. Intente nuevamente.');
      } else if (!error.response) {
        throw new Error('No se pudo establecer conexión con el servidor. Verifique su conexión.');
      }
      console.error('Error al obtener clientes:', error.response?.data || error.message);
    } else {
      console.error('Error al obtener clientes:', error);
    }
    throw new Error('No se pudieron cargar los clientes. Intente nuevamente.');
  }
};

/**
 * Función para verificar si el token actual es válido
 */
export const verificarToken = async (): Promise<boolean> => {
  try {
    const token = getAuthToken();
    if (!token) return false;
    
    // Realizar una petición ligera para verificar el token
    const response = await clienteAPI.get('/list', { headers: { 'Content-Length': '0' } });
    return response.status === 200;
  } catch (error) {
    console.error('Token inválido o expirado');
    return false;
  }
};

/**
 * Obtiene un cliente por su ID
 */
export const getClienteById = async (id: number): Promise<Cliente | null> => {
  // Intentar primero desde la caché
  if (clientesCache.length > 0) {
    const cachedCliente = clientesCache.find(c => c.ID_CLIENTE === id);
    if (cachedCliente) return cachedCliente;
  }
  
  try {
    const response = await clienteAPI.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener cliente con ID ${id}:`, error);
    return null;
  }
};

/**
 * Crea un nuevo cliente
 */
export const createCliente = async (cliente: Omit<Cliente, 'ID_CLIENTE'>): Promise<Cliente> => {
  try {
    const response = await clienteAPI.post('/list', cliente);
    // Actualizar caché
    clientesCache = [];
    return response.data;
  } catch (error) {
    console.error('Error al crear cliente:', error);
    throw new Error('No se pudo crear el cliente. Intente nuevamente.');
  }
};

/**
 * Actualiza un cliente existente
 */
export const updateCliente = async (cliente: Cliente): Promise<Cliente> => {
  try {
    const response = await clienteAPI.put(`/${cliente.ID_CLIENTE}`, cliente);
    // Actualizar caché
    clientesCache = [];
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar cliente con ID ${cliente.ID_CLIENTE}:`, error);
    throw new Error('No se pudo actualizar el cliente. Intente nuevamente.');
  }
};

/**
 * Elimina un cliente
 */
export const deleteCliente = async (id: number): Promise<void> => {
  try {
    await clienteAPI.delete(`/${id}`);
    // Actualizar caché
    clientesCache = [];
  } catch (error) {
    console.error(`Error al eliminar cliente con ID ${id}:`, error);
    throw new Error('No se pudo eliminar el cliente. Intente nuevamente.');
  }
};

/**
 * Función para limpiar la caché y forzar una nueva carga
 */
export const clearClientesCache = (): void => {
  clientesCache = [];
  lastFetchTime = 0;
};
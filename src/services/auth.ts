import axios, { AxiosError, AxiosResponse } from 'axios';

// Constantes para configuración
const API_BASE_URL = 'https://rest-desarrollo.canagrosa.com/api';
const TOKEN_KEY = 'token';

// Tipo para errores de autenticación
export interface AuthError {
  message: string;
  code?: string;
  status?: number;
}

// Tipo para respuesta de usuario
export interface UserResponse {
  id: string;
  name: string;
  // otros campos que devuelva la API
  [key: string]: any;
}

// Cliente HTTP configurado
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token automáticamente a las solicitudes
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Gestiona el almacenamiento y recuperación del token de autenticación
 */
const TokenService = {
  /**
   * Guarda el token en localStorage
   */
  saveToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
    // También guardamos en cookie para el middleware SSR
    document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=86400; SameSite=Lax`;
  },

  /**
   * Obtiene el token desde localStorage
   */
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Elimina el token de localStorage
   */
  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
    document.cookie = `${TOKEN_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
};

/**
 * Función auxiliar para manejar errores de forma consistente
 */
function handleApiError(error: unknown): never {
  const authError: AuthError = {
    message: 'Error desconocido en la autenticación'
  };
  
  if (error instanceof AxiosError) {
    authError.message = error.response?.data?.message || 'Error en la comunicación con el servidor';
    authError.status = error.response?.status;
    authError.code = error.code;
  } else if (error instanceof Error) {
    authError.message = error.message;
  }
  
  console.error('Error de autenticación:', authError);
  throw authError;
}

/**
 * Obtener el token actual
 */
export function getToken(): string | null {
  return TokenService.getToken();
}

/**
 * Iniciar sesión con credenciales de usuario
 * @param usuario - Nombre de usuario
 * @param password - Contraseña del usuario
 * @returns Datos de la respuesta de autenticación
 */
export async function login(usuario: string, password: string): Promise<AxiosResponse> {
  try {
    const response = await apiClient.post('/login', {
      USUARIO: usuario,
      PASSWORD: password
    });
    
    if (response.data?.token) {
      TokenService.saveToken(response.data.token);
    } else {
      throw new Error('No se recibió token de autenticación');
    }
    
    return response;
  } catch (error) {
    handleApiError(error);
  }
}

/**
 * Obtiene información del usuario autenticado
 * @returns Datos del usuario actual
 */
export async function getUser(): Promise<UserResponse> {
  try {
    const token = TokenService.getToken();
    if (!token) {
      throw new Error('No hay sesión activa');
    }
    
    const response = await apiClient.get('/me');
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

/**
 * Cierra la sesión del usuario
 * @returns true si la sesión se cerró correctamente
 */
export async function logout(): Promise<boolean> {
  try {
    const token = TokenService.getToken();
    
    if (token) {
      try {
        // Intentar hacer logout en el backend
        await apiClient.post('/logout');
      } catch (apiError) {
        console.warn('No se pudo cerrar sesión en el servidor:', apiError);
        // Continuamos con el proceso local aunque falle en el servidor
      }
    }
    
    // Siempre limpiar el token localmente
    TokenService.removeToken();
    return true;
  } catch (error) {
    console.error('Error en proceso de logout:', error);
    // Aun con error, intentamos limpiar token local
    TokenService.removeToken();
    throw error;
  }
}

/**
 * Verifica si el usuario está autenticado actualmente
 * @returns true si hay un token válido
 */
export function isAuthenticated(): boolean {
  return Boolean(TokenService.getToken());
}
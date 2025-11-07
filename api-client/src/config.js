// Configuración del cliente API
// Las variables que empiezan con VITE_ están disponibles aquí

// En desarrollo, usar el proxy de Vite (/api) que redirige a localhost:8000
// En producción, usar la URL completa del backend
const isDevelopment = import.meta.env.DEV;
const API_BASE_URL = isDevelopment 
  ? '/api'  // Proxy de Vite en desarrollo
  : (import.meta.env.VITE_API_URL || 'http://localhost:8000');

export const APP_NAME = import.meta.env.VITE_APP_NAME || 'XpressUTC';

/**
 * Construir URL completa para peticiones a la API
 * @param {string} path - Ruta del endpoint (ej: '/products' o 'products')
 * @returns {string} URL completa
 */
export const apiUrl = (path) => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  // Si ya empieza con /api, usar directamente
  if (cleanPath.startsWith('/api')) {
    return cleanPath;
  }
  // Si no, agregar el prefijo
  return `${API_BASE_URL}${cleanPath}`;
};

/**
 * Hacer petición a la API con manejo de autenticación
 * @param {string} path - Ruta del endpoint
 * @param {object} options - Opciones de fetch (method, body, headers, etc.)
 * @returns {Promise} Respuesta JSON
 */
export const apiRequest = async (path, options = {}) => {
  const url = apiUrl(path);
  
  // Obtener token del localStorage si existe
  const token = localStorage.getItem('auth_token');
  
  // Headers por defecto
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  
  // Agregar token de autenticación si existe
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }
  
  // Combinar headers
  const headers = {
    ...defaultHeaders,
    ...options.headers,
  };
  
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  // Manejar errores
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};

/**
 * Guardar token de autenticación
 * @param {string} token - Token de autenticación
 */
export const setAuthToken = (token) => {
  localStorage.setItem('auth_token', token);
};

/**
 * Obtener token de autenticación
 * @returns {string|null} Token o null
 */
export const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

/**
 * Eliminar token de autenticación (logout)
 */
export const clearAuthToken = () => {
  localStorage.removeItem('auth_token');
};


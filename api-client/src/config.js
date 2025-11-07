// Configuración del cliente API
// Las variables que empiezan con VITE_ están disponibles aquí

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'XpressUTC';

// Helper para construir URLs de la API
export const apiUrl = (path) => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_URL}${cleanPath}`;
};

// Helper para hacer peticiones a la API
export const apiRequest = async (path, options = {}) => {
  const url = apiUrl(path);
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    },
    ...options,
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};


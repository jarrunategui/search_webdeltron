/**
 * Configuración centralizada para APIs
 * Maneja todas las URLs, puertos y configuraciones de endpoints
 */

/**
 * Configuración de hosts y puertos para diferentes APIs
 */
export const API_HOSTS = {
  SEARCH: {
    HOST: process.env.REACT_APP_SEARCH_API_HOST || '192.168.66.194',
    PORT: process.env.REACT_APP_SEARCH_API_PORT || '5040',
    PATH: '/apish'
  },
  IA: {
    HOST: process.env.REACT_APP_IA_API_HOST || '192.168.66.194',
    PORT: process.env.REACT_APP_IA_API_PORT || '5030',
    PATH: '/api'
  },
  PRODUCTS: {
    URL: process.env.REACT_APP_PRODUCTS_API_URL || 'https://api.example.com/products'
  }
};

/**
 * Genera URLs completas para los endpoints
 */
export const API_ENDPOINTS = {
  SEARCH: `http://${API_HOSTS.SEARCH.HOST}:${API_HOSTS.SEARCH.PORT}${API_HOSTS.SEARCH.PATH}`,
  IA: `http://${API_HOSTS.IA.HOST}:${API_HOSTS.IA.PORT}${API_HOSTS.IA.PATH}`,
  PRODUCTS: API_HOSTS.PRODUCTS.URL
};

/**
 * Configuración de timeouts y reintentos
 */
export const API_TIMEOUTS = {
  SEARCH: 10000,
  IA: 8000,
  PRODUCTS: 15000,
  DEFAULT: 10000
};

/**
 * Headers por defecto para diferentes tipos de API
 */
export const API_HEADERS = {
  JSON: {
    'Content-Type': 'application/json'
  },
  FORM: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  MULTIPART: {
    'Content-Type': 'multipart/form-data'
  }
};

/**
 * Configuración de autenticación
 */
export const API_AUTH = {
  API_KEY: process.env.REACT_APP_API_KEY || '',
  BEARER_TOKEN: process.env.REACT_APP_BEARER_TOKEN || ''
};

/**
 * Obtiene configuración completa para un endpoint específico
 * @param {string} endpoint - Nombre del endpoint ('SEARCH', 'IA', 'PRODUCTS')
 * @returns {Object} Configuración completa del endpoint
 */
export const getEndpointConfig = (endpoint) => {
  const config = {
    url: API_ENDPOINTS[endpoint],
    timeout: API_TIMEOUTS[endpoint] || API_TIMEOUTS.DEFAULT,
    headers: { ...API_HEADERS.JSON }
  };

  // Agregar autenticación si está disponible
  if (API_AUTH.API_KEY) {
    config.headers['Authorization'] = `Bearer ${API_AUTH.API_KEY}`;
  }

  return config;
};

/**
 * Configuración específica para desarrollo/producción
 */
export const ENVIRONMENT_CONFIG = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  enableMockData: process.env.REACT_APP_ENABLE_MOCK === 'true',
  enableLogging: process.env.REACT_APP_ENABLE_API_LOGGING !== 'false'
};

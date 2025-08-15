import axios from 'axios';

/**
 * Utilidades para manejo de APIs - Funciones reutilizables
 * Migradas desde PHP y optimizadas para JavaScript
 */

/**
 * Genera payload JSON para solicitudes API
 * @param {string} pregunta - Pregunta de búsqueda
 * @param {string} buscador - Flag de búsqueda ("Y" o "N")
 * @param {Object} filtros - Objeto de filtros personalizados
 * @returns {string} String JSON formateado
 */
export const generateApiPayload = (pregunta, buscador = "Y", filtros = {}) => {
  const defaultFiltros = {
    linea_de_producto: "",
    marca_de_producto: "",
    almacen_codigo: "",
    tipo_producto: "",
    ...filtros
  };

  const payload = {
    pregunta,
    buscador,
    filtros: defaultFiltros
  };

  return JSON.stringify(payload);
};

/**
 * Realiza llamada POST a API específica
 * @param {string} host - Host de la API
 * @param {number|string} port - Puerto de la API
 * @param {string} path - Ruta del endpoint
 * @param {string|Object} data - Datos a enviar (JSON string u objeto)
 * @param {Object} options - Opciones adicionales
 * @returns {Promise<Object>} Respuesta de la API
 */
export const callApiPost = async (host, port, path, data, options = {}) => {
  try {
    const url = `http://${host}:${port}${path}`;
    const requestData = typeof data === 'string' ? JSON.parse(data) : data;
    
    console.log(`🌐 API Call: ${url}`);
    console.log(`📤 Request Data:`, requestData);

    const config = {
      timeout: options.timeout || 10000,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options.axiosConfig
    };

    const response = await axios.post(url, requestData, config);
    
    console.log(`📥 API Response:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`❌ API Error [${host}:${port}${path}]:`, error.message);
    if (error.response) {
      console.error(`📋 Response Status:`, error.response.status);
      console.error(`📋 Response Data:`, error.response.data);
    }
    throw error;
  }
};

/**
 * Valida estructura de respuesta de API de búsqueda
 * @param {Object} response - Respuesta de la API
 * @returns {Object} Objeto con validación y datos extraídos
 */
export const validateSearchResponse = (response) => {
  const result = {
    isValid: false,
    hasError: false,
    errorMessage: null,
    data: null,
    skus: []
  };

  // Verificar si hay error explícito
  if (response && response.rpta === false) {
    result.hasError = true;
    result.errorMessage = 'API returned rpta: false - request rejected';
    return result;
  }

  // Verificar estructura esperada principal
  if (response?.rpta?.dataIA?.ids?.[0]) {
    result.isValid = true;
    result.data = response.rpta.dataIA;
    result.skus = response.rpta.dataIA.ids[0];
    return result;
  }

  // Verificar estructuras alternativas
  if (response?.rpta && typeof response.rpta === 'object') {
    const alternativePaths = [
      response.rpta.ids,
      response.rpta.productos,
      response.rpta.skus,
      response.rpta.data
    ];

    for (const path of alternativePaths) {
      if (Array.isArray(path) && path.length > 0) {
        result.isValid = true;
        result.data = response.rpta;
        result.skus = path;
        return result;
      }
    }
  }

  // Fallback para otras estructuras
  result.skus = response?.skus || response?.productos || response?.data || [];
  result.isValid = result.skus.length > 0;
  result.data = response;

  return result;
};

/**
 * Configuración por defecto para APIs
 */
export const DEFAULT_API_CONFIG = {
  TIMEOUT: 10000,
  HEADERS: {
    'Content-Type': 'application/json'
  },
  RETRY_ATTEMPTS: 2,
  RETRY_DELAY: 1000
};

/**
 * Realiza múltiples intentos de llamada API con reintentos
 * @param {Function} apiCall - Función de llamada API
 * @param {number} maxAttempts - Número máximo de intentos
 * @param {number} delay - Delay entre intentos en ms
 * @returns {Promise<Object>} Resultado de la API
 */
export const retryApiCall = async (apiCall, maxAttempts = DEFAULT_API_CONFIG.RETRY_ATTEMPTS, delay = DEFAULT_API_CONFIG.RETRY_DELAY) => {
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`🔄 API Attempt ${attempt}/${maxAttempts}`);
      const result = await apiCall();
      console.log(`✅ API Success on attempt ${attempt}`);
      return result;
    } catch (error) {
      lastError = error;
      console.warn(`⚠️ API Attempt ${attempt} failed:`, error.message);
      
      if (attempt < maxAttempts) {
        console.log(`⏳ Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  console.error(`❌ All API attempts failed after ${maxAttempts} tries`);
  throw lastError;
};

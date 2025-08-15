import { callApiPost, generateApiPayload, validateSearchResponse, retryApiCall } from './apiUtils.js';
import { API_HOSTS, getEndpointConfig, ENVIRONMENT_CONFIG } from './apiConfig.js';
import { PROJECT_DEBUGGER } from '../utils/debugger.js';

/**
 * Servicio especializado para búsquedas de productos
 * Utiliza las utilidades API externalizadas
 */

/**
 * Realiza búsqueda de productos con estrategia dual
 * @param {string} searchTerm - Término de búsqueda
 * @param {Object} filtros - Filtros adicionales opcionales
 * @returns {Promise<string[]>} Array de SKUs encontrados
 */
export const searchProducts = async (searchTerm, filtros = {}) => {
  if (ENVIRONMENT_CONFIG.enableLogging) {
    console.log('🔍 Iniciando búsqueda:', searchTerm);
  }

  let migratedError = null;

  // Estrategia 1: Método migrado de PHP con reintentos
  try {
    const searchWithRetry = async () => {
      const jsonPayload = generateApiPayload(searchTerm, "Y", filtros);
      return await callApiPost(
        API_HOSTS.SEARCH.HOST,
        API_HOSTS.SEARCH.PORT,
        API_HOSTS.SEARCH.PATH,
        jsonPayload
      );
    };

    const apiResponse = await retryApiCall(searchWithRetry, 2, 1000);
    const validation = validateSearchResponse(apiResponse);

    if (validation.isValid) {
      if (ENVIRONMENT_CONFIG.enableLogging) {
        console.log('✅ Búsqueda exitosa con método migrado:', validation.skus.length, 'SKUs');
      }
      return validation.skus;
    }

    if (validation.hasError) {
      console.warn('⚠️ Método migrado falló:', validation.errorMessage);
      throw new Error(validation.errorMessage);
    }
  } catch (error) {
    migratedError = error;
    console.log('🔄 Método migrado falló, intentando método alternativo...');
  }

  // Estrategia 2: Método directo con axios (fallback)
  try {
    const directSearch = async () => {
      const config = getEndpointConfig('SEARCH');
      const requestData = {
        pregunta: searchTerm,
        buscador: "Y",
        filtros: {
          linea_de_producto: "",
          marca_de_producto: "",
          almacen_codigo: "",
          tipo_producto: "",
          ...filtros
        }
      };

      return await callApiPost(
        API_HOSTS.SEARCH.HOST,
        API_HOSTS.SEARCH.PORT,
        API_HOSTS.SEARCH.PATH,
        requestData,
        { timeout: config.timeout, headers: config.headers }
      );
    };

    const response = await retryApiCall(directSearch, 2, 1000);
    const validation = validateSearchResponse(response);

    if (validation.isValid) {
      if (ENVIRONMENT_CONFIG.enableLogging) {
        console.log('✅ Búsqueda exitosa con método directo:', validation.skus.length, 'SKUs');
      }
      return validation.skus;
    }

    if (validation.hasError) {
      throw new Error(validation.errorMessage);
    }

    return validation.skus; // Fallback con datos parciales
  } catch (directError) {
    console.error('❌ Ambos métodos de búsqueda fallaron');
    console.error('Método migrado:', migratedError?.message || 'Error desconocido');
    console.error('Método directo:', directError.message);
    
    // Retornar array vacío en lugar de datos mock para producción
    if (ENVIRONMENT_CONFIG.isProduction) {
      return [];
    }
    
    // En desarrollo, retornar algunos SKUs de ejemplo para testing
    console.log('🔧 Modo desarrollo: retornando SKUs de ejemplo');
    return ['TE-24155', 'TE-27535', 'LG-24MS500'];
  }
};

/**
 * Búsqueda con filtros específicos
 * @param {string} searchTerm - Término de búsqueda
 * @param {Object} filtros - Filtros específicos
 * @returns {Promise<string[]>} Array de SKUs filtrados
 */
export const searchProductsWithFilters = async (searchTerm, filtros) => {
  return await searchProducts(searchTerm, filtros);
};

/**
 * Búsqueda por categoría
 * @param {string} searchTerm - Término de búsqueda
 * @param {string} categoria - Categoría específica
 * @returns {Promise<string[]>} Array de SKUs de la categoría
 */
export const searchProductsByCategory = async (searchTerm, categoria) => {
  const filtros = {
    linea_de_producto: categoria
  };
  return await searchProducts(searchTerm, filtros);
};

/**
 * Búsqueda por marca
 * @param {string} searchTerm - Término de búsqueda
 * @param {string} marca - Marca específica
 * @returns {Promise<string[]>} Array de SKUs de la marca
 */
export const searchProductsByBrand = async (searchTerm, marca) => {
  const filtros = {
    marca_de_producto: marca
  };
  return await searchProducts(searchTerm, filtros);
};

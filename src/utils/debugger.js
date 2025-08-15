/**
 * 🐛 HERRAMIENTAS DE DEBUGGING PARA EL PROYECTO
 * Utilidades para rastrear el flujo completo de búsqueda
 */

// Configuración de debugging
export const DEBUG_CONFIG = {
  enabled: process.env.NODE_ENV === 'development',
  logLevel: 'ALL', // 'ERROR', 'WARN', 'INFO', 'ALL'
  showTimestamps: true,
  showStackTrace: false,
  colorEnabled: true
};

// Colores para console.log
const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

/**
 * Logger personalizado con niveles y colores
 */
export class DebugLogger {
  constructor(component = 'UNKNOWN') {
    this.component = component;
    this.startTime = Date.now();
  }

  _formatMessage(level, message, data = null) {
    if (!DEBUG_CONFIG.enabled) return;

    const timestamp = DEBUG_CONFIG.showTimestamps ? 
      `[${new Date().toLocaleTimeString()}]` : '';
    
    const color = DEBUG_CONFIG.colorEnabled ? {
      'ERROR': COLORS.red,
      'WARN': COLORS.yellow,
      'INFO': COLORS.blue,
      'SUCCESS': COLORS.green,
      'DEBUG': COLORS.cyan
    }[level] || COLORS.reset : '';

    const resetColor = DEBUG_CONFIG.colorEnabled ? COLORS.reset : '';
    
    const prefix = `${color}🐛 [${this.component}] ${timestamp} ${level}:${resetColor}`;
    
    console.log(`${prefix} ${message}`);
    
    if (data) {
      console.log(`${color}📊 Data:${resetColor}`, data);
    }
  }

  error(message, data = null) {
    this._formatMessage('ERROR', message, data);
    if (DEBUG_CONFIG.showStackTrace) {
      console.trace();
    }
  }

  warn(message, data = null) {
    if (['WARN', 'INFO', 'ALL'].includes(DEBUG_CONFIG.logLevel)) {
      this._formatMessage('WARN', message, data);
    }
  }

  info(message, data = null) {
    if (['INFO', 'ALL'].includes(DEBUG_CONFIG.logLevel)) {
      this._formatMessage('INFO', message, data);
    }
  }

  success(message, data = null) {
    if (['INFO', 'ALL'].includes(DEBUG_CONFIG.logLevel)) {
      this._formatMessage('SUCCESS', message, data);
    }
  }

  debug(message, data = null) {
    if (DEBUG_CONFIG.logLevel === 'ALL') {
      this._formatMessage('DEBUG', message, data);
    }
  }

  // Medir tiempo de ejecución
  time(label = 'operation') {
    this.timers = this.timers || {};
    this.timers[label] = Date.now();
    this.debug(`⏱️ Timer started: ${label}`);
  }

  timeEnd(label = 'operation') {
    if (!this.timers || !this.timers[label]) {
      this.warn(`Timer '${label}' not found`);
      return;
    }
    
    const duration = Date.now() - this.timers[label];
    this.info(`⏱️ ${label}: ${duration}ms`);
    delete this.timers[label];
    return duration;
  }

  // Rastrear flujo de funciones
  flowStart(functionName, params = null) {
    this.info(`🚀 INICIO: ${functionName}`, params);
    this.time(functionName);
  }

  flowEnd(functionName, result = null) {
    this.success(`✅ FIN: ${functionName}`, result);
    this.timeEnd(functionName);
  }

  flowError(functionName, error) {
    this.error(`❌ ERROR en ${functionName}: ${error.message}`, error);
    this.timeEnd(functionName);
  }
}

/**
 * Wrapper para funciones async con debugging automático
 */
export const debugAsync = (fn, functionName, component = 'ASYNC') => {
  const logger = new DebugLogger(component);
  
  return async (...args) => {
    logger.flowStart(functionName, args);
    
    try {
      const result = await fn(...args);
      logger.flowEnd(functionName, result);
      return result;
    } catch (error) {
      logger.flowError(functionName, error);
      throw error;
    }
  };
};

/**
 * Interceptor para eventos del DOM
 */
export const debugEvent = (eventName, component = 'DOM') => {
  const logger = new DebugLogger(component);
  
  return (handler) => {
    return (...args) => {
      logger.info(`🖱️ Evento: ${eventName}`, args[0]?.target?.value || args);
      return handler(...args);
    };
  };
};

/**
 * Monitor de estado de React
 */
export const debugState = (stateName, component = 'STATE') => {
  const logger = new DebugLogger(component);
  
  return (oldValue, newValue) => {
    logger.info(`🔄 Estado cambiado: ${stateName}`, {
      anterior: oldValue,
      nuevo: newValue
    });
  };
};

/**
 * Rastreador de API calls
 */
export const debugAPI = {
  request: (url, method, data, component = 'API') => {
    const logger = new DebugLogger(component);
    logger.info(`📤 ${method} Request: ${url}`, data);
    logger.time(`api-${method}-${url}`);
  },
  
  response: (url, method, response, component = 'API') => {
    const logger = new DebugLogger(component);
    logger.success(`📥 ${method} Response: ${url}`, response);
    logger.timeEnd(`api-${method}-${url}`);
  },
  
  error: (url, method, error, component = 'API') => {
    const logger = new DebugLogger(component);
    logger.error(`❌ ${method} Error: ${url}`, error);
    logger.timeEnd(`api-${method}-${url}`);
  }
};

/**
 * Utilidades de debugging específicas del proyecto
 */
export const PROJECT_DEBUGGER = {
  // Rastrear flujo completo de búsqueda
  searchFlow: {
    userInput: (searchTerm) => {
      const logger = new DebugLogger('SEARCH-FLOW');
      logger.info('👤 Usuario escribió:', { searchTerm, length: searchTerm.length });
    },
    
    formSubmit: (searchTerm) => {
      const logger = new DebugLogger('SEARCH-FLOW');
      logger.info('📝 Formulario enviado:', { searchTerm });
    },
    
    navigationStart: (url) => {
      const logger = new DebugLogger('SEARCH-FLOW');
      logger.info('🧭 Navegación iniciada:', { url });
    },
    
    apiCallStart: (searchTerm, method) => {
      const logger = new DebugLogger('SEARCH-FLOW');
      logger.info(`🌐 Llamada API iniciada (${method}):`, { searchTerm });
      logger.time('search-api-call');
    },
    
    apiCallEnd: (skus, method) => {
      const logger = new DebugLogger('SEARCH-FLOW');
      logger.success(`✅ API completada (${method}):`, { skusCount: skus?.length || 0, skus });
      logger.timeEnd('search-api-call');
    },
    
    productsLoaded: (products) => {
      const logger = new DebugLogger('SEARCH-FLOW');
      logger.success('📦 Productos cargados:', { 
        count: products.length,
        products: products.map(p => ({ sku: p.sku, title: p.title?.substring(0, 50) }))
      });
    },
    
    renderComplete: (filteredCount, totalCount) => {
      const logger = new DebugLogger('SEARCH-FLOW');
      logger.success('🎨 Renderizado completo:', { 
        mostrados: filteredCount, 
        total: totalCount 
      });
    }
  }
};

// Exportar logger global para uso rápido
export const logger = new DebugLogger('GLOBAL');

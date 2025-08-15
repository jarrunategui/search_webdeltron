# Deltron Search - React Application

Una aplicación React que replica la funcionalidad de búsqueda de productos de Deltron, con filtros dinámicos, integración de APIs y sistema completo de debugging.

## Características

- 🔍 **Búsqueda por parámetros GET**: La búsqueda se realiza mediante parámetros en la URL
- 📱 **Diseño Responsivo**: Adaptado para desktop y móviles
- 🎛️ **Filtros Dinámicos**: Los filtros se actualizan según los resultados de búsqueda
- 🔄 **Integración de APIs Dual**: Estrategia dual con método migrado de PHP y fallback directo
- 💾 **Datos Mock**: Incluye datos de ejemplo para desarrollo
- 🐛 **Sistema de Debugging**: Herramientas completas de rastreo y logging
- 🔧 **Arquitectura Modular**: Código externalizado en módulos reutilizables
- ⚡ **Manejo de Errores Robusto**: Detección específica de errores API y reintentos automáticos

## Estructura del Proyecto

```
src/
├── components/
│   ├── SearchPage.js      # Página principal de búsqueda (con debugging integrado)
│   ├── Header.js          # Cabecera con barra de búsqueda (con rastreo de eventos)
│   ├── Sidebar.js         # Barra lateral con filtros
│   ├── ProductGrid.js     # Grilla de productos
│   └── ProductCard.js     # Tarjeta individual de producto
├── services/
│   ├── api.js            # Interfaz principal de APIs (simplificada)
│   ├── apiConfig.js      # Configuración centralizada de endpoints
│   ├── apiUtils.js       # Utilidades reutilizables para APIs
│   └── searchService.js  # Servicio especializado de búsquedas
├── utils/
│   └── debugger.js       # Sistema completo de debugging y logging
├── App.js                # Componente principal
├── App.css              # Estilos principales
├── index.js             # Punto de entrada
└── index.css            # Estilos globales
```

## Instalación y Ejecución

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo (con debugging habilitado)
npm start

# Construir para producción
npm run build

# Ejecutar con debugging deshabilitado
NODE_ENV=production npm start
```

### Verificación de Instalación
1. La aplicación debe abrir en `http://localhost:3000`
2. Abre DevTools y realiza una búsqueda
3. Deberías ver logs de debugging en Console
4. Verifica que las APIs respondan en Network tab

## Configuración de APIs

Para conectar con tus APIs reales, configura las siguientes variables de entorno:

```bash
# .env
# Configuración para acceso desde otras máquinas en la red
HOST=0.0.0.0
PORT=3000

# APIs de búsqueda y productos
REACT_APP_SEARCH_API_HOST=192.168.66.194
REACT_APP_SEARCH_API_PORT=5040
REACT_APP_IA_API_HOST=192.168.66.194
REACT_APP_IA_API_PORT=5030
REACT_APP_SEARCH_API_URL=http://192.168.66.194:5040/apish
REACT_APP_PRODUCTS_API_URL=https://api.example.com/products
REACT_APP_API_KEY=
```

## Flujo de Datos

### Flujo Principal
1. **Input del Usuario**: Se rastrea cada tecla escrita en tiempo real
2. **Submit del Formulario**: Se detecta el envío y se actualiza la URL con `?q=termino`
3. **Navegación**: Se navega a la nueva URL y se activa el useEffect
4. **API de Búsqueda**: Estrategia dual:
   - **Método Primario**: Función migrada de PHP con `generateApiPayload` y `callApiPost`
   - **Método Fallback**: Llamada directa con axios si el primario falla
5. **Validación de Respuesta**: Se valida la estructura y se detectan errores `rpta: false`
6. **API de Productos**: Se obtienen detalles completos usando los SKUs encontrados
7. **Filtros Dinámicos**: Se generan automáticamente basados en los productos
8. **Renderizado**: Se muestran productos con logging completo del proceso

### Sistema de Debugging
- **Rastreo Completo**: Desde input hasta renderizado final
- **Logging Colorizado**: Diferentes colores por tipo de evento
- **Medición de Tiempos**: Duración de cada operación
- **Detección de Errores**: Identificación específica de fallos API

## Arquitectura Modular

### Servicios API
- **`apiConfig.js`**: Configuración centralizada de hosts, puertos y endpoints
- **`apiUtils.js`**: Utilidades reutilizables (generateApiPayload, callApiPost, validateSearchResponse)
- **`searchService.js`**: Lógica especializada de búsquedas con estrategia dual
- **`api.js`**: Interfaz principal simplificada que delega a servicios especializados

### Sistema de Debugging
- **`debugger.js`**: Logger personalizado con niveles, colores y medición de tiempos
- **Integración Automática**: Debug points integrados en componentes principales
- **Rastreo de Flujo**: Seguimiento completo desde input hasta renderizado

### Personalización
- **Estilos**: Modifica `App.css` para cambiar la apariencia
- **APIs**: Configura endpoints en `apiConfig.js`
- **Filtros**: Personaliza filtros en `components/Sidebar.js`
- **Productos**: Ajusta estructura en `components/ProductCard.js`
- **Debug Level**: Cambia `DEBUG_CONFIG.logLevel` en `debugger.js`

## Tecnologías Utilizadas

- **React 18** con Hooks (useState, useEffect)
- **React Router DOM** para navegación y parámetros URL
- **Axios** para peticiones HTTP con interceptores
- **CSS3** con Flexbox y Grid para layout responsivo
- **Sistema de Logging** personalizado con colores y timestamps
- **Arquitectura Modular** con separación de responsabilidades
- **Estrategia de Fallback** para APIs con reintentos automáticos

## Debugging y Desarrollo

### Cómo Debuggear
1. **Abre DevTools** (`F12`) y ve a Console
2. **Realiza una búsqueda** y observa el flujo completo:
   ```
   🐛 [SEARCH-FLOW] 👤 Usuario escribió: { searchTerm: "monitor" }
   🐛 [SEARCH-FLOW] 📝 Formulario enviado: { searchTerm: "monitor" }
   🐛 [SEARCH-FLOW] 🌐 Llamada API iniciada (searchProducts)
   🐛 [SEARCH-FLOW] ✅ API completada: { skusCount: 6 }
   🐛 [SEARCH-FLOW] 📦 Productos cargados: { count: 6 }
   ```
3. **Network Tab**: Observa las llamadas a `http://192.168.66.194:5040/apish`
4. **React DevTools**: Monitorea cambios de estado en tiempo real

### Configuración de Debug
```javascript
// En utils/debugger.js
DEBUG_CONFIG = {
  logLevel: 'ALL',        // 'ERROR', 'WARN', 'INFO', 'ALL'
  showTimestamps: true,
  colorEnabled: true
}
```

### Solución de Problemas Comunes
- **Error `rpta: false`**: Verifica configuración de API en `.env`
- **No aparecen productos**: Checa que los SKUs se obtengan correctamente
- **API timeout**: Ajusta timeout en `apiConfig.js`

## Próximos Pasos

1. ✅ ~~Migrar funciones PHP a JavaScript~~
2. ✅ ~~Implementar sistema de debugging~~
3. ✅ ~~Modularizar arquitectura~~
4. ✅ ~~Manejo robusto de errores~~
5. 🔄 Implementar paginación
6. 🔄 Agregar más filtros avanzados
7. 🔄 Implementar caché de resultados
8. 🔄 Tests unitarios para servicios API

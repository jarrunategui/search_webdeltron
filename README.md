# Deltron Search - React Application

Una aplicación React que replica la funcionalidad de búsqueda de productos de Deltron, con filtros dinámicos y integración de APIs.

## Características

- 🔍 **Búsqueda por parámetros GET**: La búsqueda se realiza mediante parámetros en la URL
- 📱 **Diseño Responsivo**: Adaptado para desktop y móviles
- 🎛️ **Filtros Dinámicos**: Los filtros se actualizan según los resultados de búsqueda
- 🔄 **Integración de APIs**: Dos pasos de API (búsqueda de SKUs → detalles de productos)
- 💾 **Datos Mock**: Incluye datos de ejemplo para desarrollo

## Estructura del Proyecto

```
src/
├── components/
│   ├── SearchPage.js      # Página principal de búsqueda
│   ├── Header.js          # Cabecera con barra de búsqueda
│   ├── Sidebar.js         # Barra lateral con filtros
│   ├── ProductGrid.js     # Grilla de productos
│   └── ProductCard.js     # Tarjeta individual de producto
├── services/
│   └── api.js            # Servicios de API
├── App.js                # Componente principal
├── App.css              # Estilos principales
├── index.js             # Punto de entrada
└── index.css            # Estilos globales
```

## Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm start

# Construir para producción
npm run build
```

## Configuración de APIs

Para conectar con tus APIs reales, configura las siguientes variables de entorno:

```bash
# .env
REACT_APP_SEARCH_API_URL=https://tu-api.com/search
REACT_APP_PRODUCTS_API_URL=https://tu-api.com/products
REACT_APP_API_KEY=tu-api-key
```

## Flujo de Datos

1. **Búsqueda**: El usuario ingresa un término y se actualiza la URL con `?q=termino`
2. **API de Búsqueda**: Se envía el término a la primera API que retorna un array de SKUs
3. **API de Productos**: Se envían los SKUs a la segunda API para obtener detalles
4. **Filtros**: Se generan filtros dinámicos basados en los productos obtenidos
5. **Visualización**: Se muestran los productos en una grilla con filtros aplicables

## Personalización

- **Estilos**: Modifica `App.css` para cambiar la apariencia
- **APIs**: Actualiza `services/api.js` con tus endpoints reales
- **Filtros**: Personaliza los filtros en `components/Sidebar.js`
- **Productos**: Ajusta la estructura de datos en `components/ProductCard.js`

## Tecnologías Utilizadas

- React 18
- React Router DOM
- Axios para peticiones HTTP
- CSS3 con Flexbox y Grid
- Responsive Design

## Próximos Pasos

1. Conectar con las APIs reales
2. Implementar paginación
3. Agregar más filtros avanzados
4. Mejorar el manejo de errores
5. Implementar caché de resultados

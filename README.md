# CAPE - Concesionaria de Autos

Un sistema de gestión para concesionaria de autos desarrollado con Angular 20 y JSON Server.

## 📋 Descripción

CAPE es una aplicación web completa para la gestión de una concesionaria de autos que permite:

- **Catálogo de vehículos**: Visualización de todos los vehículos disponibles
- **Detalles de vehículos**: Información detallada con imágenes y especificaciones
- **Gestión de inventario**: Agregar, editar y eliminar vehículos (solo administradores)
- **Sistema de consultas**: Los usuarios pueden realizar consultas sobre vehículos
- **Sistema de reservas**: Reservar vehículos de interés
- **Autenticación**: Sistema de login con roles de usuario y administrador
- **Panel de administración**: Gestión completa del sistema

## 🚀 Tecnologías

- **Frontend**: Angular 20.3.0
- **Backend**: JSON Server 1.0.0-beta.3 (base de datos simulada)
- **Lenguaje**: TypeScript 5.9.2
- **Estilos**: CSS3
- **Testing**: Jasmine y Karma

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── admin/              # Panel de administración
│   ├── booking-form/       # Formulario de reservas
│   ├── catalog/            # Catálogo de vehículos
│   ├── footer/             # Componente footer
│   ├── header/             # Componente header
│   ├── inquiry-form/       # Formulario de consultas
│   ├── login/              # Sistema de autenticación
│   ├── vehicle-details/    # Detalles de vehículos
│   ├── vehicle-form/       # Formulario de vehículos
│   ├── *.service.ts        # Servicios de la aplicación
│   └── *.ts               # Modelos y configuración
├── public/                 # Archivos públicos
└── db.json                # Base de datos JSON
```

## 🛠️ Instalación

### Prerrequisitos

- Node.js (versión 18 o superior)
- npm (viene con Node.js)
- Angular CLI (opcional, pero recomendado)

### Pasos de instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd CAPE-Regi
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Instalar Angular CLI globalmente (opcional)**
   ```bash
   npm install -g @angular/cli
   ```

## 🏃‍♂️ Ejecución

### Desarrollo

1. **Iniciar JSON Server (Base de datos)**
   ```bash
   npx json-server --watch db.json --port 3000
   ```

2. **Iniciar la aplicación Angular** (en otra terminal)
   ```bash
   npm start
   # o
   ng serve
   ```

3. **Acceder a la aplicación**
   - Frontend: http://localhost:4200
   - API/Base de datos: http://localhost:3000

### Producción

```bash
npm run build
```

Los archivos de producción se generarán en el directorio `dist/`.

## 👤 Usuarios del Sistema

### Usuarios de prueba incluidos:

| Rol | Email | Password | Descripción |
|-----|-------|----------|-------------|
| Administrador | admin@concesionaria.com | admin123 | Acceso completo al sistema |
| Usuario | usuario@demo.com | user123 | Usuario cliente estándar |
| Vendedor | vendedor@concesionaria.com | vend123 | Acceso de administrador |

## 🎯 Funcionalidades Principales

### Para Usuarios
- ✅ Ver catálogo completo de vehículos
- ✅ Filtrar y buscar vehículos
- ✅ Ver detalles completos con galería de imágenes
- ✅ Realizar consultas sobre vehículos
- ✅ Hacer reservas de vehículos
- ✅ Registro y autenticación

### Para Administradores
- ✅ Todas las funcionalidades de usuario
- ✅ Agregar nuevos vehículos al inventario
- ✅ Editar información de vehículos existentes
- ✅ Eliminar vehículos del inventario
- ✅ Gestionar consultas de usuarios
- ✅ Administrar reservas
- ✅ Panel de administración completo

## 🧪 Testing

```bash
# Ejecutar tests unitarios
npm test
# o
ng test

# Ejecutar tests con coverage
ng test --code-coverage
```

## 📦 Scripts Disponibles

| Script | Comando | Descripción |
|--------|---------|-------------|
| `start` | `ng serve` | Inicia el servidor de desarrollo |
| `build` | `ng build` | Construye la aplicación para producción |
| `watch` | `ng build --watch --configuration development` | Construye en modo watch |
| `test` | `ng test` | Ejecuta los tests unitarios |

## 🌟 Características Técnicas

- **Arquitectura**: Componentes modulares y reutilizables
- **Routing**: Sistema de rutas con guards de autenticación
- **Servicios**: Gestión de estado con servicios Angular
- **Responsive Design**: Interfaz adaptable a diferentes dispositivos
- **Tipado**: TypeScript para mayor robustez del código
- **Validación**: Formularios reactivos con validaciones

## 🔧 Configuración

### Variables de entorno

El proyecto utiliza JSON Server en el puerto 3000 por defecto. Puedes modificar la configuración en:

- `src/app/vehicle-client.ts` - Cliente HTTP para vehículos
- `src/app/*-service.ts` - Servicios que consumen la API

### Base de datos

La base de datos se encuentra en `db.json` y contiene:

- **vehiculos**: Inventario de vehículos
- **consultas**: Consultas de usuarios
- **reservas**: Reservas realizadas
- **usuarios**: Usuarios del sistema

## 🚧 Próximas Funcionalidades

- [ ] Sistema de notificaciones
- [ ] Integración con pasarelas de pago
- [ ] Chat en tiempo real
- [ ] Sistema de reportes
- [ ] API REST completa
- [ ] Deployment automático

## 🤝 Contribución

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Contacto

- **Repositorio**: [CAPE en GitHub](https://github.com/Vickycabo/CAPE)
- **Rama actual**: maxi

---

**Desarrollado con ❤️ usando Angular**

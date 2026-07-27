# 🚗 CAPE - Concesionaria de Autos
## Sistema Moderno de Gestión Vehicular

[![Angular](https://img.shields.io/badge/Angular-20+-red?logo=angular)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Signals](https://img.shields.io/badge/Angular_Signals-✅-green)](https://angular.io/guide/signals)
[![RxJS](https://img.shields.io/badge/RxJS-Modern-purple?logo=rxjs)](https://rxjs.dev/)

Un sistema de gestión para concesionaria de autos desarrollado con **Angular 20.3+** utilizando la nueva arquitectura de **Signals** y **RxJS** para máximo rendimiento y reactividad.

## 🎯 Características Destacadas

### ⚡ **Arquitectura Moderna**
- **Signals de Angular 20+** para manejo de estado reactivo optimizado.
- **RxJS + firstValueFrom()** para operaciones HTTP modernas.
- **Change Detection granular (Zoneless)** para un rendimiento superior.

### 🔧 **Funcionalidades Principales**
- **Catálogo inteligente** con ordenamiento y filtros reactivos en tiempo real.
- **Integración con Cloudinary** para la subida y gestión de imágenes en la nube.
- **Panel de Autogestión (Mi Panel)** exclusivo para que los clientes administren sus reservas.
- **Gestión completa de inventario** con validaciones dinámicas para administradores.
- **Sistema de alertas modales** interactivas implementadas con **SweetAlert2**.

### 🎨 **Experiencia de Usuario (UX/UI)**
- **Diseño Clean** inspirado en concesionarias.
- **Autocompletado inteligente** en formularios para usuarios logueados.
- **Estados de carga** reactivos con feedback visual inmediato.
- **Interfaz responsive** con diseño moderno adaptado a dispositivos móviles.

## 🚀 Stack Tecnológico

### **Frontend Moderno**
- **Angular 20.3+** - Framework principal con standalone components.
- **TypeScript** - Fuerte tipado estricto para mayor seguridad en el código.
- **Signals & RxJS** - Sistema reactivo híbrido.
- **SweetAlert2 (11.26+)** - Para notificaciones y confirmaciones modales modernas.

### **Backend & Datos**
- **JSON Server (1.0.0-beta)** - API REST simulada para desarrollo local.
- **Cloudinary API (2.10+)** - Almacenamiento de imágenes de vehículos en la nube.
- **HTTP Client** - Comunicación moderna asíncrona.

## 📁 Estructura del Proyecto (Clean Architecture)

```text
src/
├── app/
│   ├── admin/              # Panel de administración de roles
│   ├── booking-form/       # Formularios modales de reservas
│   ├── catalog/            # Catálogo de vehículos y filtros
│   ├── guards/             # Protecciones de ruta (Auth & Admin) aisladas
│   ├── user-panel/         # Autogestión de clientes (Mi Panel)
│   ├── vehicle-details/    # Ficha técnica dividida (Split design)
│   ├── vehicle-form/       # Formulario interactivo con subida a Cloudinary
│   ├── *.service.ts        # Lógica de negocio y llamadas HTTP centralizadas
│   └── types/index.ts      # Interfaces y DTOs centralizados (Pattern Barrel)
├── public/                 # Archivos públicos
└── db.json                # Base de datos JSON
```

## 🏗️ Arquitectura del Sistema

### **Patrón Híbrido RxJS + Signals**
Este proyecto implementa una arquitectura moderna que combina lo mejor de ambos mundos:

```typescript
// ✅ Signals para estado reactivo local
export class VehicleClient {
  private vehiclesSignal = writable<Vehicle[]>([]);
  
  // ✅ RxJS + firstValueFrom() para operaciones HTTP
  async loadVehicles(): Promise<void> {
    const vehicles = await firstValueFrom(this.http.get<Vehicle[]>('/api/vehicles'));
    this.vehiclesSignal.set(vehicles);
  }
}
```

### **Ventajas de esta Arquitectura:**
- 🚀 **Rendimiento**: Change detection granular con Signals
- 🔄 **Reactividad**: Estado automático sin subscripciones manuales  
- 🧹 **Clean Code**: Sin memory leaks por subscripciones olvidadas

## 🛠️ Instalación y Configuración

### **Prerrequisitos**
- **Node.js** 20.10.0+ 
- **npm** (incluido con Node.js)
- **Angular CLI** 20+

### **Instalación Rápida**

1. **Clonar y configurar**:
   ```powershell
   git clone https://github.com/Vickycabo/CAPE.git
   cd CAPE
   npm install
   ```

2. **Iniciar desarrollo**:
   ```powershell
   # Terminal 1: Backend simulado
   npx json-server db.json --port 3000
   
   # Terminal 2: Aplicación Angular  
   ng serve
   ```

3. **Acceder a la aplicación**:
   - 🌐 **Frontend**: http://localhost:4200
   - 🔧 **API Backend**: http://localhost:3000
   - 📊 **JSON Server UI**: http://localhost:3000/__admin

## 🏃‍♂️ Scripts de Desarrollo

### **Comandos principales**

1. **Desarrollo completo** (recomendado):
   ```powershell
   # Iniciar backend y frontend en paralelo
   npm run dev
   ```

2. **Solo frontend**:
   ```powershell
   npm start
   ng serve
   ```

3. **Solo backend**:
   ```powershell
   npx json-server db.json --port 3000
   ```

4. **Build para producción**:
   ```powershell
   npm run build
   ```

## 👥 Sistema de Usuarios

### **Cuentas de Prueba**

| **Rol** | **Email** | **Password** | **Permisos** |
|----------|-----------|--------------|--------------|
| 👨‍💼 **Admin** | admin@concesionaria.com | admin123 | Gestión de inventario, ABM de usuarios, panel global de reservas y consultas. |
| 👤 **Usuario** | usuario@demo.com | user123 | Catálogo, reservas, consultas y acceso a "Mi Panel" para autogestión. |

### **Características del Sistema de Auth:**
- 🔐 **Persistencia de Sesión** (simulada con localStorage)
- 🔄 **Ocultamiento dinámico de elementos** de interfaz según rol activo
- 🛡️ **Guards de ruta (CanActivate)** para protección de contenido

## 🎯 Funcionalidades Principales

### **👤 Para Usuarios Generales**
- 🏪 **Catálogo completo** con filtros inteligentes en tiempo real
- 🔍 **Búsqueda avanzada** por marca, modelo, precio, año
- 📱 **Detalles interactivos** con galería de imágenes responsive
- 💬 **Sistema de consultas** con seguimiento de estado
- 📋 **Reservas de vehículos** con validación automática
- 🔐 **Registro seguro** con validaciones en tiempo real

### **⚡ Experiencia Mejorada**
- 🚀 **Carga instantánea** con Signals reactivos
- 📝 **Formularios inteligentes** con autocompletado de datos de usuario
- ⚠️ **Validaciones dinámicas** que se adaptan mientras escribes
- 💾 **Estados de cambio** con indicadores visuales de datos pendientes
- 🎨 **UI moderna** con feedback visual inmediato
- ☁️ **Uso de Cloudinary** para almacenado de imágenes en la nube
- 💬 **Implmentación de Modales Flotantes** utilizando SweetAlert2
- 💻 **Separación de Responsabilidades con Guards** para protección de rutas
- 🧪 **Testing Estratégico (Limpieza de archivos .spec.ts)** autogenerados sin uso  para mantener un repositorio limpio y enfocado, priorizando el test del componente raíz para asegurar el levantamiento de la app en entornos modernos Zoneless.

### **🔧 Para Administradores**
- ➕ **Gestión completa** de inventario vehicular
- ✏️ **Edición en tiempo real** con validaciones estrictas
- 🗑️ **Eliminación segura** con confirmaciones
- 📞 **Gestión de consultas y reservas** con estados

## 🔧 Configuración

## 🗂️ Estructura de Datos

### **Base de Datos (db.json)**
```json
{
  "vehiculos": [...],    // Inventario completo con especificaciones
  "consultas": [...],    // Sistema de consultas con estados
  "reservas": [...],     // Reservas con validaciones
  "usuarios": [...]      // Autenticación y perfiles
}
```

### **Configuración de API**
- **Puerto backend**: `3000` (JSON Server)
- **Puerto frontend**: `4200` (Angular Dev Server)  
- **Endpoints**: Configurados en servicios con TypeScript estricto
- **HTTP Client**: Modernizado con `firstValueFrom()` pattern

## ⚙️ Configuración Avanzada

### **Variables de Entorno**
```typescript
// Configuración centrizada en servicios
const API_BASE = 'http://localhost:3000';
const API_ENDPOINTS = {
  vehicles: `${API_BASE}/vehiculos`,
  bookings: `${API_BASE}/reservas`,
  inquiries: `${API_BASE}/consultas`,
  users: `${API_BASE}/usuarios`
};
```

### **Servicios Modernizados**
- **AuthService** - JWT con Signals y autocompletado
- **VehicleClient** - CRUD con type safety completo
- **BookingService** - Reservas con validaciones dinámicas
- **InquiryService** - Consultas con estado híbrido RxJS+Signals

## 🤝 Contribución y Desarrollo

### **Workflow de Desarrollo**
```powershell
# 1. Fork y clona el repo
git clone https://github.com/Vickycabo/CAPE.git
cd CAPE

# 2. Crea rama para tu feature
git checkout -b feature/nueva-funcionalidad

# 3. Desarrolla siguiendo los estándares
npm run lint          # Verifica código
npm test              # Ejecuta tests
npm run build         # Valida build

# 4. Commit y push
git commit -m "feat: nueva funcionalidad increíble"
git push origin feature/nueva-funcionalidad

# 5. Crea Pull Request
```

### **Estándares de Código**
- **Angular Style Guide**: Convenciones oficiales de Angular
- **Signals First**: Preferir Signals sobre Observables para estado
- **Modern RxJS**: firstValueFrom() para operaciones HTTP

<div align="center">

**🚗 CAPE - Concesionaria de Autos**

*Desarrollado con* ❤️ *usando* **Angular 20+ Signals** *y* **TypeScript**

[![Made with Angular](https://img.shields.io/badge/Made%20with-Angular-red?logo=angular&logoColor=white)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Signals](https://img.shields.io/badge/Angular_Signals-✨-green)](https://angular.io/guide/signals)

</div>

# 🚗 CAPE - Concesionaria de Autos
## Sistema Moderno de Gestión Vehicular

[![Angular](https://img.shields.io/badge/Angular-17+-red?logo=angular)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Signals](https://img.shields.io/badge/Angular_Signals-✅-green)](https://angular.io/guide/signals)
[![RxJS](https://img.shields.io/badge/RxJS-Modern-purple?logo=rxjs)](https://rxjs.dev/)

Un sistema de gestión para concesionaria de autos desarrollado con **Angular 17+** utilizando la nueva arquitectura de **Signals** y **RxJS** para máximo rendimiento y reactividad.

## 🎯 Características Destacadas

### ⚡ **Arquitectura Moderna**
- **Signals de Angular 17+** para estado reactivo optimizado
- **RxJS + firstValueFrom()** para operaciones HTTP modernas  
- **Type Safety completo** - sin uso de `any`
- **Change Detection granular** para máximo rendimiento

### 🔧 **Funcionalidades Principales**
- **Catálogo inteligente** con filtros reactivos en tiempo real
- **Gestión completa de inventario** con validaciones dinámicas
- **Sistema de consultas** con estado de cambios pendientes
- **Reservas de vehículos** con autocompletado de datos
- **Autenticación robusta** con roles y persistencia
- **Panel administrativo** con operaciones CRUD completas

### 🎨 **Experiencia de Usuario**
- **Autocompletado inteligente** en formularios para usuarios logueados
- **Estados de carga** reactivos con feedback visual inmediato  
- **Validaciones dinámicas** que se adaptan en tiempo real
- **Interfaz responsive** con diseño moderno y accesible

## 🚀 Stack Tecnológico

### **Frontend Moderno**
- **Angular 17+** - Framework principal con standalone components
- **TypeScript 5.9.2** - Lenguaje con tipado estricto
- **Signals** - Sistema reactivo nativo de Angular
- **RxJS** - Para operaciones asíncronas y HTTP requests
- **CSS3** - Estilos con variables nativas y grid/flexbox

### **Backend & Datos**
- **JSON Server 1.0.0-beta.3** - API REST simulada para desarrollo
- **HTTP Client** - Comunicación moderna con firstValueFrom()
- **Reactive Forms** - Formularios reactivos con validaciones

### **Testing & Calidad**
- **Jasmine & Karma** - Testing unitario
- **TypeScript strict mode** - Máxima seguridad de tipos
- **ESLint** - Linting de código

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
- 🛡️ **Type Safety**: TypeScript estricto sin `any`
- 🧹 **Clean Code**: Sin memory leaks por subscripciones olvidadas

## 🛠️ Instalación y Configuración

### **Prerrequisitos**
- **Node.js** 20.10.0+ 
- **npm** (incluido con Node.js)
- **Angular CLI** 17+ (opcional)

### **Instalación Rápida**

1. **Clonar y configurar**:
   ```powershell
   git clone [URL_DEL_REPOSITORIO]
   cd CAPE-fran
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
| 👨‍💼 **Admin** | admin@concesionaria.com | admin123 | Gestión completa del sistema |
| Usuario | usuario@demo.com | user123 | Usuario cliente estándar |
| 👨‍💼 **Vendedor** | vendedor@concesionaria.com | vend123 | Operaciones de venta |

### **Características del Sistema de Auth:**
- 🔐 **Autenticación JWT** (simulada con localStorage)
- 🔄 **Auto-login** persistente entre sesiones
- 🛡️ **Guards de ruta** para protección de contenido
- 📝 **Autocompletado** de formularios para usuarios logueados

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

### **🔧 Para Administradores**
- ➕ **Gestión completa** de inventario vehicular
- ✏️ **Edición en tiempo real** con validaciones estrictas
- 🗑️ **Eliminación segura** con confirmaciones
- 📊 **Panel administrativo** con estadísticas en vivo
- 📞 **Gestión de consultas** con estados de seguimiento
- 📋 **Administración de reservas** con filtros avanzados

## 🧪 Testing y Calidad

```powershell
# Tests unitarios con Jasmine
npm test

# Tests con coverage detallado
ng test --code-coverage

# Linting de código
ng lint

# Build de producción con optimizaciones
npm run build --prod
```

## ⚡ Características Técnicas Avanzadas

### **🏗️ Arquitectura Moderna**
- **Angular 17+ Signals** - Estado reactivo sin subscripciones
- **TypeScript Strict Mode** - 100% type-safe, cero `any`
- **Standalone Components** - Arquitectura modular sin NgModules
- **RxJS + firstValueFrom()** - Patrón HTTP moderno sin .toPromise()

### **🎨 UI/UX Optimizada**  
- **Responsive Design** - Mobile-first con CSS Grid/Flexbox
- **Loading States** - Feedback visual con Signals reactivos
- **Form Validation** - Validaciones dinámicas en tiempo real
- **Error Handling** - Manejo robusto de errores HTTP

### **🔒 Seguridad y Rendimiento**
- **Route Guards** - Protección de rutas sensibles
- **Lazy Loading** - Carga diferida de módulos
- **Change Detection** - OnPush granular con Signals
- **Memory Management** - Sin memory leaks por subscripciones

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

## 🚀 Roadmap y Mejoras Futuras

### **🎯 Implementado (v1.0)**
- ✅ Migración completa a Angular 17+ Signals
- ✅ Eliminación de métodos deprecated (.toPromise → firstValueFrom)
- ✅ Type safety 100% (eliminación de 'any')
- ✅ Formularios con autocompletado inteligente
- ✅ UI/UX optimizada con estados reactivos

### **🔮 Próximas Funcionalidades (v2.0)**
- [ ] **PWA** - Aplicación web progresiva con service workers
- [ ] **Real-time** - WebSockets para notificaciones en vivo  
- [ ] **Analytics** - Dashboard con métricas de ventas
- [ ] **Mobile App** - Ionic + Angular para iOS/Android
- [ ] **Payment Gateway** - Integración con Stripe/PayPal
- [ ] **CRM Advanced** - Gestión completa de clientes

## 🤝 Contribución y Desarrollo

### **Workflow de Desarrollo**
```powershell
# 1. Fork y clona el repo
git clone https://github.com/tu-usuario/CAPE-fran.git
cd CAPE-fran

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
- **TypeScript Strict**: Sin `any`, máxima type safety
- **Angular Style Guide**: Convenciones oficiales de Angular
- **Signals First**: Preferir Signals sobre Observables para estado
- **Modern RxJS**: firstValueFrom() para operaciones HTTP

## 📊 Métricas del Proyecto

| **Aspecto** | **Estado** | **Detalle** |
|-------------|------------|-------------|
| 🏗️ **Arquitectura** | ✅ Moderna | Angular 17+ Signals + RxJS híbrido |
| 🛡️ **Type Safety** | ✅ 100% | Sin uso de `any`, interfaces completas |
| ⚡ **Performance** | ✅ Optimizada | Change detection granular con Signals |
| 🧪 **Testing** | ✅ Cubierto | Tests unitarios con Jasmine/Karma |
| 📱 **Responsive** | ✅ Completo | Mobile-first, CSS Grid/Flexbox |
| 🔐 **Seguridad** | ✅ Robusta | Guards de ruta, validaciones estrictas |

## 📞 Contacto y Soporte

- 📧 **Soporte técnico**: [Abrir Issue](https://github.com/tu-usuario/CAPE-fran/issues)
- 💬 **Discord**: [Comunidad CAPE](https://discord.gg/cape-dev)
- 📱 **Rama activa**: `maxi` (desarrollo principal)
- 🌐 **Demo en vivo**: [cape-demo.netlify.app](https://cape-demo.netlify.app)

---

<div align="center">

**🚗 CAPE - Concesionaria de Autos**

*Desarrollado con* ❤️ *usando* **Angular 17+ Signals** *y* **TypeScript**

[![Made with Angular](https://img.shields.io/badge/Made%20with-Angular-red?logo=angular&logoColor=white)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Signals](https://img.shields.io/badge/Angular_Signals-✨-green)](https://angular.io/guide/signals)

</div>

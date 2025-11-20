# DOCUMENTACIÓN TÉCNICA - SISTEMA CONCESIONARIA ANGULAR

## 📋 RESUMEN DEL PROYECTO

**Sistema de Concesionaria Angular CAPE-Fran**
- Framework: Angular 17+ (Standalone Components)
- Backend simulado: JSON Server (db.json)
- Autenticación: Sistema de roles (admin/usuario)
- Estado: Signals y RxJS Observables
- Styling: CSS personalizado con Grid/Flexbox

---

## 🏗️ ARQUITECTURA Y COMUNICACIÓN ENTRE COMPONENTES

### **1. ESTRUCTURA DE COMPONENTES**

```
src/app/
├── app.ts (Root Component)
├── header/ (Navegación principal)
├── footer/ (Pie de página)
├── login/ (Autenticación)
├── catalog/ (Catálogo de vehículos)
├── vehicle-details/ (Detalles de vehículo)
├── vehicle-form/ (Formulario nuevo vehículo)
├── booking-form/ (Formulario de reserva)
├── inquiry-form/ (Formulario de consulta)
├── admin/ (Panel administración)
├── consultas-list/ (Lista de consultas)
├── reservas-list/ (Lista de reservas)
└── services/
    ├── auth-service.ts
    ├── vehicle-client.ts
    ├── booking-service.ts
    └── inquiry-service.ts
```

### **2. FLUJO DE DATOS Y COMUNICACIÓN**

#### **A. AUTENTICACIÓN (AuthService)**
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   LoginComponent│───▶│   AuthService    │───▶│ Header/Guards   │
│                 │    │                  │    │                 │
│ - Formulario    │    │ - currentUser    │    │ - Menu dinámico │
│ - Validación    │    │ - login()        │    │ - Protección    │
│ - Redirección   │    │ - logout()       │    │ - Estado auth   │
└─────────────────┘    │ - isAdmin()      │    └─────────────────┘
                       │ - updateRole()   │
                       └──────────────────┘
```

**Comunicación:**
- **Signal**: `currentUser` reactivo para cambios de estado
- **LocalStorage**: Persistencia de sesión
- **HTTP**: CRUD operaciones con db.json/usuarios
- **Guards**: Protección de rutas admin

#### **B. GESTIÓN DE VEHÍCULOS**
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ CatalogComponent│───▶│  VehicleClient   │───▶│Vehicle-Details  │
│                 │    │                  │    │                 │
│ - Lista vehíc.  │    │ - getVehicles()  │    │ - Info completa │
│ - Filtros       │    │ - getById()      │    │ - Galería fotos │
│ - Paginación    │    │ - create/update  │    │ - Acciones      │
└─────────────────┘    │ - delete()       │    └─────────────────┘
                       └──────────────────┘
                                │
                       ┌──────────────────┐
                       │ VehicleForm      │
                       │                  │
                       │ - Crear/Editar   │
                       │ - Validaciones   │
                       │ - Upload imgs    │
                       └──────────────────┘
```

**Comunicación:**
- **HTTP Client**: Operaciones CRUD con db.json/vehiculos
- **Router**: Navegación entre lista y detalles
- **Params**: ID de vehículo vía URL
- **Forms**: Reactive Forms para crear/editar

#### **C. SISTEMA DE RESERVAS**
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│BookingForm      │───▶│ BookingService   │───▶│ ReservasList    │
│                 │    │                  │    │                 │
│ - Form reactivo │    │ - createBooking()│    │ - Admin view    │
│ - Validación    │    │ - getBookings()  │    │ - Eliminar      │
│ - VehicleId     │    │ - deleteBooking()│    │ - Filtros       │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

**Comunicación:**
- **Route Params**: ID vehículo desde catalog
- **HTTP**: POST/GET/DELETE a db.json/reservas
- **Admin Guard**: Solo admin ve reservas-list
- **Vehicle Client**: Info vehículo para mostrar

#### **D. SISTEMA DE CONSULTAS**
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│InquiryForm      │───▶│ InquiryService   │───▶│ ConsultasList   │
│                 │    │                  │    │                 │
│ - Form reactivo │    │ - createInquiry()│    │ - Admin view    │
│ - Validación    │    │ - getInquiries() │    │ - Cambio estado │
│ - VehicleId     │    │ - updateStatus() │    │ - Guardar       │
└─────────────────┘    │ - deleteInquiry()│    │ - Eliminar      │
                       └──────────────────┘    └─────────────────┘
```

**Comunicación:**
- **Pending Changes**: Map para cambios no guardados
- **Signal**: `hayCambios` para mostrar botón guardar
- **Batch Updates**: Guardar múltiples cambios
- **State Management**: Signals para reactividad

#### **E. PANEL DE ADMINISTRACIÓN**
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  AdminComponent │───▶│   AuthService    │───▶│  HeaderMenu     │
│                 │    │                  │    │                 │
│ - Lista usuarios│    │ - listUsers()    │    │ - Links admin   │
│ - Cambio roles  │    │ - updateRole()   │    │ - Protección    │
│ - Sistema guard │    │ - deleteUser()   │    │ - Estado auth   │
│ - Cambios pend. │    │ - getCurrentUser │    └─────────────────┘
└─────────────────┘    └──────────────────┘
```

**Comunicación:**
- **Role Restrictions**: Admin no puede cambiar su rol
- **Pending Changes**: Sistema de cambios diferidos
- **Confirmation Dialogs**: Para acciones destructivas
- **Real-time Updates**: Signals para UI reactiva

---

## 🔄 PATRONES DE COMUNICACIÓN

### **1. INYECCIÓN DE DEPENDENCIAS**
```typescript
// Servicios inyectados en componentes
private auth = inject(AuthService);
private vehicleClient = inject(VehicleClient);
private router = inject(Router);
```

### **2. SIGNALS (ESTADO REACTIVO)**
```typescript
// Estado reactivo con Signals
protected usuarios = signal<AppUser[]>([]);
protected cargando = signal(true);
protected hayCambios = signal(false);
```

### **3. OBSERVABLES (HTTP + ASYNC)**
```typescript
// Operaciones HTTP asíncronas
this.bookingService.getBookings().subscribe({
  next: bookings => this.reservas = bookings,
  error: () => this.error.set('Error cargando reservas')
});
```

### **4. ROUTER (NAVEGACIÓN)**
```typescript
// Navegación programática
this.router.navigate(['/vehicle-details', vehicleId]);
```

### **5. GUARDS (PROTECCIÓN RUTAS)**
```typescript
// Protección rutas admin
{
  path: 'admin',
  component: Admin,
  canActivate: [() => inject(AuthService).isAdmin()]
}
```

---

## 📊 FLUJO DE DATOS COMPLETO

### **CICLO DE VIDA USUARIO NORMAL:**
1. **Login** → AuthService → LocalStorage
2. **Catalog** → VehicleClient → Lista vehículos
3. **Vehicle Details** → Router params → Detalles
4. **Booking/Inquiry** → Forms → HTTP POST → db.json
5. **Logout** → AuthService → Limpia estado

### **CICLO DE VIDA ADMIN:**
1. **Login** → AuthService → isAdmin() = true
2. **Admin Panel** → AuthService → Lista usuarios
3. **Consultas/Reservas** → Services → CRUD operations
4. **User Management** → Pending changes → Batch updates
5. **Protected Actions** → Guards + Validations

---

## 🛡️ SEGURIDAD Y VALIDACIONES

### **FRONTEND GUARDS:**
- `isAdmin()` para rutas protegidas
- Validación usuario actual en eliminaciones
- Formularios reactivos con validadores
- Confirmaciones para acciones destructivas

### **ESTADO DE SESIÓN:**
- LocalStorage para persistencia
- Signals para reactividad
- Logout automático en errores auth
- Headers de navegación dinámicos

---

## 🎨 DISEÑO Y UX

### **SISTEMA DE ESTILOS:**
- CSS Grid/Flexbox para layouts
- Componentes standalone (no modules)
- Títulos uniformes con backdrop-filter
- Responsive design con breakpoints
- Transparencia ajustable del fondo

### **INTERACTIVIDAD:**
- Hover effects en tarjetas
- Loading states con signals
- Error handling con mensajes
- Confirmaciones antes de eliminar
- Sistema de cambios pendientes

---

## 🔧 TECNOLOGÍAS Y DEPENDENCIAS

### **CORE:**
- Angular 17+ (Standalone Components)
- TypeScript (tipos estrictos)
- RxJS (programación reactiva)
- Angular Router (navegación SPA)
- Angular Forms (formularios reactivos)

### **DESARROLLO:**
- JSON Server (backend simulado)
- Angular CLI (build system)
- CSS moderno (Grid, Flexbox, Variables)
- Git (control de versiones)

### **ESTRUCTURA DB (db.json):**
```json
{
  "vehiculos": [...],    // Catálogo de vehículos
  "usuarios": [...],     // Sistema de usuarios
  "consultas": [...],    // Consultas de clientes  
  "reservas": [...]      // Reservas realizadas
}
```

---

## 📈 ESCALABILIDAD Y MANTENIMIENTO

### **PATRONES IMPLEMENTADOS:**
- Separation of Concerns (componentes especializados)
- Single Responsibility (servicios dedicados) 
- Dependency Injection (testabilidad)
- Observable Pattern (estado asíncrono)
- Guard Pattern (protección de rutas)

### **POSIBLES MEJORAS:**
- State Management global (NgRx)
- Autenticación JWT real
- Validaciones backend
- Testing unitario/e2e
- Lazy loading de módulos
- PWA capabilities

---

**Fecha de creación:** 20 de Noviembre, 2025
**Versión del sistema:** 1.0.0
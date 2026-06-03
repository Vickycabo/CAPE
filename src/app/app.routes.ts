import { Routes } from '@angular/router';
import { Catalog } from './catalog/catalog';
import { VehicleDetails } from './vehicle-details/vehicle-details';
import { VehicleForm } from './vehicle-form/vehicle-form';
import { Login } from './login/login';
import { Admin } from './admin/admin';
import { ConsultasList } from './consultas-list/consultas-list';
import { ReservasList } from './reservas-list/reservas-list';
import { UserPanel } from './user-panel/user-panel';

//Guards proteccion de rutas para user logueado y admin
import { adminGuard } from './guards/admin-guard';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [{
        path: '', redirectTo: 'catalogo', pathMatch: 'full'
    },
    {
        path: 'catalogo', component: Catalog,
        title: 'Catálogo de autos'
    },
    {
        path: 'catalogo/:id', component: VehicleDetails,
        title: 'Detalles de Vehiculo'
    },
    {
        path: 'agregar-vehiculos', component: VehicleForm,
        title: "Agregar Vehículos",
       canActivate: [adminGuard]
    },
    {
        path: 'login', component: Login,
        title: "Iniciar Sesión"
    },
    {
        path: 'admin', component: Admin,
        title: 'Administración de Usuarios',
        canActivate: [adminGuard]
    },
    {
        path: 'reservas', component: ReservasList,
        title: 'Reservas Realizadas',
        canActivate: [adminGuard]
    },
    {
        path: 'consultas', component: ConsultasList,
        title: 'Consultas Recibidas',
        canActivate: [adminGuard]
    },
    {
        path: 'mi-panel', component: UserPanel,
        title: 'Mi Panel de Usuario',
        canActivate: [authGuard]
    },
    {
        path: '**', redirectTo: 'catalogo'
    }];

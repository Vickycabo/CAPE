import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Catalog } from './catalog/catalog';
import { VehicleDetails } from './vehicle-details/vehicle-details';
import { VehicleForm } from './vehicle-form/vehicle-form';
import { Login } from './login/login';
import { AuthService } from './auth-service';
import { Admin } from './admin/admin';

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
        canActivate: [() => {
            const auth = inject(AuthService);
            const router = inject(Router);
            return (auth.isLoggedIn() && auth.isAdmin()) || router.createUrlTree(['/login']);
        }]
    },
    {
        path: 'login', component: Login,
        title: "Iniciar Sesión"
    },
    {
        path: 'admin', component: Admin,
        title: 'Administración de Usuarios',
        canActivate: [() => {
            const auth = inject(AuthService);
            const router = inject(Router);
            return auth.isAdmin() || router.createUrlTree(['/login']);
        }]
    },
    {
        path: '**', redirectTo: 'catalogo'
    }];

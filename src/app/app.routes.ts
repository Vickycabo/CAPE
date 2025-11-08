import { Routes } from '@angular/router';
import { Catalog } from './catalog/catalog';
import { VehicleDetails } from './vehicle-details/vehicle-details';
import { VehicleForm } from './vehicle-form/vehicle-form';

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
        title: "Agregar Vehículos"
    },
    {
        path: '**', redirectTo: 'catalogo'
    }];

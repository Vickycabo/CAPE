import { Routes } from '@angular/router';
import { Catalog } from './catalog/catalog';
import { VehicleDetails } from './vehicle-details/vehicle-details';
import { VehicleForm } from './vehicle-form/vehicle-form';
import { InquiryForm } from './inquiry-form/inquiry-form';
import { BookingForm } from './booking-form/booking-form';

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
        path: 'reserva/:id', component: BookingForm,
        title: 'Reservar Vehiculo'
    },
    {
        path: 'consulta/:id', component: InquiryForm,
        title: "Consultar vehiculo"
    },
    {
        path: '**', redirectTo: 'catalogo'
    }];

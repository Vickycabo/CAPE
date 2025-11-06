import { Component, inject, linkedSignal, signal } from '@angular/core';
import { VehicleClient } from '../vehicle-client';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { VehicleForm } from '../vehicle-form/vehicle-form';
import { Vehicle } from '../vehicle';

@Component({
  selector: 'app-vehicle-details',
  imports: [],
  templateUrl: './vehicle-details.html',
  styleUrl: './vehicle-details.css',
})
export class VehicleDetails {

  private readonly client = inject(VehicleClient);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly id= this.route.snapshot.paramMap.get('id');

  protected readonly vehicleSource = toSignal(this.client.getVehicleById(this.id!));
  protected readonly vehicle = linkedSignal(() => this.vehicleSource());
  protected readonly isEditing = signal(false);

toggleEdit(){
  this.isEditing.set(!this.isEditing());
}

handleEdit(vehicle: Vehicle) {
    this.vehicle.set(vehicle);
    this.toggleEdit();
  }

  deleteVehicle() {
    if (confirm('Desea borrar este vehículo?')) {
      this.client.deleteVehicle(this.id!).subscribe(() => {
        alert('Vehículo borrado');
        this.router.navigateByUrl('/catalogo');
      });
    }
  }

  openInquiryForm() { //abrir form consulta
     this.router.navigateByUrl(`consulta/${this.id}`);
  }

  openBookingForm() { //abrir form reserva
    this.router.navigateByUrl(`reserva/${this.id}`);
  }
}




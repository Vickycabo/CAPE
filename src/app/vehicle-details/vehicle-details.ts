import { Component, inject, linkedSignal, signal } from '@angular/core';
import { VehicleClient } from '../vehicle-client';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { VehicleForm } from '../vehicle-form/vehicle-form';
import { Vehicle } from '../vehicle';
import { InquiryForm } from '../inquiry-form/inquiry-form';
import { BookingForm } from '../booking-form/booking-form';
import { CommonModule, DecimalPipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-vehicle-details',
  standalone: true,
  imports: [InquiryForm, BookingForm, DecimalPipe, CommonModule, ReactiveFormsModule],
  templateUrl: './vehicle-details.html',
  styleUrl: './vehicle-details.css'
})
export class VehicleDetails {

  private readonly client = inject(VehicleClient);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly id= this.route.snapshot.paramMap.get('id');

  protected readonly vehicleSource = toSignal(this.client.getVehicleById(this.id!));
  protected readonly vehicle = linkedSignal(() => this.vehicleSource());
  protected readonly isEditing = signal(false);
  protected readonly showInquiryForm = signal(false);
  protected readonly showBookingForm = signal(false);

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

  openInquiryForm() { 
     this.showInquiryForm.set(true);
     this.showBookingForm.set(false);
  }

  openBookingForm() { 
    this.showBookingForm.set(true);
    this.showInquiryForm.set(false);
  }

  closeForm() { 
    this.showInquiryForm.set(false);
    this.showBookingForm.set(false);
  }
}




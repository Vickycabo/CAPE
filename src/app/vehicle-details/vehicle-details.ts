import { Component, effect, inject, signal } from '@angular/core';
import { VehicleClient } from '../vehicle-client';
import { ActivatedRoute, Router } from '@angular/router';
import { Vehicle } from '../vehicle';
import { InquiryForm } from '../inquiry-form/inquiry-form';
import { BookingForm } from '../booking-form/booking-form';
import { CommonModule, DecimalPipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../auth-service';
import { VehicleForm } from '../vehicle-form/vehicle-form';

@Component({
  selector: 'app-vehicle-details',
  standalone: true,
  imports: [VehicleForm,InquiryForm, BookingForm, DecimalPipe, CommonModule, ReactiveFormsModule],
  templateUrl: './vehicle-details.html',
  styleUrl: './vehicle-details.css'
})
export class VehicleDetails {

  private readonly client = inject(VehicleClient);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly auth = inject(AuthService);
  protected readonly id = this.route.snapshot.paramMap.get('id');

  protected readonly vehicle = signal<Vehicle | null>(null);
  protected readonly isEditing = signal(false);
  protected readonly showInquiryForm = signal(false);
  protected readonly showBookingForm = signal(false);

  //Para los autos que tengan +1 foto
  protected readonly selectedImage = signal<string | undefined>(undefined);

  constructor() {
    this.loadVehicle();
    
    effect(() => {
      const currentVehicle = this.vehicle();
      if (currentVehicle && currentVehicle.images && currentVehicle.images.length > 0) {
        this.selectedImage.set(currentVehicle.images[0]);
      }
    });
  }

  private async loadVehicle() {
    if (this.id) {
      try {
        const vehicle = await this.client.getVehicleById(this.id);
        this.vehicle.set(vehicle);
      } catch (error) {
        console.error('Error cargando vehículo:', error);
        this.vehicle.set(null);
      }
    }
  }

  protected selectImage(image: string) {
    this.selectedImage.set(image);
  }

  toggleEdit(){
    this.isEditing.set(!this.isEditing());
  }

handleEdit(vehicle: Vehicle) {
    this.vehicle.set(vehicle);
    this.toggleEdit();
  }

  async deleteVehicle() {
    if (!this.isAdmin()) return;
    if (confirm('Desea borrar este vehículo?')) {
      try {
        await this.client.deleteVehicle(this.id!);
        alert('Vehículo borrado');
        this.router.navigateByUrl('/catalogo');
      } catch (error) {
        alert('Error al borrar el vehículo');
      }
    }
  }

  openInquiryForm() { 
     this.showInquiryForm.set(true);
     this.showBookingForm.set(false);
  }

  openBookingForm() {
    if (!this.auth.isLoggedIn()) {
      alert('Debes iniciar sesión para reservar un vehículo');
      this.router.navigate(['/login']);
      return;
    }
    this.showBookingForm.set(true);
    this.showInquiryForm.set(false);
  }

  closeForm() { 
    this.showInquiryForm.set(false);
    this.showBookingForm.set(false);
  }

  onImgError(event: Event) {
    const img = event.target as HTMLImageElement;
    const placeholderSvg = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400'><rect width='100%' height='100%' fill='%23e0e0e0'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='26' fill='%23777777'>Imagen no disponible</text></svg>";
    if (img && img.src !== placeholderSvg) {
      img.src = placeholderSvg;
      img.alt = (img.alt || 'Imagen') + ' (no disponible)';
    }
  }

  isAdmin() {
    return this.auth.isAdmin();
  }

  isLoggedIn() {
    return this.auth.isLoggedIn();
  }

}
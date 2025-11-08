import { Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { VehicleClient } from '../vehicle-client';
import { Vehicle } from '../vehicle';

@Component({
  selector: 'app-vehicle-form',
  imports: [ReactiveFormsModule],
  templateUrl: './vehicle-form.html',
  styleUrl: './vehicle-form.css',
})
export class VehicleForm {

  readonly brands = ['Toyota', 'Chevrolet', 'Honda', 'Mercedes-Benz'];
  readonly colors = ['Rojo', 'Blanco', 'Negro', 'Gris', 'Azul'];

  private readonly client = inject(VehicleClient);
  private readonly formBuilder = inject(FormBuilder);

  readonly isEditing = input(false);
  readonly vehicle = input<Vehicle>();
  readonly edited = output<Vehicle>();

  constructor() {
    effect(() => {
      if (this.isEditing() && this.vehicle()) {
        const vehicle = this.vehicle()!;
        // Convert numbers to string for form
        this.form.patchValue({
          ...vehicle,
          year: vehicle.year.toString(),
          price: vehicle.price.toString(),
          images: vehicle.images.join(',') // Convert array to string
        });
      }
    });
  }

  protected readonly form = this.formBuilder.nonNullable.group({
    brand: ['', Validators.required],
    model: ['', Validators.required],
    year: ['', [Validators.required, Validators.min(2000), Validators.max(2030)]],
    color: ['', Validators.required],
    price: ['', [Validators.required, Validators.min(1)]],
    images: ['', Validators.required],
    description: ['', Validators.required]
  });

 get brand() {return this.form.controls.brand;}
  get model() { return this.form.controls.model; }
  get year() { return this.form.controls.year; }
  get price() { return this.form.controls.price; }
  get images() { return this.form.controls.images; }
  get description() { return this.form.controls.description; }

  handleSubmit() {
    if (this.form.invalid) {
      alert("Formulario invalido");
      return;
    }

    if (confirm("Confirmar Datos?")) {
      const formValue = this.form.getRawValue();
      const vehicle: Vehicle = {
        ...formValue,
        year: Number(formValue.year),
        price: Number(formValue.price),
        images: formValue.images.split(',').map(img => img.trim())
      };

      if (!this.isEditing()) {
        this.client.addVehicle(vehicle).subscribe(() => {
          alert('Vehículo agregado');
          this.form.reset();
        });
      } else if (this.vehicle()) {
        this.client.updateVehicle(vehicle, this.vehicle()?.id!).subscribe((v) => {
        alert('Vehículo editado');
        this.edited.emit(v);
      });
    }
  }
}

  }


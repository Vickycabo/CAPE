import { Component, effect, inject, input, output, computed, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { VehicleClient } from '../vehicle-client';
import { Vehicle } from '../vehicle';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth-service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-vehicle-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './vehicle-form.html',
  styleUrl: './vehicle-form.css',
})
export class VehicleForm {

  readonly brands = ['Toyota', 'Chevrolet', 'Honda', 'Mercedes-Benz', "Ford", "Volkswagen","Audi"];
  readonly colors = ['Rojo', 'Blanco', 'Negro', 'Gris', 'Azul'];

  private readonly client = inject(VehicleClient);
  private readonly formBuilder = inject(FormBuilder);
  private readonly auth = inject(AuthService);

  readonly isEditing = input(false);
  readonly vehicle = input<Vehicle>();
  readonly edited = output<Vehicle>();

  // Signals para manejar cambios de formulario
  private brandValue = signal('');
  private colorValue = signal('');

  private readonly http = inject(HttpClient); // servicio para fotos cloudinary
  protected isUploading = signal(false);
  protected uploadedImages = signal<string[]>([]); // guardado de urls de las fotos
  
  constructor() {
    effect(() => {
      if (this.isEditing() && this.vehicle()) {
        const vehicle = this.vehicle()!;
        this.form.patchValue({
          ...vehicle,
          year: vehicle.year,
          price: vehicle.price,
          images: vehicle.images.join(',') // Convertir el arreglo de fotos a un string
        });
      }
    });

    // Effect para validación dinámica de marca personalizada
    effect(() => {
      const brandValue = this.brandValue();
      const customBrandControl = this.form.get('customBrand');
      if (brandValue === 'Otra') {
        customBrandControl?.setValidators([Validators.required]);
      } else {
        customBrandControl?.clearValidators();
      }
      customBrandControl?.updateValueAndValidity();
    });

    // Effect para validación dinámica de color personalizado
    effect(() => {
      const colorValue = this.colorValue();
      const customColorControl = this.form.get('customColor');
      if (colorValue === 'Otro') {
        customColorControl?.setValidators([Validators.required]);
      } else {
        customColorControl?.clearValidators();
      }
      customColorControl?.updateValueAndValidity();
    });
  }

  // Métodos para actualizar signals cuando cambian los valores del formulario
  onBrandChange(value: string) {
    this.brandValue.set(value);
  }

  onColorChange(value: string) {
    this.colorValue.set(value);
  }

  protected readonly canAdd = computed(() => this.auth.isLoggedIn() && this.auth.isAdmin());

  //Para que el año del auto pueda ser haste el año siguiente del actual (preventas/modelos próximos)
  protected readonly nextYear = new Date().getFullYear() + 1;

  protected readonly form = this.formBuilder.nonNullable.group({
    brand: ['', Validators.required],
    customBrand: [''],
    model: ['', Validators.required],
    year: [1980, [Validators.required, Validators.min(1980), Validators.max(this.nextYear)]],
    color: ['', Validators.required],
    customColor: [''],
    price: [1000000, [Validators.required, Validators.min(1)]],
    images: ['', Validators.required],
    description: ['', Validators.required]
  });

 get brand() {return this.form.controls.brand;}
  get customBrand() {return this.form.controls.customBrand;}
  get model() { return this.form.controls.model; }
  get year() { return this.form.controls.year; }
  get color() { return this.form.controls.color; }
  get customColor() {return this.form.controls.customColor;}
  get price() { return this.form.controls.price; }
  get images() { return this.form.controls.images; }
  get description() { return this.form.controls.description; }


// funcion para guardado de fotos en nube cloudinary
  async onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    this.isUploading.set(true);


    const data = new FormData(); //datos
    data.append('file', file);
    data.append('upload_preset', 'concesionaria_preset'); // nombre del preset de la nube
    data.append('cloud_name', 'dgipsuntz'); // mi cuenta en cloudinary

    try {
      const response: any = await firstValueFrom(
        this.http.post(`https://api.cloudinary.com/v1_1/dgipsuntz/image/upload`, data)
      );
      
     
      this.uploadedImages.update(prev => [...prev, response.secure_url]); //agregar url a la nube
      

      this.form.controls.images.setValue(this.uploadedImages().join(',')); //actualizar campo del form
      
    } catch (error) {
      alert("Error al subir la imagen a la nube");
      console.error(error);
    } finally {
      this.isUploading.set(false);
    }
  }

  async handleSubmit() {
    if (this.form.invalid || this.isUploading()) {
      alert("Formulario inválido o imagen subiéndose...");
      return;
    }

    if (confirm("¿Confirmar Datos?")) {
      const formValue = this.form.getRawValue();
      const finalBrand = formValue.brand === 'Otra' ? formValue.customBrand : formValue.brand;
      const finalColor = formValue.color === 'Otro' ? formValue.customColor : formValue.color;
      
      const vehicle: Vehicle = {
        ...formValue,
        brand: finalBrand!,
        color: finalColor!,
        year: Number(formValue.year),
        price: Number(formValue.price),
        images: formValue.images.split(',').map(img => img.trim()) //uso de las urls ya de cloudinary
      };
      try {
        if (!this.isEditing()) {
          await this.client.addVehicle(vehicle);
          alert('Vehículo agregado');
          this.form.reset();
        } else if (this.vehicle()) {
          const updatedVehicle = await this.client.updateVehicle(vehicle, this.vehicle()?.id!);
          if (updatedVehicle) {
            alert('Vehículo editado');
            this.edited.emit(updatedVehicle);
          }
        }
      } catch (error) {
        alert('Error al procesar el vehículo');
      }
    }
  }

  }


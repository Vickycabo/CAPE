import { Component, computed, inject, signal } from '@angular/core';
import { VehicleClient } from '../vehicle-client';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule, DecimalPipe } from '@angular/common';
import { AuthService } from '../auth-service';
import { Vehicle } from '../vehicle';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [DecimalPipe, CommonModule],
  templateUrl: './catalog.html',
  styleUrl: './catalog.css'
})
export class Catalog {

  private readonly client = inject(VehicleClient);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  private readonly allVehicles = signal<Vehicle[] | undefined>(undefined);
  protected readonly isLoading = computed(() => this.allVehicles() === undefined);

  constructor() {
    this.loadVehicles();
  }

  private loadVehicles() {
    this.client.getVehicles().subscribe(v => this.allVehicles.set(v));
  }

  // Signals para los filtros
  protected readonly filterBrand = signal('');
  protected readonly filterYear = signal('');
  protected readonly filterMaxPrice = signal('');

  // Obtener marcas disponibles en el catálogo
  protected readonly availableBrands = computed(() => {
    const all = this.allVehicles() || [];
    const brands: string[] = [];

    // Recorrer todos los vehículos y sacar las marcas
    for (const vehicle of all) {
      if (vehicle.brand && !brands.includes(vehicle.brand)) {
        brands.push(vehicle.brand);
      }
    }

    return brands.sort(); // ordenar alfabéticamente
  });

  // Obtener años disponibles en el catálogo
  protected readonly availableYears = computed(() => {
    const all = this.allVehicles() || [];
    const years: number[] = [];

    // Recorrer todos los vehículos y sacar los años
    for (const vehicle of all) {
      if (vehicle.year && !years.includes(vehicle.year)) {
        years.push(vehicle.year);
      }
    }

    return years.sort((a, b) => b - a); // ordenar de mayor a menor
  });

  // Obtener precios disponibles en el catálogo
  protected readonly availablePrices = computed(() => {
    const all = this.allVehicles() || [];
    const prices: number[] = [];

    // Recorrer todos los vehículos y sacar los precios
    for (const vehicle of all) {
      if (vehicle.price && !prices.includes(vehicle.price)) {
        prices.push(vehicle.price);
      }
    }

    // Ordenar de menor a mayor
    return prices.sort((a, b) => a - b);
  });

  // Computed signal que filtra los vehículos
  protected readonly vehicles = computed(() => {
    const all = this.allVehicles() || [];
    const brand = this.filterBrand().toLowerCase();
    const year = this.filterYear();
    const maxPrice = this.filterMaxPrice();

    return all.filter(vehicle => {
      const matchBrand = !brand || vehicle.brand.toLowerCase().includes(brand);
      const matchYear = !year || vehicle.year.toString() === year;
      const matchPrice = !maxPrice || vehicle.price <= Number(maxPrice);

      return matchBrand && matchYear && matchPrice;
    });
  });

  navigateToDetails(id: string | number) {
    this.router.navigateByUrl(`catalogo/${id}`);
  }

  clearFilters() {
    this.filterBrand.set('');
    this.filterYear.set('');
    this.filterMaxPrice.set('');
  }

  // Fallback para imágenes externas que fallen: usa un data URI 1x1
  onImgError(event: Event) {
    const img = event.target as HTMLImageElement;
    const placeholderSvg = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'><rect width='100%' height='100%' fill='%23cccccc'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='20' fill='%23666666'>Imagen no disponible</text></svg>";
    if (img && img.src !== placeholderSvg) {
      img.src = placeholderSvg;
      img.alt = (img.alt || 'Imagen') + ' (no disponible)';
    }
  }

  isAdmin() {
    return this.auth.isAdmin();
  }

  deleteVehicle(id: string | number) {
    if (!this.isAdmin()) return;
    if (confirm('¿Eliminar este vehículo?')) {
      this.client.deleteVehicle(id).subscribe(() => {
        this.loadVehicles();
        alert('Vehículo eliminado');
      });
    }
  }
}

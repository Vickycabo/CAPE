import { Component, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs'
import { VehicleClient } from '../vehicle-client';
import { Router } from '@angular/router';
import { CommonModule, DecimalPipe } from '@angular/common';
import { AuthService } from '../auth-service';
import { Vehicle } from '../vehicle';
import Swal from 'sweetalert2';

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

  //tema banner opcional poner
  private readonly http = inject(HttpClient);
  protected bannerUrl = signal<string | null>(localStorage.getItem('hero_banner'));
  protected bannerLink = signal<string | null>(localStorage.getItem('hero_banner_link')); //señal para poner un hipervinculo al banner
  protected isUploadingBanner = signal(false);

  private readonly allVehicles = signal<Vehicle[] | undefined>(undefined);
  protected readonly isLoading = computed(() => this.allVehicles() === undefined);
  protected readonly sortOrder = signal(''); //para ordenar por año de vehiculo o precio asc o desc
  
  constructor() {
    this.loadVehicles();
  }

  private async loadVehicles() {
    try {
      const vehicles = await this.client.getVehicles();
      this.allVehicles.set(vehicles);
    } catch (error) {
      console.error('Error cargando vehículos:', error);
      this.allVehicles.set([]);
    }
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

    let filtered = all.filter(vehicle => {
      const matchBrand = !brand || vehicle.brand.toLowerCase().includes(brand);
      const matchYear = !year || vehicle.year.toString() === year;
      const matchPrice = !maxPrice || vehicle.price <= Number(maxPrice);

      return matchBrand && matchYear && matchPrice;
    });

    //para ordenar por precio menor o mayor y año mas viejo o mas nuevo
    const order = this.sortOrder();
    if (order === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (order === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (order === 'year-desc') {
      filtered.sort((a, b) => b.year - a.year);
    } else if (order === 'year-asc') {
      filtered.sort((a, b) => a.year - b.year);
    }
    return filtered;
  });

  navigateToDetails(id: string | number) {
    this.router.navigateByUrl(`catalogo/${id}`);
  }

  clearFilters() {
    this.filterBrand.set('');
    this.filterYear.set('');
    this.filterMaxPrice.set('');
    this.sortOrder.set('');
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

  async deleteVehicle(id: string | number) {
    if (!this.isAdmin()) return;

     const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "¡No podrás revertir esta acción! El vehículo se borrará permanentemente.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33', 
            cancelButtonColor: '#6c757d', 
            confirmButtonText: 'Si, borrar vehículo',
            cancelButtonText: 'Cancelar'
          });
     if (result.isConfirmed)  {
      try {
        await this.client.deleteVehicle(id);
        await this.loadVehicles();
         
              await Swal.fire({
                title: '¡Borrado!',
                text: 'El vehículo se eliminó del catalogo.',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
              });
      
      } catch (error) {
        Swal.fire('Error', 'Error al borrar el vehiculo', 'error');
      }
    
    }
  }

  //controles para el banner (si es que se quiere poner uno): agregar/eliminar/cambiar
  async onBannerSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    this.isUploadingBanner.set(true);
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'concesionaria_preset');
    data.append('cloud_name', 'dgipsuntz');

    try {
      const response: any = await firstValueFrom(
        this.http.post(`https://api.cloudinary.com/v1_1/dgipsuntz/image/upload`, data)
      );
      
      //guardar link del banner si lo hay
      this.bannerUrl.set(response.secure_url);
      localStorage.setItem('hero_banner', response.secure_url);

      // preguntar si quiere poner un hipervinculo al banner
      const { value: vehicleId } = await Swal.fire({
        title: '¡Imagen subida!',
        text: 'Para que al hacer clic en el banner, lleve al usuario a un auto del catálogo, ingresa su ID (ej: 2). Si no, dejalo vacio.',
        input: 'text',
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Omitir'
      });

      //se guarida el enlace si se ingresó algo
      if (vehicleId) {
        this.bannerLink.set(vehicleId);
        localStorage.setItem('hero_banner_link', vehicleId);
      } else {
        this.bannerLink.set(null);
        localStorage.removeItem('hero_banner_link');
      }
      
      Swal.fire({
        icon: 'success',
        title: 'Banner actualizado',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000
      });
    } catch (error) {
      Swal.fire('Error', 'No se pudo subir el banner a la nube', 'error');
    } finally {
      this.isUploadingBanner.set(false);
      event.target.value = '';
    }
  }

//sacar un banner si es que se puso uno al igual que el link de redireccion de ese banner
removeBanner() {
    this.bannerUrl.set(null);
    this.bannerLink.set(null);
    localStorage.removeItem('hero_banner');
    localStorage.removeItem('hero_banner_link');
  }

  onBannerClick() {
    const link = this.bannerLink();
    if (link) {
      this.router.navigateByUrl(`/catalogo/${link}`); //router para redirigir al auto (link del banner)
    }
  }
}

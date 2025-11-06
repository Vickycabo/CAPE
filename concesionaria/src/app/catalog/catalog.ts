import { Component, computed, inject } from '@angular/core';
import { VehicleClient } from '../vehicle-client';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-catalog',
  imports: [],
  templateUrl: './catalog.html',
  styleUrl: './catalog.css',
})
export class Catalog {

  private readonly client = inject(VehicleClient);
  private readonly router = inject(Router);
  protected readonly vehicles = toSignal(this.client.getVehicles());
  protected readonly isLoading = computed(() => this.vehicles() === undefined);

  navigateToDetails(id: string | number) {
    this.router.navigateByUrl(`catalogo/${id}`);
  }

//    autos: any[] = [];
//   marcaSeleccionada = '';

//   filtrarPorMarca(marca: string) {
//     this.marcaSeleccionada = marca;
//     this.autosService.getAutos().subscribe((data: any[]) => {
//       this.autos = data.filter(auto => auto.marca === marca);
//     });
//   }


}

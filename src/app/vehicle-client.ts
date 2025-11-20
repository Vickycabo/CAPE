import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, computed } from '@angular/core';
import { Vehicle } from './vehicle';

@Injectable({
  providedIn: 'root',
})
export class VehicleClient {
  
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/vehiculos';
  
  // Signals para manejo de estado
  private readonly vehicles = signal<Vehicle[]>([]);
  private readonly loading = signal(false);
  private readonly error = signal<string | null>(null);
  
  // Computed signals
  readonly vehiclesComputed = computed(() => this.vehicles());
  readonly isLoadingComputed = computed(() => this.loading());
  readonly errorComputed = computed(() => this.error());

  async getVehicles(): Promise<Vehicle[]> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const vehicles = await this.http.get<Vehicle[]>(this.baseUrl).toPromise();
      this.vehicles.set(vehicles || []);
      return this.vehicles();
    } catch (err) {
      this.error.set('Error cargando vehículos');
      return [];
    } finally {
      this.loading.set(false);
    }
  }

  async getVehicleById(id: string | number): Promise<Vehicle | null> {
    try {
      const vehicle = await this.http.get<Vehicle>(`${this.baseUrl}/${id}`).toPromise();
      return vehicle || null;
    } catch (err) {
      this.error.set('Error cargando vehículo');
      return null;
    }
  }

  async addVehicle(vehicle: Vehicle): Promise<Vehicle | null> {
    try {
      const newVehicle = await this.http.post<Vehicle>(this.baseUrl, vehicle).toPromise();
      if (newVehicle) {
        this.vehicles.update(vehicles => [...vehicles, newVehicle]);
      }
      return newVehicle || null;
    } catch (err) {
      this.error.set('Error agregando vehículo');
      throw err;
    }
  }

  async updateVehicle(vehicle: Vehicle, id: string | number): Promise<Vehicle | null> {
    try {
      const updatedVehicle = await this.http.put<Vehicle>(`${this.baseUrl}/${id}`, vehicle).toPromise();
      if (updatedVehicle) {
        this.vehicles.update(vehicles => 
          vehicles.map(v => v.id == id ? updatedVehicle : v)
        );
      }
      return updatedVehicle || null;
    } catch (err) {
      this.error.set('Error actualizando vehículo');
      throw err;
    }
  }

  async deleteVehicle(id: string | number): Promise<void> {
    try {
      await this.http.delete(`${this.baseUrl}/${id}`).toPromise();
      this.vehicles.update(vehicles => vehicles.filter(v => v.id != id));
    } catch (err) {
      this.error.set('Error eliminando vehículo');
      throw err;
    }
  }

}

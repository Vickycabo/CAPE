import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Vehicle } from './vehicle';

@Injectable({
  providedIn: 'root',
})
export class VehicleClient {
  
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/vehiculos';

   getVehicles() {
    return this.http.get<Vehicle[]>(this.baseUrl);
  }

  getVehicleById(id: string | number) {
    return this.http.get<Vehicle>(`${this.baseUrl}/${id}`);
  }

  addVehicle(vehicle: Vehicle) {
    return this.http.post<Vehicle>(this.baseUrl, vehicle);
  }

  updateVehicle(vehicle: Vehicle, id: string | number) {
    return this.http.put<Vehicle>(`${this.baseUrl}/${id}`, vehicle);
  }

  deleteVehicle(id: string | number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

}

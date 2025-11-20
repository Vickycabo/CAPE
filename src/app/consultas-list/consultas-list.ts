import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InquiryService } from '../inquiry-service';
import { VehicleClient } from '../vehicle-client';
import { Inquiry } from '../inquiry';
import { Vehicle } from '../vehicle';

@Component({
  selector: 'app-consultas-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './consultas-list.html',
  styleUrl: './consultas-list.css'
})
export class ConsultasList {
  private inquiryService = inject(InquiryService);
  private vehicleClient = inject(VehicleClient);

  protected consultas: Inquiry[] = [];
  protected vehiculos: Vehicle[] = [];
  protected cargando = signal(true);
  protected error = signal('');
  protected cambiosPendientes = new Map<string | number, string>();
  protected guardando = signal(false);

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.cargando.set(true);
    
    // Cargar vehículos y consultas en paralelo
    Promise.all([
      this.vehicleClient.getVehicles().toPromise(),
      this.inquiryService.getInquiries().toPromise()
    ]).then(([vehiculos, consultas]) => {
      this.vehiculos = vehiculos || [];
      this.consultas = consultas || [];
      this.cargando.set(false);
    }).catch(() => {
      this.error.set('Error cargando los datos');
      this.cargando.set(false);
    });
  }

  getVehicleInfo(vehicleId: string | number | undefined): string {
    if (!vehicleId) return 'Consulta general';
    const vehicle = this.vehiculos.find(v => v.id == vehicleId);
    return vehicle ? `${vehicle.brand} ${vehicle.model} (${vehicle.year})` : `Vehículo ID: ${vehicleId}`;
  }

  getStatusClass(status: string | undefined): string {
    return status === 'contactado' ? 'contactado' : 'pendiente';
  }

  getStatusText(status: string | undefined): string {
    return status === 'contactado' ? 'Contactado' : 'Pendiente';
  }

  cambiarEstado(consulta: Inquiry, nuevoEstado: string) {
    if (!consulta.id) return;
    
    if (nuevoEstado === consulta.status) {
      // Si vuelve al estado original, eliminar de cambios pendientes
      this.cambiosPendientes.delete(consulta.id);
    } else {
      // Guardar el cambio pendiente
      this.cambiosPendientes.set(consulta.id, nuevoEstado);
    }
  }

  guardarCambios() {
    if (this.cambiosPendientes.size === 0) return;
    
    this.guardando.set(true);
    const cambiosArray = Array.from(this.cambiosPendientes.entries());
    let cambiosCompletados = 0;
    let errores = 0;
    
    cambiosArray.forEach(([consultaId, nuevoEstado]) => {
      this.inquiryService.updateInquiryStatus(consultaId, nuevoEstado).subscribe({
        next: (updated) => {
          const index = this.consultas.findIndex(c => c.id === updated.id);
          if (index >= 0) {
            this.consultas[index] = updated;
          }
          cambiosCompletados++;
          this.verificarCompletado(cambiosArray.length, cambiosCompletados, errores);
        },
        error: () => {
          errores++;
          this.verificarCompletado(cambiosArray.length, cambiosCompletados, errores);
        }
      });
    });
  }

  private verificarCompletado(total: number, completados: number, errores: number) {
    if (completados + errores === total) {
      this.guardando.set(false);
      
      if (errores === 0) {
        this.cambiosPendientes.clear();
        alert(`${completados} cambio(s) guardado(s) exitosamente`);
      } else if (completados > 0) {
        // Limpiar solo los cambios exitosos
        this.cambiosPendientes.clear();
        alert(`${completados} cambio(s) guardado(s), ${errores} error(es)`);
      } else {
        alert('Error al guardar los cambios');
      }
    }
  }

  tieneChangesPendientes(consultaId: string | number | undefined): boolean {
    if (!consultaId) return false;
    return this.cambiosPendientes.has(consultaId);
  }

  getEstadoActual(consulta: Inquiry): string {
    if (!consulta.id) return consulta.status || 'pendiente';
    return this.cambiosPendientes.get(consulta.id) || consulta.status || 'pendiente';
  }

  cancelarCambios() {
    this.cambiosPendientes.clear();
  }

  eliminarConsulta(consulta: Inquiry) {
    if (!consulta.id) return;
    
    if (confirm(`¿Está seguro de que desea eliminar la consulta de ${consulta.name}?`)) {
      this.inquiryService.deleteInquiry(consulta.id).subscribe({
        next: () => {
          this.consultas = this.consultas.filter(c => c.id !== consulta.id);
        },
        error: () => {
          alert('Error al eliminar la consulta');
        }
      });
    }
  }
}
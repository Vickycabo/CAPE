import { Component, inject, signal, computed } from '@angular/core';
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

  protected consultas = signal<Inquiry[]>([]);
  protected vehiculos = signal<Vehicle[]>([]);
  protected cargando = signal(true);
  protected error = signal('');
  protected cambiosPendientes = new Map<string | number, string>();
  protected guardando = signal(false);
  
  // Computed signals
  protected consultasComputed = computed(() => this.consultas());
  protected vehiculosComputed = computed(() => this.vehiculos());
  protected hayCambiosPendientes = computed(() => this.cambiosPendientes.size > 0);

  ngOnInit() {
    this.cargarDatos();
  }

  async cargarDatos() {
    this.cargando.set(true);
    this.error.set('');
    
    try {
      // Cargar vehículos y consultas en paralelo usando signals
      const [vehiculos, consultas] = await Promise.all([
        this.vehicleClient.getVehicles(),
        this.inquiryService.getInquiries()
      ]);
      
      this.vehiculos.set(vehiculos);
      this.consultas.set(consultas);
    } catch (err) {
      this.error.set('Error cargando los datos');
    } finally {
      this.cargando.set(false);
    }
  }

  getVehicleInfo(vehicleId: string | number | undefined): string {
    if (!vehicleId) return 'Consulta general';
    const vehicle = this.vehiculos().find(v => v.id == vehicleId);
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

  async guardarCambios() {
    if (this.cambiosPendientes.size === 0) return;
    
    this.guardando.set(true);
    const cambiosArray = Array.from(this.cambiosPendientes.entries());
    
    try {
      // Procesar todos los cambios en paralelo
      const resultados = await Promise.allSettled(
        cambiosArray.map(([consultaId, nuevoEstado]) => 
          this.inquiryService.updateInquiryStatus(consultaId, nuevoEstado)
        )
      );
      
      const exitosos = resultados.filter(r => r.status === 'fulfilled').length;
      const errores = resultados.filter(r => r.status === 'rejected').length;
      
      // Actualizar las consultas localmente
      await this.cargarDatos();
      
      if (errores === 0) {
        this.cambiosPendientes.clear();
        alert(`${exitosos} cambio(s) guardado(s) exitosamente`);
      } else if (exitosos > 0) {
        this.cambiosPendientes.clear();
        alert(`${exitosos} cambio(s) guardado(s), ${errores} error(es)`);
      } else {
        alert('Error al guardar los cambios');
      }
    } catch (err) {
      this.error.set('Error guardando cambios');
    } finally {
      this.guardando.set(false);
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

  async eliminarConsulta(consulta: Inquiry) {
    if (!consulta.id) return;
    
    if (confirm(`¿Está seguro de que desea eliminar la consulta de ${consulta.name}?`)) {
      try {
        await this.inquiryService.deleteInquiry(consulta.id);
        this.consultas.update(consultas => consultas.filter(c => c.id !== consulta.id));
        // Remover cambios pendientes si los había
        this.cambiosPendientes.delete(consulta.id);
      } catch (err) {
        alert('Error al eliminar la consulta');
      }
    }
  }
}
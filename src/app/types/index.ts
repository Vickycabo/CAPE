// ===== TIPOS CENTRALIZADOS PARA LA APLICACIÓN CAPE =====

// Usuario de la aplicación
export interface AppUser {
  id: number | string;
  name: string;
  email: string;
  password: string;
  rol: 'admin' | 'usuario';
}

// Vehículo
export interface Vehicle {
  id: string | number;
  brand: string;
  customBrand?: string;
  model: string;
  year: number;
  color: string;
  customColor?: string;
  price: number;
  images: string[];
  description: string;
}

// Consulta/Inquiry
export interface Inquiry {
  id: string | number;
  name: string;
  email: string;
  phone: string;
  message: string;
  vehicleId?: string | number;
  date: string;
  status: 'pendiente' | 'contactado' | 'cerrado';
}

// Reserva/Booking
export interface Booking {
  id: string | number;
  name: string;
  email: string;
  phone: string;
  date: string;
  vehicleId: string | number;
  userId: string | number;
}

// Formularios - DTOs (Data Transfer Objects)
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}

export interface InquiryFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  date: string;
}

export interface VehicleFormData {
  brand: string;
  customBrand?: string;
  model: string;
  year: number;
  color: string;
  customColor?: string;
  price: number;
  images: string[];
  description: string;
}

// Respuestas de API
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  code?: number;
  details?: any;
}

// Estados de la aplicación
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// Filtros
export interface VehicleFilters {
  brand?: string;
  year?: number;
  minPrice?: number;
  maxPrice?: number;
  color?: string;
}

export interface InquiryFilters {
  status?: Inquiry['status'];
  dateFrom?: string;
  dateTo?: string;
}
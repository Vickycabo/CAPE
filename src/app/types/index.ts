// ===== TIPOS CENTRALIZADOS PARA LA APLICACIÓN CAPE =====

import { Inquiry } from '../inquiry';
export * from '../auth-service'; 
export * from '../vehicle';     
export * from '../inquiry';     
export * from '../booking';      

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
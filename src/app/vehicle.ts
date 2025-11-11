export interface Vehicle {
    id?: string | number;
    brand: string;
    model: string;
    year: number;
    color: string;
    price: number;
    images: string[]; // array de URLs
    description: string
}

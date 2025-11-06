export interface Vehicle {
    id?: string | number;
    brand: string;
    model: string;
    year: string;
    color: string;
    price: string | number;
    images: string[]; // array de URLs
    description: string
}

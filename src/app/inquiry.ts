export interface Inquiry { //Consultas
    id?: string | number,
    name: string,
    email: string,
    phone: string,
    message: string,
    vehicleId?: string | number,
    date?: string,
    status?: string
}

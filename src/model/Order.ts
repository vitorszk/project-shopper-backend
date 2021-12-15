export type OrderInputDTO = {
    id?: string,
    client_name: string,
    delivery_date: string, // to do: verificar tipagem pq no SQL tá DATETIME.
    amount: number,
    created_at?: string, //
    products?: ProductInputDTO[]
}

export type ProductInputDTO = {
    id: string,
    qty: number,
    price: number
}

export type ProductInStockDTO = {
    id: string,
    qty_stock: number,
    price: number
}

export type Product = {
    id: string,
    name: string,
    price: number,
    qty_stock: number
}
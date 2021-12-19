import { ProductInputDTO } from "./Product";

export type OrderInputDTO = {
  id?: string;
  client_name: string;
  delivery_date: string; // to do: verificar tipagem pq no SQL tá DATETIME.
  amount: number;
  created_at?: string; //
  products?: ProductInputDTO[];
};

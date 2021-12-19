export type ProductInputDTO = {
  id: string;
  qty: number;
  price: number;
};

export type ProductWriteOffDTO = {
  id: string;
  qty: number;
};

export type ProductInStockDTO = {
  id: string;
  qty_stock: number;
  price: number;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  qty_stock: number;
};

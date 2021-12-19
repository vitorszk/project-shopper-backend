import { ApiDatabase } from "../data/ApiDatabase";
import { OrderInputDTO } from "../model/Order";
import { Product, ProductInputDTO, ProductInStockDTO } from "../model/Product";
import { GenerateId } from "../services/generateId";

export class ApiBusiness {
  async getInventory(): Promise<Product[]> {
    const apiDatabase = new ApiDatabase();
    const inventory = await apiDatabase.getInventory();

    return inventory;
  }

  async createOrder(order: OrderInputDTO) {
    if (!order.client_name || !order.delivery_date || !order.amount) {
      throw new Error("Por favor, preencha todas as informações!");
    }

    const genId = new GenerateId();
    const id: string = genId.generate();

    const dateNow = Date.now();
    const created_at = new Date(dateNow).toISOString();

    const newOrder = { id, ...order, created_at };
    const apiDatabase = new ApiDatabase();
    await apiDatabase.createOrder(newOrder);

    return id;
  }

  async verifyStock(products: ProductInputDTO[], amount: number) {
    const apiDatabase = new ApiDatabase();
    const promises = products.map(({ id }) => apiDatabase.getProductById(id));

    const productsInStock = await Promise.all(promises).then(
      (values) => values
    );

    const invalidProducts = this.verifyInvalidProducts(
      products,
      productsInStock
    );

    if (invalidProducts.length > 0)
      throw new Error(
        `Produtos inválidos: ${invalidProducts.map(({ id }) => id)}`
      );

    const amountByStock = this.verifyAmount(products, productsInStock);

    if (amountByStock !== amount)
      throw new Error(`Valor total divergente, deveria ser ${amountByStock}`);

    return productsInStock;
  }

  async createOrderDetail(products: ProductInputDTO[], order_id: string) {
    const apiDatabase = new ApiDatabase();
    const promises = products.map((item) => {
      const genId = new GenerateId();
      const id: string = genId.generate();
      const orderDetail = {
        id,
        product_id: item.id,
        order_id,
        product_qty: item.qty,
        product_price: item.price,
      };
      return apiDatabase.createOrderDetail(orderDetail);
    });

    await Promise.all(promises);
  }

  async writeOffStock(
    products: ProductInputDTO[],
    productsInStock: ProductInStockDTO[]
  ) {
    const apiDatabase = new ApiDatabase();

    const promises = products.map((item) => {
      const productInStock = this.findProductInStock(productsInStock, item.id);

      if (!productInStock) {
        throw new Error(
          "Erro ao dar baixa no estoque. Produto não encontrado."
        );
      }

      const product = { qty: productInStock.qty_stock - item.qty, id: item.id };
      return apiDatabase.writeOffStock(product);
    });

    await Promise.all(promises);
  }

  findProductInStock(products: ProductInStockDTO[], id: string) {
    return products.find((product) => product.id === id);
  }

  verifyInvalidProducts(
    productReq: ProductInputDTO[],
    productInStock: ProductInStockDTO[]
  ) {
    const invalidProducts = productReq.filter((element) =>
      productInStock.find((element2) =>
        this.validateWriteOff(element, element2)
      )
    );
    return invalidProducts;
  }

  validateWriteOff(
    productReq: ProductInputDTO,
    productInStock: ProductInStockDTO
  ) {
    return (
      productReq.id === productInStock.id &&
      productInStock.qty_stock - productReq.qty < 0
    );
  }

  verifyAmount(
    productReq: ProductInputDTO[],
    productInStock: ProductInStockDTO[]
  ) {
    let amount = 0;
    productReq.forEach((element) => {
      const priceInStock = productInStock.find(
        (element2) => element.id === element2.id
      )?.price;
      if (!priceInStock) throw new Error("Produto sem preço");
      amount = amount + this.amountByProduct(priceInStock, element.qty);
    });

    return Number(amount.toFixed(2));
  }

  amountByProduct(price: number, qty: number) {
    return Number((price * qty).toFixed(2));
  }
}

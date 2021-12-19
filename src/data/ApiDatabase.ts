import { ProductWriteOffDTO } from "../model/Product";
import { OrderInputDTO } from "../model/Order";
import { BaseDatabase } from "./BaseDatabase";

export class ApiDatabase extends BaseDatabase {
  private static INVENTORY_TABLE_NAME = "inventory";
  private static ORDERS_TABLE_NAME = "orders";
  private static ORDER_DETAILS_TABLE_NAME = "order_details";

  async getInventory() {
    const inventory = await this.getConnection().raw(`
        SELECT * FROM ${ApiDatabase.INVENTORY_TABLE_NAME}
    `);
    return inventory[0];
  }

  async getProductById(id: string) {
    const product = await this.getConnection().raw(`
        SELECT id, price, qty_stock
        FROM ${ApiDatabase.INVENTORY_TABLE_NAME}
        WHERE id=${id}
    `);
    return JSON.parse(JSON.stringify(product[0][0]));
  }

  async writeOffStock(product: ProductWriteOffDTO) {
    return await this.getConnection().raw(`
            UPDATE ${ApiDatabase.INVENTORY_TABLE_NAME}
            SET qty_stock=${product.qty}
            WHERE id=${product.id}
        `);
  }

  async createOrder(order: OrderInputDTO) {
    await this.getConnection().raw(`
            INSERT INTO ${ApiDatabase.ORDERS_TABLE_NAME} (id, client_name, delivery_date, amount, created_at)
            VALUES ('${order.id}', '${order.client_name}', '${order.delivery_date}', '${order.amount}', '${order.created_at}')
        `);
  }

  async createOrderDetail(order_detail: any) {
    await this.getConnection().raw(`
            INSERT INTO ${ApiDatabase.ORDER_DETAILS_TABLE_NAME} (id, order_id, product_id, product_qty, product_price)
            VALUES ('${order_detail.id}', 
            '${order_detail.order_id}', 
            '${order_detail.product_id}', 
            '${order_detail.product_qty}', 
            '${order_detail.product_price}'
            )
        `);
  }
}

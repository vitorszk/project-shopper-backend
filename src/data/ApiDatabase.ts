import { OrderInputDTO, ProductInputDTO } from "../model/Order";
import { BaseDatabase } from "./BaseDatabase";

export class ApiDatabase extends BaseDatabase {

    private static INVENTORY_TABLE_NAME = "inventory"
    private static ORDERS_TABLE_NAME = "orders"
    private static ORDER_DETAILS_TABLE_NAME = "order_details"


    async getInventory() {
        const inventory = await this.getConnection()
            .select('*')
            .from(ApiDatabase.INVENTORY_TABLE_NAME)
        return inventory
    }

    async getProductById(id: string) {
        const product = await this.getConnection()
            .select('id', 'price', 'qty_stock')
            .from(ApiDatabase.INVENTORY_TABLE_NAME)
            .where({ id })

            return product[0]

    }

    async writeOffStock(product: ProductInputDTO) {
        return await this.getConnection().raw(`
            UPDATE ${ApiDatabase.INVENTORY_TABLE_NAME}
            SET qty_stock=${product.qty}
            WHERE id=${product.id}
        `)
    }

    async createOrder(order: OrderInputDTO) {
        await this.getConnection().raw(`
            INSERT INTO ${ApiDatabase.ORDERS_TABLE_NAME} (id, client_name, delivery_date, amount, created_at)
            VALUES ('${order.id}', '${order.client_name}', '${order.delivery_date}', '${order.amount}', '${order.created_at}')
        `)
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
        `)
    }
}
import { OrderInputDTO } from "../model/Order";
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

    async newOrder(input: OrderInputDTO) {
        await this.getConnection()
            .insert(input)
            .into(ApiDatabase.ORDERS_TABLE_NAME)
    }
}
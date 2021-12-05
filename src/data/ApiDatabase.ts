import { BaseDatabase } from "./BaseDatabase";

export class ApiDatabase extends BaseDatabase {

    private static INVENTORY_TABLE_NAME = "inventory"

    async getInventory() {
        const inventory = await this.getConnection()
            .select('*')
            .from(ApiDatabase.INVENTORY_TABLE_NAME)
        return inventory
    }
}
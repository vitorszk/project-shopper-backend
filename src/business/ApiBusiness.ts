import { ApiDatabase } from "../data/ApiDatabase";

export class ApiBusiness {
    async getInventory(): Promise<any> {
        const apiDatabase = new ApiDatabase();
        const inventory = await apiDatabase.getInventory()

        return inventory
    }
}
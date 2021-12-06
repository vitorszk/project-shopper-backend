import { ApiDatabase } from "../data/ApiDatabase";
import { OrderInputDTO } from "../model/Order";
import { GenerateId } from "../services/generateId";

export class ApiBusiness {

    async getInventory(): Promise<any> {
        const apiDatabase = new ApiDatabase();
        const inventory = await apiDatabase.getInventory()

        return inventory
    }

    async newOrder(input: OrderInputDTO) {
        if (
            !input.name ||
            !input.delivery_time ||
            !input.request_time ||
            !input.amount
        ) {
            throw new Error("Por favor, preencha todas as informações!")
        }

        const genId = new GenerateId()
        const id: string = genId.generate()

        const createOrder = { id, ...input }
        const apiDatabase = new ApiDatabase()
        await apiDatabase.newOrder(createOrder)
    }
}
import { Request, Response } from "express"
import { ApiBusiness } from "../business/ApiBusiness"

export class ApiController {
    async getInventory(req: Request, res: Response) {
        try {
            const apiBusiness = new ApiBusiness()
            const result = await apiBusiness.getInventory()

            res.status(200).send(result)
        } catch (err: unknown) {
            if (err instanceof Error)
                return res.status(400).send(err.message)
        }
    }
}
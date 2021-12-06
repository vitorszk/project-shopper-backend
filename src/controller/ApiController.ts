import { Request, Response } from "express"
import { ApiBusiness } from "../business/ApiBusiness"
import { OrderInputDTO } from "../model/Order"

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

    async newOrder(req: Request, res: Response) {
        try {
            const input: OrderInputDTO = {
                name: req.body.client_name,
                delivery_time: req.body.delivery_time,
                request_time: req.body.request_time,
                amount: req.body.request_time
            }

            const apiBusiness = new ApiBusiness()
            const result = await apiBusiness.newOrder(input)
            res.status(200).send({message: "Novo pedido feito adicionado!", result})

        } catch (err: unknown) {
            if (err instanceof Error)
                return res.status(400).send(err.message)
        }
    }
}
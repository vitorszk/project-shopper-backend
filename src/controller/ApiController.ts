import { Request, Response } from "express";
import { ApiBusiness } from "../business/ApiBusiness";
export class ApiController {
  async getInventory(req: Request, res: Response) {
    try {
      const apiBusiness = new ApiBusiness();
      const result = await apiBusiness.getInventory();

      res.status(200).send(result);
    } catch (err: unknown) {
      if (err instanceof Error) return res.status(400).send(err.message);
    }
  }

  async newOrder(req: Request, res: Response) {
    try {
      const { products, amount, client_name, delivery_date } = req.body;
      const order = { client_name, delivery_date, amount };

      const apiBusiness = new ApiBusiness();

      const productsInStock = await apiBusiness.verifyStock(products, amount);
      const order_id = await apiBusiness.createOrder(order);
      await apiBusiness.createOrderDetail(products, order_id);
      await apiBusiness.writeOffStock(products, productsInStock);

      res.status(200).send({ message: "Pedido criado com sucesso!" });
    } catch (err: unknown) {
      if (err instanceof Error) return res.status(400).send(err.message);
    }
  }
}

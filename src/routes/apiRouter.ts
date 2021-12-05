import express from "express"
import { ApiController } from "../controller/ApiController"

export const apiRouter = express.Router()
const apiController = new ApiController()

apiRouter.get("/inventory", apiController.getInventory)

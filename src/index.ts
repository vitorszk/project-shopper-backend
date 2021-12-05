import express, { Express } from "express"
import cors from "cors"
import dotenv from "dotenv"
import { apiRouter } from "./routes/apiRouter"

dotenv.config()

const app: Express = express()

app.use(express.json())
app.use(cors())
app.use("", apiRouter)

app.listen(process.env.PORT || 3003, function(this: any){
   console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
 });
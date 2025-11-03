import express from "express"
import authRoutes from "./modules/auth/auth.route.js"
import { errorHandler } from "./middlewares/error-handler.middleware.js"

const app = express()

app.use(express.json())
  .use(express.urlencoded({extended: true}))

app.use('/api/auth/', authRoutes)

app.use(errorHandler)

export default app
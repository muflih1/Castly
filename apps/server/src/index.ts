import "dotenv/config"
import { env } from "./env.js"
import app from "./app.js"

const PORT = Number(env.PORT)
app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`)
})
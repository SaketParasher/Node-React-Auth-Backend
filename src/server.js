import app from "./app.js";
import { config } from 'dotenv';

config()

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Auth App Running on PORT : ${PORT}`)
})
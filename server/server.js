import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { clerkMiddleware } from '@clerk/express'


dotenv.config({ silent: true });
const app=express()

app.use(express.json())
app.use(cors())
app.use(clerkMiddleware())
const PORT = process.env.PORT 


app.get("/",(req,res)=>res.send(`server is live`))


app.listen(PORT,()=>console.log(`the server running on port ${PORT}`))
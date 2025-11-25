import express from "express"
import dotenv from "dotenv"
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js"
import cors from "cors"
import { clerkMiddleware } from '@clerk/express'
import workspaceRouter from "./routes/workspaceRoutes.js";
import protect from "./middlewares/authMiddlware.js";


dotenv.config({ silent: true });
const app=express()

app.use(express.json())
app.use(cors())
app.use(clerkMiddleware())
const PORT = process.env.PORT 


app.get("/",(req,res)=>res.send(`server is live`))
app.use("/api/inngest", serve({ client: inngest, functions }));

//  Routes


app.use("/api/workspaces", protect , workspaceRouter)



app.listen(PORT,()=>console.log(`the server running on port ${PORT}`))
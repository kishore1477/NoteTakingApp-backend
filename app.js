// const express = require('express')
import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import cors from 'cors'
import connectDb from './config/ConnectDb.js'
import Authrouter from './routers/auth.js'
import noteRouter from './routers/notes.js'
const app = express()
const port = process.env.PORT || 8000
const dataBase_URL = process.env.DATABASE_URL
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

app.use(cors(corsOptions)) 

// JSON
app.use(express.json())

// DataBase Connection
connectDb(dataBase_URL)
app.use('/api/auth',Authrouter)
app.use('/api/notes',noteRouter)
app.get('/', (req, res) => {
  res.send('Hello World!')
})
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static("frontend/build"));
//   app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname + "/client/build/index.html"));
//   });
//  }

app.listen(port, () => {
  
})
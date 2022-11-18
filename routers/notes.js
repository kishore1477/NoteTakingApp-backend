import express, { application } from "express";
const app = express()

import UserController from "../controllers/authController.js";
const  noteRouter = express.Router()
// const expressValid = require('express-validator');
import { body, validationResult } from 'express-validator';
import Userauth from "../middlewares/auth_middleware.js";
import NoteController from "../controllers/noteController.js";
noteRouter.use('/createNote',Userauth)
noteRouter.use('/getNote',Userauth)
noteRouter.use('/updateNote/:id',Userauth)
noteRouter.use('/deleteNote/:id',Userauth)

// protected  routes
noteRouter.post('/createNote',
[body("title", "Enter a valid title min:3.").isLength({ min: 3 }),
body("description", "Enter a valid description min:5.").isLength({ min: 5 }),
body("category", "Enter a valid category min:3.").isLength({ min: 3 })],
NoteController.createNote)
noteRouter.get('/getNote', NoteController.getNote)
noteRouter.put('/updateNote/:id', NoteController.updateNote)
noteRouter.delete('/deleteNote/:id', NoteController.deleteNote)


export default noteRouter
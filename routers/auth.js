import express, { application } from "express";
import UserController from "../controllers/authController.js";
const Authrouter = express.Router()
// const expressValid = require('express-validator');
import { body, validationResult } from 'express-validator';
import Userauth from "../middlewares/auth_middleware.js";
Authrouter.use('/changePassword',Userauth)
Authrouter.use('/loggedUserData',Userauth)
// Public routes
Authrouter.post('/register', UserController.UserRegisteration)
Authrouter.post('/login', UserController.UserLogin)
Authrouter.post('/sendEmail', UserController.sendEmail)
Authrouter.post('/passwordReset/:id/:token', UserController.passwordReset)
// protected  routes
Authrouter.post('/changePassword', UserController.changePassword)
Authrouter.post('/loggedUserData', UserController.LoggedUserData)
Authrouter.post('/contact', UserController.Contact)


export default Authrouter
import User from "../moddle/User.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'
import { body, validationResult } from 'express-validator';
import transporter from "../config/emailConfig.js";
import Contact from "../moddle/Contact.js";

class UserController {
    // User Register
    static UserRegisteration = async (req, res) => {
        // handle request body  parameters error
        // const errors = validationResult(req);
        // if (!errors.isEmpty()) {
        //     return res.status(400).json({ errors: errors.array() });
        // }
        const { name, email, password, password_confirm} = req.body
        
      try {
        const emailfind = await User.findOne({ email })
        if (emailfind) {
            res.status(400).json({"fail":"Email already exists, please enter another email"})
        } else {
            if (name && email && password && password_confirm) {

                if (password === password_confirm) {
                    const salt = await bcrypt.genSalt(10)
                    const hashPass = await bcrypt.hash(password, salt)
                    const UserData = new User({
                        name: name,
                        email: email,
                        password: hashPass,
                       
                    })
                    const UserDataSave = await UserData.save()
                    const findsavedUser = await User.findOne({ email })
                    // Generate JWT token 
                    const token = jwt.sign({ userID: findsavedUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: '5d' })
                    res.status(200).json({ "token": token, "success": "Signup  successfully." })
                } else {
                    res.status(400).json({"fail":'Password does not match'})

                }
            } else {
                res.status(400).json({"fail":'All fields are required'})
            }
        }
    } catch (error) {
          res.status(401).json({"fail":'Internal server occured.'})
        
      }
    }

    //  User login 
    static UserLogin = async (req, res) => {
        try {
            const { email, password } = req.body

            if (email && password) {
                const user = await User.findOne({ email })
                if (user != null) {
                    const isMatch = await bcrypt.compare(password, user.password)
                    if (user.email === email && isMatch) {
                        //  token gnerate for login
                        const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '5d' })
                        res.status(200).json({ "loginToken": token, "success":"Login Successfully" })

                    } else {
                        res.status(400).json({"fail":"Invalid credentials"})

                    }

                } else {
                    res.status(400).json({"fail":"User does'not exists"})
                }
            } else {
                res.status(400).json({"fail":"All field are required"})
            }
        } catch (error) {
            res.status(401).json({"fail":"Internal server error occured"})
 
        }
    }
    // user change password 
    static changePassword = async (req, res) => {
        const { password, password_confirm } = req.body
        if (password && password_confirm) {
            if (password === password_confirm) {
                const salt = await bcrypt.genSalt(10)
                const hashPass = await bcrypt.hash(password, salt)
                
                await User.findByIdAndUpdate(req.user._id, { $set: { password: hashPass } })
                res.status(200).json({msg: "Password changed successfully"})
            } else {

                res.status(400).json({msg:"password does not  match"})
            }
        } else {
            res.status(400).json({msg: "All fields are required!"})
        }
    }
    static LoggedUserData = (req, res) => {
        
        res.status(200).send(req.user)
    }

    static sendEmail = async (req, res) => {
        const { email } = req.body
        
        if (email) {
            
            // try {
               
           
            const user = await User.findOne({ email })
            
            if (user) {
                const secret = user._id + process.env.JWT_SECRET_KEY
                const token = jwt.sign({ userID: user._id }, secret, { expiresIn: '45m' })
                const link = `https://8000-kishorek114-notetakinga-ukzh1bagysq.ws-eu74.gitpod.io/passwordReset/${user._id}/${token}`
                

                 // Send Email
        let info =  await transporter.sendMail({
          from:"kishorejaipal477@gmail.com",
          to: user.email,
          subject: "KishoreAuth - Password Reset Link",
          html: `<a href=${link}>Click Here</a> to Reset Your Password`
        })
        
        res.status(200).json({info:info, msg:"Click the provided link  via email"})
            } else {
                res.status(200).json({ "status": "failed", msg: "Email doesn't exists " })

            }

        // } catch (error) {
        //         res.status(400).json({"message":"Internal error", "Error":error})
        // }
        } else {
            res.status(200).json({ "status": "failed",msg: "Email Field is Required" })
        }
    }

    static passwordReset = async (req, res) => {
        const { password, password_confirm } = req.body
        
        const { id, token } = req.params
        
        const user = await User.findById(id)
        
        const new_secret = user._id + process.env.JWT_SECRET_KEY
        try {
        jwt.verify(token, new_secret)
            // let verifyToken = jwt.verify(token, new_secret)
            // 
            if (password && password_confirm) {
                if (password === password_confirm) {
                    const salt = await bcrypt.genSalt(10)
                    const newHashPassword = await bcrypt.hash(password, salt)
                    await User.findByIdAndUpdate(user._id, { $set: { password: newHashPassword } })
                    res.status(200).send({ "status": "success", "message": "Password Reset Successfully" })
                } else {
                    res.status(400).send("Password does not match!")
                }
            } else {
                res.status(400).send("All field are required.")

            }
        } catch (error) {
            res.status(400).send("Internal Server Error Occured")

        }
    }

    static Contact = async (req, res) => {
        // handle request body  parameters error
        // const errors = validationResult(req);
        // if (!errors.isEmpty()) {
        //     return res.status(400).json({ errors: errors.array() });
        // }
        const { name, email, msg} = req.body
        
        if (name && email && msg) {
            const contactData = new Contact({
                name: name,
                email: email,
                msg: msg,
               
            })
            const UserDataSave = await contactData.save()
            res.status(200).json({msg:'Thanks for contact us, we will touch with you within in 2 days.'})
           
        } else {
            res.status(400).json({msg:'All fields are required'})
        }
       
    }

}

export default UserController
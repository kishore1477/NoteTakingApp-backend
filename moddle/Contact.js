
import mongoose from "mongoose";
const ContactSchema = new mongoose.Schema({
    name: {
        type:String,
        required: true,
       
    },
    email: {
        type:String,
        required: true,
       
    },
    msg: {
        type:String,
        required: true,
      
    }
   
  });
  const Contact = mongoose.model('contact',ContactSchema);
  export default Contact

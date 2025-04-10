import mongoose from "mongoose";
const NoteSchema = new mongoose.Schema({
    title: {
        type:String,
        required: true,
       
    },
    description: {
        type:String,
       
    },
    category: {
        type:String,
       
    },
    docs: {
        type:String,

        trim:true
    },
    url: {
        type:String,

    },
    status: {
        type:Number,

    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
       ref: 'user'
    },
   
  });
  const Note = mongoose.model('note', NoteSchema);
  export default Note

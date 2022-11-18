import mongoose from "mongoose";
const NoteSchema = new mongoose.Schema({
    title: {
        type:String,
        required: true,
       
    },
    description: {
        type:String,
        required: true,
       
    },
    category: {
        type:String,
        required: true,
       
    },
    docs: {
        type:String,

        trim:true
    },
    url: {
        type:String,

    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
       ref: 'user'
    },
   
  });
  const Note = mongoose.model('note', NoteSchema);
  export default Note

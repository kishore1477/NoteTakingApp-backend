import Note from "../moddle/Notes.js";

import { body, validationResult } from 'express-validator';

class NoteController {
    // ✍ ROUTE:1  Post Notes

    static createNote = async (req, res) => {

        // handle request body  parameters error
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() });
        }
        try {
        
        const { description, title, category, url, docs } = req.body
        //  verify title in dbs : checking for title existance
        let titleFind = await Note.findOne({ title });
        // if user find  in dbs then return a error  message to client
        if (titleFind) {
            
            return res.status(400).json({ error: "title already exists please enter another title" });
        }


        const note = new Note({
            title, description, category, url, docs, user: req.user.id
        })
        const saveNote = await note.save()
        res.status(200).json({saveNote, msg: "Note inserted Successfully."})
          }  catch (error) {
            // if any internal error in db then through a message to client
            
            return res.status(500).json({ error: "Some  internal error occured|| in notes" });
          }

    }
    // ✍ ROUTE:2  GET Notes
    static getNote = async (req, res) => {
        const notes = await Note.find({ user: req.user.id })
        res.status(200).send(notes)

    }
	//✍ ROUTE:3 Update note
    static updateNote = async(req,res) => {
        const {title,description,category,url}=req.body
    // create new object of body data
    try {
        
    
        let newNote = {}
        if(title){newNote.title=title}
        if(description){newNote.description=description}
        if(category){newNote.category=category}
        if(url){newNote.url=url}
    //   1.find the added note and update it 
    let note  = await Note.findById(req.params.id)
    if(!note){return res.status(404).send("Not Found in db")}
    // check the user of his note
    if(note.user.toString() !== req.user.id){
        return res.status(401).send("Not Allowed")
    }
    let note1 = await Note.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true})
    res.status(200).json(note1)
    } catch (error) {
        return res.status(400).send("Internel error occured | updation")
    }
}

	//✍ ROUTE:3 Update note
static deleteNote = async(req,res)=>{
    
try {
    

  
    //   1.find the deleted note and delete it 
    // req.params.id  :- is id in deleteNote/:id
    let note  = await Note.findById(req.params.id)
    if(!note){return res.status(404).send("Not Found")}
    // check the user of his note
    // note.user.toString() :- it is id of user inside note which is ref= 'user'
    // req.user.id :- it is id of user inside user model or  which is comimng from middleware
    if(note.user.toString() !== req.user.id){
        return res.status(401).send("Not Allowed")
    }
    let note1 = await Note.findByIdAndDelete(req.params.id)
    res.status(200).json({"Sucess":"Note deleted Successfully","note":note1})
    } catch (error) {
        return res.status(400).send("Internel error occured | deletion")
    }
}
}

export default NoteController
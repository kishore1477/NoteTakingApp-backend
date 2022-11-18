// const mongoose = require('mongoose');
import mongoose from 'mongoose';
// mongoose.connect('mongodb://localhost:27017/test');

 const connectDb = async(DataBaseUrl)=>{
    try {
        const DB_OPTIONS ={
            dbName : "noteBook"
        }
   mongoose.connect(DataBaseUrl, DB_OPTIONS)
    
    } catch (error) {
        
    }
}
export default  connectDb

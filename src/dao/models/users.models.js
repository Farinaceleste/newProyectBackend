import mongoose from "mongoose"

export const usersModelo = mongoose.model ('users', new mongoose.Schema({
    
        first_name: String, 
        last_name: String, 
        email: {
            type: String, 
            unique: true, 
            required: true
        }, 
        password: String, 
        age: Number, 
        role: String, 
        // cartid: {
        //     ref: modeloCarts
        // }
       
        },
        {   
            timestamps: true, strict: false 
        }
   
))



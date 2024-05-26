import mongoose from "mongoose"

export const usersModelo = mongoose.model(
    'users',
    new mongoose.Schema(
        {
            first_name: String,
            last_name: String,
            age: Number,
            email: {
                type: String, unique: true
            }, 
            password: String, 
            cart: {
                type:mongoose.Types.ObjectId, ref:'carts'
            }
        },
        {
            timeStramps: true
        }
    )
)



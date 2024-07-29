import mongoose from "mongoose";

export const usersModelo = mongoose.model(
    'users',
    new mongoose.Schema(
        {
            first_name: String,
            last_name: String,
            age: Number,
            email: {
                type: String, unique: true, required: true
            },
            password: String,
            cart: {
                type: [
                    {
                        _id: {
                            type: mongoose.Types.ObjectId,
                            ref: 'carts'
                        }
                    }
                ],
                default: []
            },
            role: {
                type: String,
                default: "usuario"
            }
        },
        {
            timestamps: true
        }
    )
);


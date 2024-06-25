import mongoose from "mongoose";

export const ticketModelo = mongoose.model(
    'tickets',
    new mongoose.Schema(
        {
            nroCompr: String,
            code: String,
            purchase_datatime: String, 
            amount: Number, 
            purchaser: String,
            email: String, 
            items: Array

        },
        {
            timeStamps: true
        }
    )
)
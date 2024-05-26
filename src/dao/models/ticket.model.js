import mongoose from "mongoose";

export const ticketModelo = mongoose.model(
    'ticket',
    new mongoose.Schema(
        {
            code: String,
            purchase_datatime: String, 
            amount: Number, 
            purchaser: String

        },
        {
            timeStramps: true
        }
    )
)
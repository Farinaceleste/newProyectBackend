import mongoose from "mongoose";

export const ticketModelo = mongoose.model(
    'tickets',
    new mongoose.Schema(
        {
            code: { type: String, required: true, unique: true },
            purchase_datetime: { type: Date, required: true, default: Date.now },
            amount: { type: Number, required: true },
            purchaser: { type: String, required: true }
        },
        {
            timeStamps: true
        }
    )
)
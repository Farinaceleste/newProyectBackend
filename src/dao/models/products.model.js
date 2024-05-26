import mongoose from "mongoose"
import paginate from "mongoose-paginate-v2"


export const productsModelo = mongoose.model(
    'products',
    new mongoose.Schema(
        {
            title: String, 
            description: String, 
            code: { 
                type: String, unique: true},
            price: Number, 
            status: Boolean, 
            thumbnail: String,
            stock: Number
        },
        {
            timeStramps: true
        }
    )
)
//productsModelo.plugin(paginate)


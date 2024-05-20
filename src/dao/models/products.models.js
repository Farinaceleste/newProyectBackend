import mongoose from "mongoose"
import paginate from "mongoose-paginate-v2"

const productsColl = "products"
const productsSchema = new mongoose.Schema (
    {
        title: String, 
        description: String, 
        code: {type: String, unique: true}, 
        price: Number, 
        status: Boolean, 
        thumbnail: String,
        stock: Number
    }, 
    {
        timeStramps: true, strict:false
    }
)

productsSchema.plugin(paginate)

export const modeloProducts = mongoose.model(productsColl, productsSchema);
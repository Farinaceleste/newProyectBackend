import mongoose from "mongoose"
import paginate from "mongoose-paginate-v2"


export const productsModelo = mongoose.model(
    'products',
    new mongoose.Schema(
        {
            title: {type: String, unique:true, required:true}, 
            description: String, 
            code: { type: String, unique: true},
            price: {type: Number, unique: true},
            status: {type: Boolean, unique: true},
            thumbnail: String,
            stock: {type: Number, unique: true, required:true},
            owner: { type: String, default: 'admin' }
        },
        {
            timeStramps: true
        }
    )
)

productsModelo.plugin(paginate);



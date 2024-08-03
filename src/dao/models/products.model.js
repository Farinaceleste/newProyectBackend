import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema(
    
    {
        title: { type: String, unique: true, required: true },
        description: String,
        code: { type: String, unique: true },
        price: { type: Number, required: true },
        status: { type: Boolean, default: true },
        thumbnail: String,
        stock: { type: Number, required: true },
        owner: { type: String, default: 'admin' }
    },
    {
        timestamps: true
    }
);

productSchema.plugin(paginate);

export const productsModelo = mongoose.model('products', productSchema);



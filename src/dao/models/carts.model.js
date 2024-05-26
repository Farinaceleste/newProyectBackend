import mongoose from "mongoose";
//import paginate from "mongoose-paginate-v2"

export const cartsModelo = mongoose.model(
    'carts',
    new mongoose.Schema(
        {
            products: {
              type: [
                {
                  product: {
                    type: mongoose.Types.ObjectId, ref: 'products'
                  },
                  cantidad: Number
                }
              ]
            }
        },
        {
            timeStramps: true
        }
    )
)
//cartsModelo.plugin(paginate)




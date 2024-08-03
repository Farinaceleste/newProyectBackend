import mongoose from "mongoose";


export const cartsModelo = mongoose.model(
  'carts',
  new mongoose.Schema(
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      products: {
        type: [
          {
            product: {
              type: mongoose.Types.ObjectId, ref: "products"
            },
          quantity: Number
          }
        ]
      }
    },
    {
      timestamps: true,
      createdAt: { type: Date, default: Date.now }
    }
  )
)





import { cartsModelo } from "./models/carts.model.js"

export class CartMongoDAO{

    async getAllCarts() { 

        return await cartsModelo.find().lean()


        // let carritos = await modeloCarts.find().populate("products.product").lean();
        // console.log(JSON.stringify(carritos, null, 2));
        // return carritos
    }

    // async getCartsById (cid) {
    // try{  
    //     let carrito = await modeloCarts.findById(cid).populate("products.product").lean()
    //     console.log(carrito)
    //     return carrito;
    // } catch  (err){
    //     console.log(err);
    //   }
    // }

    async getCartBy (filter={}){
        return await cartsModelo.findOne(filter).lean()
    }

    async getCartByPopulate(filter={}){
        return await cartsModelo.findOne(filter).populate('products.product').lean()
    }
    
    async deleteCart (id) {
        
        return await  cartsModelo.findByIdAndDelete(id).lean()
    }

    async createCart () {
        let resultado = await cartsModelo.create({products:[]})
        return resultado.toJSON()
    }

    async updateCart (cid, pid) {

        return await cartsModelo.updateOne(cid, {_id: pid}).lean()
    }

    async deleteFromCart(cid, pid) {

        return await cartsModelo.findByIdAndUpdate(cid, { $pull: { products: { _id: pid } } },
            { new: true })
    }
    
}

import { cartsModelo } from "../models/carts.model.js"

export class CartMongoDAO {

    async getAllCarts() {

        return await cartsModelo.find().lean()


        // let carritos = await modeloCarts.find().populate("products.product").lean();
        // console.log(JSON.stringify(carritos, null, 2));
        // return carritos
    }

    async getCartById(cid) {
        return await cartsModelo.findOne({ _id: cid }).lean()
    }

    async getCartByPopulate(filter = {}) {
        return await cartsModelo.findOne(filter).populate('products.product').lean()
    }

    async deleteCart(cid) {
        return await cartsModelo.deleteOne({ _id: cid }).lean()
    }

    async createCart() {
        let resultado = await cartsModelo.create({ products: [] })
        return resultado.toJSON()
    }

    async updateCart(cid, pid) {
        return await cartsModelo.updateOne(cid, { _id: pid }).lean()
    }

    async deleteFromCart(cid, pid) {
        return await cartsModelo.findByIdAndUpdate(cid, { $pull: { products: { _id: pid } } },
            { new: true })
    }

    async updateQuantityProduct() {
        try {
            const cart = await cartsModelo.getCartById(cid);

            if (!cart) {
                throw new Error(`Carrito no encontrado para el ID ${cid}`);
            }

            const productToUpdate = cart.products.find((product) =>
                product.pid.equals(pid)
            );

            if (!productToUpdate) {
                throw new Error(`Producto no encontrado en el carrito`);
            }

            productToUpdate.quantity = updateQuantity;

            await cartsModelo.create();

            return cart;
        } catch (error) {
            throw new Error(
                "Error al actualizar la cantidad del producto en el carrito: " +
                error.message
            );
        }
    }

}

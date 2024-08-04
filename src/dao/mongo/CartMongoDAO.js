import { cartsModelo } from "../models/carts.model.js"

export class CartMongoDAO {

    async getAllCarts() {

        return await cartsModelo.find().lean()
    }

    async getCartById(filtro={}) {
        let resultado = await cartsModelo.findOne(filtro).lean()
        return resultado
    }

    async getCartByPopulate(filter = {}) {
        return await cartsModelo.findOne(filter).populate('products.product').lean()
    }

    async deleteCart(cid) {
        return await cartsModelo.deleteOne({ _id: cid }).lean()
    }

    async createCart(initial = []) {

        try {
            const newCart = await cartsModelo.create({ products: initial });
            console.log("nuevo carrito creado", newCart)
            return newCart
        } catch (error) {
            console.error("Error al crear el carrito", error)
        }
    }

    async updateCart(cid, cartUpdates) {
        return await cartsModelo.updateOne(
            cid,
            { $set: cartUpdates }
        ).lean();
    }

    async deleteFromCart(cid, pid) {
        return await cartsModelo.findByIdAndUpdate(cid, { $pull: { products: { _id: pid } } },
            { new: true })
    }

    async updateQuantityProduct(cid, pid, quantity) {
        try {
            const cart = await cartsModelo.getCartById(cid);

            if (!cart) {
                throw new Error(`Carrito no encontrado para el ID ${cid}`);
            }

            const productIndex = cart.products.findIndex(
                (product) => product.product.toString() === pid.toString()
            );

            if (productIndex === -1) {
                throw new Error(`Producto no encontrado en el carrito`);
            }

            cart.products[productIndex].cantidad = quantity;

            await cartsModelo.updateOne(
                { _id: cid },
                { $set: { products: cart.products } }
            );

            return cart;
        } catch (error) {
            throw new Error(
                "Error al actualizar la cantidad del producto en el carrito: " +
                error.message
            );
        }
    }

}

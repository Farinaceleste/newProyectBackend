import { CartMongoDAO as cartDAO } from "../../dao/CartMongoDAO.js";

class CartService {
    async deleteFromCart(cid, pid) {
        if (!mongoose.Types.ObjectId.isValid(cid) || !mongoose.Types.ObjectId.isValid(pid)) {
            throw new Error('id inválido');
        }

        try {
            const updatedCart = await cartDAO.deleteFromCart(cid, pid);
            if (!updatedCart) {
                throw new Error('Carrito no encontrado');
            }

            return updatedCart;
        } catch (error) {
            throw error;
        }
    }

    // async finalizePurchase(cart) {
        
    //     const productsWithInsufficientStock = cart.products.filter((product) => {
        
    //       const stock = await productsDAO.getStock(product.id);
    //       return stock < product.quantity;
    //     });

    //     if (!productsWithInsufficientStock) {
    //         alert('no hay stock suficiente')
    //     } else {
    //         const newStock = stock - cart.products._id
    //     }
    // }
}

module.exports = CartService;
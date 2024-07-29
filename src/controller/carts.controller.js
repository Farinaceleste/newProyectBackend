import { CartMongoDAO as CartDAO } from "../dao/mongo/CartMongoDAO.js";
import mongoose from "mongoose";
import { cartService } from "../services/cart.service.js";
import { productsService } from "../services/product.service.js";
import { generateUniqueCode, calculateTotalAmount} from "../utils.js";

const cartsDAO = new CartDAO();

function isValidObjectId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

export default class CartController {
    static async getCarts(req, res) {
        try {
            let carts = await cartService.getAllCarts();
            res.setHeader("Content-Type", "application/json");
            res.status(200).json({ carts });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    static async getCartById(req, res) {
        try {
            const { cid } = req.params;

            if (!isValidObjectId(cid)) {
                return res.status(400).json({ error: 'Ingrese id válido de Mongo' });
            }

            const cart = await cartService.getCartByPopulate({ _id: cid });
            if (!cart) {
                return res.status(400).json({ error: `Carrito inexistente: ${cid}` });
            }

            res.status(200).json({ cart });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    static async getCartByPopulate(req, res) {
        const { cid } = req.params;

        if (!isValidObjectId(cid)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        try {
            const cartById = await cartsDAO.getCartByPopulate({ _id: cid });
            if (!cartById) {
                return res.status(400).json({ error: `No existen carritos con el id ${cid}` });
            }

            res.status(200).json({ cartById });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    static async createCart(req, res) {
        try {
            const newCart = { products: req.body.products || [] };
            const savedCart = await cartService.createCart(newCart);
            res.status(201).json({ newCart: savedCart });
        } catch (error) {
            console.error("Error al guardar el carrito", error);
            res.status(500).json({ message: 'Hubo un error al crear la compra' });
        }
    }

    static async deleteCart(req, res) {
        const { cid } = req.params;

        if (!isValidObjectId(cid)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        try {
            const cartDeleted = await cartService.deleteCart(cid);
            if (cartDeleted.deletedCount > 0) {
                return res.status(200).json({ message: `Se ha eliminado el carrito con id: ${cid}` });
            } else {
                return res.status(400).json({ error: `No existen carritos con el id: ${cid}` });
            }
        } catch (error) {
            console.error("Error al eliminar el carrito", error);
            res.status(500).json({ error: 'Error en el servidor' });
        }
    }

    static async deleteFromCart(req, res) {
        const { cid, pid } = req.params;

        try {
            const prodDeletedFromCart = await cartService.deleteFromCart(cid, pid);
            res.status(200).json({ message: "Producto eliminado", cart: prodDeletedFromCart });
        } catch (error) {
            console.error("Error al eliminar el producto del carrito", error);
            res.status(500).json({ error: 'Error en el servidor' });
        }
    }

    static async updateCart(req, res) {
        const { cid, pid } = req.params;

        if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
            return res.status(400).json({ error: 'Id de producto o carrito inválido' });
        }

        try {
            let cart = await cartService.getCartById({ _id: cid });
            if (!cart) {
                return res.status(400).json({ error: `Carrito inexistente: ${cid}` });
            }

            let product = await productsService.getProductById({ _id: pid });
            if (!product) {
                return res.status(400).json({ error: `Producto inexistente: ${pid}` });
            }

            if (product.stock <= 0) {
                return res.status(400).json({ error: `No hay stock para el producto: ${pid}` });
            }

            const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
            if (productIndex === -1) {
                cart.products.push({ product: pid, cantidad: 1 });
            } else {
                cart.products[productIndex].cantidad++;
            }

            const resultado = await cartService.updateCart({ cid, cart });
            if (resultado.modifiedCount > 0) {
                return res.status(200).json({ payload: 'Cart actualizado' });
            } else {
                return res.status(500).json({ error: 'Error inesperado en el servidor' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Contacte al administrador', detalle: error.message });
        }
    }

    static async addProdToExistCart(req, res) {
        const { cid, pid } = req.params;

        if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        try {
            const cart = await cartService.getCartById(cid);
            if (!cart) {
                return res.status(400).json({ error: 'Carrito no encontrado' });
            }

            const product = await productsService.getProductById(pid);
            if (!product) {
                return res.status(400).json({ error: 'Producto no encontrado' });
            }

            const existingProduct = cart.products.find(p => p.product.toString() === pid);
            if (existingProduct) {
                existingProduct.quantity++;
            } else {
                cart.products.push({ product: pid, quantity: 1 });
            }

            await cart.save();
            res.status(200).json({ cart });
        } catch (error) {
            console.error("Error al procesar la solicitud", error);
            res.status(500).json({ error: 'Error en el servidor' });
        }
    }

    static async removeProductFromCart(req, res) {
        const { cid, pid } = req.params;

        try {
            await cartsDAO.deleteFromCart(cid, pid);
            res.status(200).json({ message: 'Producto eliminado del carrito exitosamente' });
        } catch (error) {
            console.error("Error al eliminar el producto del carrito", error);
            res.status(500).json({ error: 'Error al eliminar el producto del carrito', detalle: error.message });
        }
    }

    static async updateProductQuantity(req, res) {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
            return res.status(400).json({ error: 'ID de carrito o producto inválido' });
        }

        try {
            await cartsDAO.updateProductQuantity(cid, pid, quantity);
            res.status(200).json({ message: 'Cantidad del producto actualizada exitosamente en el carrito' });
        } catch (error) {
            console.error("Error al actualizar la cantidad del producto en el carrito", error);
            res.status(500).json({ error: 'Error al actualizar la cantidad del producto en el carrito', detalle: error.message });
        }
    }

    static async purchaseCart(req, res) {
        const { cid } = req.params;

        try {
            const cart = await cartService.getCartById(cid).populate('products.product');

            const productsNotPurchased = [];
            for (const item of cart.products) {
                const product = item.product;
                const quantity = item.quantity;

                if (product.stock >= quantity) {
                    product.stock -= quantity;
                    await product.save();
                } else {
                    productsNotPurchased.push(product._id);
                }
            }

            const ticket = new Ticket({
                code: generateUniqueCode(),
                purchase_datetime: new Date(),
                amount: calculateTotalAmount(cart.products),
                purchaser: req.UsuariosDTO.email
            });
            await ticket.save();

            cart.products = cart.products.filter(item => !productsNotPurchased.includes(item.product._id));
            await cart.save();

            res.status(200).json({ ticket, productsNotPurchased });
        } catch (error) {
            console.error("Error interno del servidor", error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
}
import { CartMongoDAO as CartDAO } from "../dao/mongo/CartMongoDAO.js";
import mongoose from "mongoose";
import { cartService } from "../services/cart.service.js";
import { productsService } from "../services/product.service.js";
import { generateUniqueCode, calculateTotalAmount, sendMail } from "../utils.js";
import { ProductMongoDAO } from "../dao/mongo/ProductMongoDAO.js";
import { TicketsDAO } from "../dao/mongo/TicketMongoDAO.js";

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
            const cartById = await cartService.getCartByPopulate({ _id: cid });
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

            const newCart = req.body.products || [];
            res.status(201).json(newCart);

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

    static async addProdToCart(req, res) {
        const { cid, pid } = req.params;
        const userId = req.user._id;

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

            const productIndex = cart.products.findIndex(p => p.product.toString() === pid.toString());
            if (productIndex === -1) {
                cart.products.push({ product: pid, quantity: 1 });
            } else {
                cart.products[productIndex].quantity++;
            }

            const resultado = await cartService.updateCart({ _id: cid }, cart);
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

    static async deleteFromCart(req, res) {
        const { cid, pid } = req.params;
    
        try {
            if (!cid || !pid) {
                return res.status(400).json({ error: 'ID de carrito o producto no proporcionado' });
            }

            if (!mongoose.Types.ObjectId.isValid(cid) || !mongoose.Types.ObjectId.isValid(pid)) {
                return res.status(400).json({ error: 'ID de carrito o producto inválido' });
            }
    
            const result = await cartService.deleteFromCart(cid, pid);
            if (!result) {
                return res.status(404).json({ error: 'Carrito no encontrado o producto no eliminado' });
            }
            res.status(200).json({ message: 'Producto eliminado del carrito exitosamente' });
        } catch (error) {
            console.error("Error al eliminar el producto del carrito", error);
            res.status(500).json({ error: 'Error al eliminar el producto del carrito', detalle: error.message });
        }
    }
    
}
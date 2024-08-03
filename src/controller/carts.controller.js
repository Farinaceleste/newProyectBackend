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
        const userId = req.user._id;

        if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
            return res.status(400).json({ error: 'Id de producto o carrito inválido' });
        }

        try {
            let cart = await cartService.getCartById({ _id: cid });
            if (!cart) {
                return res.status(400).json({ error: `Carrito inexistente: ${cid}` });
            }

            if (cart.userId.toString() !== userId) {
                return res.status(403).json({ error: 'No tienes permiso para actualizar este carrito' });
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

    static async addProdToCart(req, res) {
        let { cid, pid } = req.params;

        if (!cid || !pid) {
            return res.status(400).json({ error: "Ingrese cid y pid" });
        }
        if (cid === undefined) {
            alert("Debe iniciar sesión antes de agregar productos")
        }


        if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
            return res.status(400).json({ error: "Ingrese cid / pid con formato válido de MongoDB id" });
        }

        try {
            let cart = await cartService.getCartById({ _id: cid });

            if (!cart) {
                cart = await cartService.createCart({ products: [] });
                console.log(newCart._id)
            }

            let product = await productsService.getProductById({ _id: pid });
            if (!product) {
                return res.status(404).json({ error: `Producto inexistente: ${pid}` });
            }

            if (product.stock <= 0) {
                return res.status(400).json({ error: `No hay stock para el producto: ${pid}` });
            }

            let indiceProducto = cart.products.findIndex(p => p.product.toString() === pid.toString());
            if (indiceProducto === -1) {
                cart.products.push({
                    product: pid,
                    cantidad: 1
                });
            } else {
                cart.products[indiceProducto].cantidad++;
            }

            let resultado = await cartService.updateCart(cid, cart);
            if (resultado.modifiedCount > 0) {
                return res.status(200).json({ message: "Carrito actualizado exitosamente" });
            } else {
                return res.status(500).json({ error: "Error inesperado en el servidor. Intente más tarde o contacte a su administrador." });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: "Error inesperado en el servidor. Intente más tarde o contacte a su administrador.",
                detalle: error.message
            });
        }
    }

    static async purchaseCart(req, res) {
        const { cid } = req.params;

        try {
            if (!isValidObjectId(cid)) {
                return res.status(HTTP_BAD_REQUEST).json({ error: 'Invalid cart ID' });
            }

            const cart = await cartService.getCartById({ _id: cid });
            if (!cart) {
                return res.status(HTTP_BAD_REQUEST).json({ error: `Cart not found: ${cid}` });
            }

            if (cart.products.length === 0) {
                return res.status(HTTP_BAD_REQUEST).json({ error: 'Cart is empty' });
            }

            const itemsWithStock = [];
            const itemsWithoutStock = [];
            let total = 0;

            for (const cartItem of cart.products) {
                const product = await productsService.getProductById({ _id: cartItem.product });
                if (!product || product.stock - cartItem.quantity < 0) {
                    itemsWithoutStock.push({ product: cartItem.product, quantity: cartItem.quantity });
                } else {
                    itemsWithStock.push({
                        _id: product._id,
                        title: product.description,
                        quantity: cartItem.quantity,
                        price: product.price,
                        subtotal: product.price * cartItem.quantity,
                        stockPrevioCompra: product.stock,
                    });
                    product.stock -= cartItem.quantity;
                    await productsService.updateProduct(product._id, product);
                    total += cartItem.quantity * product.price;
                }
            }

            if (itemsWithStock.length === 0) {
                return res.status(HTTP_BAD_REQUEST).json({ error: 'No items can be processed (check stock or product existence)' });
            }

            const ticket = await TicketsDAO.create({
                nroComp: Date.now(),
                fecha: new Date(),
                email: req.user.email,
                items: itemsWithStock,
                total,
            });

            cart.products = itemsWithoutStock;
            await cartService.updateCart(cid, cart);

            const emailBody = `
            Su compra ha sido procesada...!!!
            Ticket: <b>${ticket.nroComp}</b> - importe a pagar: <b><i>$ ${total}</b></i>
            Contacte a pagos para finalizar la operación: pagos@cuchuflito.com
            ${itemsWithoutStock.length > 0 ? `Algunos items del carrito no fueron procesados. Verifique: ${JSON.stringify(itemsWithoutStock, null, 5)}` : ''}
          `;
            sendMail(req.user.email, 'Compra realizada con éxito...!!!', emailBody);

            return res.status(HTTP_OK).json({ ticket });
        } catch (error) {
            console.error(error);
            return res.status(HTTP_INTERNAL_SERVER_ERROR).json({
                error: 'Unexpected error occurred. Please try again later or contact your administrator',
                detail: error.message,
            });
        }
    }
}
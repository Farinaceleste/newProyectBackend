import mongoose from "mongoose";
import { ticketService } from "../services/ticket.service.js";
import { productsService } from "../services/product.service.js";
import { cartService} from "../services/cart.service.js";
import { sendMail } from "../utils.js";

function isValidObjectId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

async function checkProductStock(productId, quantity) {
    const product = await productsService.getProductById({ _id: productId });
    if (!product || product.stock < quantity) {
        return { inStock: false, product, quantity };
    }
    return { inStock: true, product, quantity };
}

async function updateProductStock(productId, quantity) {
    const product = await productsService.getProductById({ _id: productId });
    product.stock -= quantity;
    await productsService.updateProduct(productId, product);
    return product;
}

export default class TicketController {
    static createTicket = async (req, res) => {
        const { cid } = req.params;
        const user = req.user; 

        if (!isValidObjectId(cid)) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: 'formato de id incorrecto' });
        }

        try {
            const cart = await cartService.getCartById({ _id: cid });
            if (!cart) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({ error: `Carrito ${cid} no encontrado` });
            }

            if (cart.products.length === 0) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({ error: 'no se puede comprar carrito vacío' });
            }

            const conStock = [];
            const sinStock = [];
            let total = 0;

            for (const item of cart.products) {
                const { _id: productId, quantity } = item;

                if (quantity <= 0) {
                    continue; 
                }

                const stockStatus = await checkProductStock(productId, quantity);
                if (!stockStatus.inStock) {
                    sinStock.push({ product: productId, quantity });
                } else {
                    const updatedProduct = await updateProductStock(productId, quantity);
                    const subtotal = updatedProduct.price * quantity;
                    conStock.push({
                        _id: productId,
                        description: updatedProduct.description,
                        quantity,
                        price: updatedProduct.price,
                        subtotal,
                        stock: updatedProduct.stock
                    });
                    total += subtotal;
                }
            }

            if (conStock.length === 0) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({ error: 'No hay stock disponible para los items seleccionados.' });
            }

            const nroCompr = Date.now();
            const email = user.email; 
            const fecha = new Date();

            const newTicket = await ticketService.create({
                nroCompr,
                fecha,
                email,
                items: conStock,
                total
            });

            cart.products = sinStock;
            await cartService.updateCart(cid, cart);

            const mensaje = `Su compra ha sido procesada. Nro comprobante: <strong>${nroCompr}</strong>. Contacte al administrador para terminar la compra: <strong>farinaceleste@gmail.com</strong>`;
            await sendMail(email, "Compra realizada con éxito", mensaje);

            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({ newTicket });
        } catch (error) {
            console.error(error);
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json({
                error: `Error interno del servidor. Detalle: ${error.message}`
            });
        }
    }
}
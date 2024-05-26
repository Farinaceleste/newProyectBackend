import { CartMongoDAO as CartDAO } from "../dao/CartMongoDAO.js";
import { ProductMongoDAO as ProductsDAO } from "../dao/ProductMongoDAO.js";
import mongoose, { isValidObjectId } from "mongoose";

const cartsDAO = new CartDAO
const productsDAO = new ProductsDAO

export default class CartController {

    static getCart = async (req, res) => {
        try {
            let carts = await cartsDAO.getCarts()

            res.setHeader("Content-Type", "application/json")
            res.status(200).json({ carts })

        } catch (error) {
            res.setHeader("Content-Type", "application/json")
            res.status(500).json({ error: "Error inesperado en el servidor" })
        }
    }

    static getCartBy = async (req, res) => {
        
        let { cid } = req.params

        if (!isValidObjectId(cid)) {
            res.setHeader("Content-Type", "application/json")
            res.status(400).json({ error: "id inválido" });
        }

        try {
            const cartById = await cartsDAO.getCartByPopulate({_id:cid});

            if (cartById) {
                res.setHeader('Content-Type', 'application/json')
                res.status(200).json({ cartById })
            } else {
                res.setHeader('Content-Type', 'application/json')
                return res.status(400).json({ error: `No existen carritos con el id ${cid}` })
            }

        } catch (error) {
            res.setHeader('Content-Type', 'application/json')
            res.status(500).json({ error: "Error inesperado en el servidor" })
        }
    }

    static addCart = async (req, res) => {

        try {
            const newCart = {
                products: req.body.products || []
            }

            const savedCart = await cartsDAO.createCart(newCart)
            res.header('Content-Type', 'application/json')
            res.status(201).json({ newCart: savedCart })

        } catch (error) {
            console.log("Error al guardar el producto", error)
            res.setHeader('Content-Type', 'application/json')
            res.status(500).json({ message: "Hubo un error al crear la compra" });
        }
    }

    static deleteCart = async (req, res) => {
        let { cid } = req.params
        if (!mongoose.Types.ObjectId.isValid(cid)) {
            res.setHeader("Content-Type", "application/json")
            res.status(400).json({ error: "id inválido" });
        }

        try {
            let resultado = await cartsDAO.deleteCarts(cid)
            if (resultado.deletedCount > 0) {
                res.setHeader('Content-Type', 'application/json')
                res.status(200).json({
                    message: `Se ha eliminado el carrito con id: ${cid}`
                })
            } else {
                res.setHeader("Content-Type", "application/json")
                res.status(400).json({ error: `No existen carritos con el id: ${cid}` });
            }

        } catch (error) {
            res.setHeader("Content-Type", "application/json")
            res.status(500).json({ error: 'Error en el servidor' });

        }
    }

    static deleteFromCart = async (req, res) => {
        const { cid, pid } = req.params

        if (!mongoose.Types.ObjectId.isValid(cid) || !mongoose.Types.ObjectId.isValid(pid)) {
            res.setHeader("Content-Type", "application/json")
            return res.status(400).json({ error: "id inválido" });
        }

        try {
            const updatedCart = await cartsDAO.deleteFromCart(cid, pid);
            if (!updatedCart) {
                res.header('Content-Type', 'application/json')
                return res.status(400).json({ error: "Carrito no encontrado" })
            }

            res.header('Content-Type', 'application/json')
            return res.status(200).json({ message: "Producto eliminado", cart: updatedCart })
        } catch (error) {
            res.header('Content-Type', 'application/json')
            return res.status(500).json({ error: "Error en el servidor" })
        }
    }

    static updateCart = async (req, res) => {
        let { cid, pid } = req.params;

        if (!cid || !pid) {
            res.setHeader("Content-Type", "application/json")
            return res.status(400).json({ error: "faltó ingresar cart o producto" });
        }

        if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
            res.setHeader("Content-Type", "application/json")
            return res.status(400).json({ error: "Error en formato cart o producto" });
        }

        let cart = await cartsDAO.getCartBy({ _id: cid })
        if (!cart) {
            res.setHeader("Content-Type", "application/json")
            return res.status(400).json({ error: `carrito inexistente ${cart}` });
        }

        let product = await productsDAO.getProductBy({ _id: pid })
        if (!product) {
            res.setHeader("Content-Type", "application/json")
            return res.status(400).json({ error: `producto inexistente: ${pid}` });
        }

        let indProducto = cart.products.findIndex(p => p.product == pid)
        if (indProducto == -1) {
            cart.products.push({
                product: pid, cantidad: 1
            })
        } else {
            cart.products[indProducto].cantidad += 1
        }

        try {
            let resultado = await cartsDAO.updateCart({ cid, cart })
            if (resultado.modifiedCount > 0) {
                res.setHeader("Content-Type", "application/json")
                return res.status(200).json({ payload: 'cart actualizado' });
            } else {
                res.setHeader("Content-Type", "application/json")
                return res.status(500).json({
                    error: `Error inesperado en el servidor`,
                })
            }
        } catch (error) {
            console.log(error);
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json(
                {
                    error: `Contacte al administrador, 
                    detalle: ${error.message}`
                }
            )
        }
    }
    static addProdToExistCart = async (req, res) => {
        try {

            const carts = await cartmanager.getCarts()
            const cartId = req.params.cid.toString();
            const prodById = req.params.pid.toString()

            if (!mongoose.Types.ObjectId.isValid(cartId)) {
                res.setHeader('Content-Type', 'application/json')
                return res.status(400).json({ error: "ID de carrito inválido" })
            }

            if (!Number.isInteger(prodById)) {
                return res.status(400).json({ error: "ID de carrito inválido" })
            }

            const cart = carts.find(c => c.id === cartId)

            if (!cart) {
                return res.status(400).json({ error: "Carrito no encontrado" })
            }

            const productAdd = await productsDAO.getProductsById(prodById)

            if (!productAdd) {
                return res.status(400).json({ error: "Carrito no encontrado" })
            }

            const existingProduct = cart.products.find(p => p.id === prodById)

            if (existingProduct) {
                existingProduct.quantity++
            } else {
                cart.products.push({ id: prodById, quantity: 1 })
            }

            await cartsDAO.saveCart(carts)
            res.status(200).json({ cart })

        } catch (error) {
            console.error("Error al procesar la solicitud", error)
            res.status(500).json({ error: "Error en el servidor" })

        }
    }
}
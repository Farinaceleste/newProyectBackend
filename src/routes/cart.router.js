import { Router } from "express";
import CartController from "../controller/carts.controller.js";
import { auth } from "../middlewares/auth.js";
import passport from "passport";
import { productsService } from "../services/product.service.js";
import { cartService } from "../services/cart.service.js";
import { CartMongoDAO } from "../dao/mongo/CartMongoDAO.js";
import { ProductMongoDAO } from "../dao/mongo/ProductMongoDAO.js";
import { TicketsDAO } from "../dao/mongo/TicketMongoDAO.js";
export const router = Router()

//router.use(auth("user")); 

router.get("/", CartController.getCarts)

router.post('/', CartController.createCart)

router.get('/:cid', CartController.getCartById);

router.post('/:cid/:pid', CartController.addProdToExistCart);

router.delete('/:cid/product/:pid', CartController.deleteFromCart);

router.delete("/:cid", CartController.deleteCart);

router.put("/:cid/product/:pid", CartController.addProdToCart);

router.post("/comprar/:cid", passport.authenticate("current"), async (req, res) => {
    const { cid } = req.params;
    res.setHeader('Content-Type', 'application/json');
  
    if (!isValidObjectId(cid)) {
      return res.status(400).json({ error: `Se ha ingresado un id de carrito inválido` });
    }
  
    const cart = await CartMongoDAO.getCartById({ _id: cid });
    if (!cart) {
      return res.status(400).json({ error: `Carrito inexistente. Id: ${cid}` });
    }
  
    if (cart.products.length === 0) {
      return res.status(400).json({ error: `Carrito vacío...!!!` });
    }
  
    try {
      const conStock = [];
      const sinStock = [];
      let total = 0;
      for (const cartItem of cart.products) {
        const pid = cartItem.product;
        const cantidad = cartItem.quantity;
        const product = await ProductMongoDAO.getProductById({ _id: pid });
        if (!product || product.stock - cantidad < 0) {
          sinStock.push({ product: pid, quantity: cantidad });
        } else {
          conStock.push({
            _id: pid,
            title: product.title,
            quantity: cantidad,
            price: product.price,
            subtotal: product.price * cantidad,
            stockPrevioCompra: product.stock,
          });
          product.stock -= cantidad;
          await ProductMongoDAO.updateProduct(pid, product);
          total += cantidad * product.price;
        }
      }
  
      if (conStock.length === 0) {
        return res.status(400).json({ error: `No hay ítems en condiciones de ser facturados (verificar stock / existencia del producto)` });
      }
  
      const nroComp = Date.now();
      const fecha = new Date();
      const email = req.user.email;
  
      const nuevoTicket = await TicketsDAO.create({
        nroComp,
        fecha,
        email,
        items: conStock,
        total,
      });
  
      cart.products = sinStock;
      await CartMongoDAO.updateCart(cid, cart);
  
      const mensaje = `Su compra ha sido procesada...!!! <br>
  Ticket: <b>${nroComp}</b> - importe a pagar: <b><i>$ ${total}</b></i> <br>
  Contacte a pagos para finalizar la operación: pagos@cuchuflito.com
  <br><br>
  ${sinStock.length > 0? `Algunos items del carrito no fueron procesados. Verifique: ${JSON.stringify(sinStock, null, 5)}` : ""}`;
  
      await enviarMail(email, "Compra realizada con éxito...!!!", mensaje);
  
      return res.status(200).json({ nuevoTicket });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
        detalle: `${error.message}`,
      });
    }
  });
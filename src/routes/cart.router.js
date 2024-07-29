import { Router } from "express";
import CartController from "../controller/carts.controller.js";
import  TicketController from "../controller/ticket.controller.js";
export const router = Router()

router.get('/', CartController.getCarts)

router.get("/:cid", CartController.getCartById)

router.post("/", CartController.createCart)

router.put("/:cid/products/:pid", CartController.updateCart)

router.delete("/:cid/products/:pid", CartController.deleteFromCart)

router.delete("/:cid", CartController.deleteCart)

router.get('/:cid/purchase', TicketController.createTicket)


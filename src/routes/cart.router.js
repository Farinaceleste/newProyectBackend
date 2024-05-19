import { Router } from "express";
import CartController from "../controller/carts.controller.js";
export const router = Router()

router.get('/', CartController.getCart)

router.get("/:cid", CartController.getCartById)

router.post("/", CartController.addCart)

router.post("/:cid/product/:pid", CartController.addProdToExistCart)

router.put("/:cid", CartController.updateCart)

router.put("/:cid/products/:pid", CartController.updateExistCart)

router.delete("/:cid/products/:pid", CartController.deleteFromCart)

router.delete("/:cid", CartController.deleteCart)




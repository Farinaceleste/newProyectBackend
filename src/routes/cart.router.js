import { Router } from "express";
import CartController from "../controller/carts.controller.js";
export const router = Router()

router.post('/',CartController.createCart)

router.get('/:cid', CartController.getCartById);

router.post('/:cid/:pid', CartController.addProdToExistCart);

router.delete('/:cartId/product/:productId', CartController.deleteFromCart);
  
router.delete("/:cartId", CartController.deleteCart);
  
router.put("/:cid/product/:pid", CartController.addProdToCart);

router.post("/purchase/:cid", CartController.purchaseCart);

router.get("/", CartController.getCarts)


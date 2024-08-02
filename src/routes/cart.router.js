import { Router } from "express";
import CartController from "../controller/carts.controller.js";
import { passportCall } from "../utils.js";
export const router = Router()

router.post('/',CartController.createCart)

router.get('/:cid', CartController.getCartById);

router.post('/:cid/:pid', CartController.addProdToExistCart);

router.delete('/:cartId/products/:productId', CartController.deleteFromCart);
  
router.delete("/:cartId", CartController.deleteCart);
  
router.put("/:cid/product/:pid", CartController.updateProductQuantity);

router.post("/:cid/purchase", passportCall('current'), CartController.purchaseCart);

router.get("/", CartController.getCarts)


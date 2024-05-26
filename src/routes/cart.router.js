import { Router } from "express";
import CartController from "../controller/carts.controller.js";
export const router = Router()

router.get('/', CartController.getCart)

router.get("/:cid", CartController.getCartBy)

router.post("/", CartController.addCart)

router.put("/:cid/products/:pid", CartController.updateCart)

router.delete("/:cid/products/:pid", CartController.deleteFromCart)

router.delete("/:cid", CartController.deleteCart)

router.get('/:cid/purchase', (req, res) => {

    let {cid} = req.params
    console.log(cid)

    
})


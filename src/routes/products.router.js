import { Router } from "express";
import  ProductsController  from '../controller/products.controller.js'
import { auth } from "../middlewares/auth.js";

export const router = Router();

router.get('/', auth("admin"), ProductsController.getProducts)

router.get('/:id', auth("admin"), ProductsController.getProductById)

router.post("/", auth("admin"), ProductsController.createProduct)

router.put("/:id", auth("admin"), ProductsController.updateProduct)

router.delete("/:id", auth("admin"), ProductsController.deleteProducts)




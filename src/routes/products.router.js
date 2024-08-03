import { Router } from "express";
import  ProductsController  from '../controller/products.controller.js'
export const router = Router();

router.get('/', ProductsController.getProducts)

router.get('/:id', ProductsController.getProductById)

router.post("/", ProductsController.createProduct)

router.put("/:id", ProductsController.updateProduct)

router.delete("/:id", ProductsController.deleteProducts)




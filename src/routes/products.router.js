import { Router } from "express";
import  ProductsController  from '../controller/products.controller.js'
export const router = Router();

// router.get('/', async (req, res) => {

//   try {
//     //GET SIN PAGINAR
//     //let products = await productmanager.getProducts()

//     //GET PAGINADO
//     const page = req.query.page || 1;
//     const limit = req.query.limit || 2;
//     let products = await productmanager.getProducts(page, limit)

//     res.setHeader("Content-Type", "application/json")
//     res.status(200).json({ products })
//   } catch (error) {
//     res.setHeader("Content-Type", "application/json")
//     return res.status(500).json({ error: "Error inesperado en el servidor" })
//   }

// })

router.post("/", ProductsController.addProduct)

router.put("/:id", ProductsController.updateProduct)

router.delete("/:id", ProductsController.deleteProducts)

router.get('/', ProductsController.getProducts)

router.get('/:id', ProductsController.getById)
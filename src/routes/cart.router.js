import { Router } from "express";
import CartController from "../controller/carts.controller.js";
export const router = Router()
import mongoose, { isValidObjectId } from "mongoose";
import { CartMongoDAO } from "../dao/CartMongoDAO.js";
import { ProductMongoDAO } from "../dao/ProductMongoDAO.js";



router.get('/', CartController.getCart)

router.get("/:cid", CartController.getCartBy)

router.post("/", CartController.addCart)

router.put("/:cid/products/:pid", CartController.updateCart)

router.delete("/:cid/products/:pid", CartController.deleteFromCart)

router.delete("/:cid", CartController.deleteCart)

router.get('/:cid/purchase', async(req, res) => {

    let {cid} = req.params
    
    if(!isValidObjectId(cid)){
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json({error:'formato de id incorrecto'})
    }

    let cart = await CartMongoDAO.getCartBy({_id: cid})
    if(!cart){
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json({error: `Carrito ${cid} no encontrado`})
    }

    if(cart.products.length===0){
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json({error:'no se puede comprar carrito vacío'})
    }

    try {

        let conStock=[]
        let sinStock=[]
        let total=0
        for(let i=0; i<cart.products.length;i++){
            let pid=cart.products[i]._id
            let product= await ProductMongoDAO.getCartBy({_id_pid})

            if(!product || product.stock-cantidad<0){
                sinStock.push(
                    {
                        product:pid, cantidad
                    }
                )
            } else {
                conStock.push(
                    {
                        _id:pid,
                        descrip:product.descrip,
                        cantidad,
                        pecio: product.price,
                        subtotal:product.precio*cantidad, 
                        stock: product.stock                  
                     }
                )
                product.stock=product.stock-cantidad
                // await ProductMongoDAO.updateProduct(pid, product)
                total+=cantidad*product.precio

            }
        }

        console.log({conStock})
        console.log({sinStock})
        let nroCompr=Date.now()
        let email=req.user
        let fecha=new Date()

  
        res.setHeader('Content-Type', 'application/json')
        return res.status(200).json({payload:'Carrito comprado'})
    } catch (error) {
        console.log(error)
        res.setHeader('Content-Type', 'application/json')
        return res.status(500).json({
            error:'formato de id incorrecto',
            message: 'Modifique formato id'
        })
    }

    
})


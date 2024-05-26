import mongoose from "mongoose";
import { ProductMongoDAO as ProductsDAO } from "../dao/ProductMongoDAO.js";

const productsDAO = new ProductsDAO

export default class ProductsController {

    static getProducts = async (req, res) => {

        // let products = productsDAO.getAll()

        try {

            const page = req.query.page || 1;
            const limit = req.query.limit || 2;
            let products = await productmanager.getProducts(page, limit)
        
            res.setHeader("Content-Type", "application/json")
            res.status(200).json({ products })
          } catch (error) {
            res.setHeader("Content-Type", "application/json")
            return res.status(500).json({ error: "Error inesperado en el servidor" })
          }

        res.setHeader('Content-Type', 'application/json')
        res.status(200).json({ products })
    }

    static deleteProducts = async (req, res) => {

        let { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.setHeader("Content-Type", "application/json")
            res.status(400).json({ error: "id inválido" });
        }

        try {
            let resultado = await ProductsDAO.deleteProducts(id)
            if (resultado.deletedCount > 0) {
                res.setHeader("Content-Type", "application/json")
                res.status(200).json({
                    message: `Se ha eliminado el producto con id: ${id}`
                })
            } else {
                res.setHeader("Content-Type", "application/json")
                res.status(400).json({ error: `No existen productos con el id: ${id}` });
            }

        } catch (error) {
            res.setHeader("Content-Type", "application/json")
            return res.status(500).json({ error: 'Error en el servidor' });
        }
    }

    static addProduct = async (req, res) => {

        let { id } = req.params
        let updateProd = req.body

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.setHeader("Content-Type", "application/json")
            res.status(400).json({ error: "id inválido" });
        }

        if (updateProd.hasOwnProperty('_id')) {
            delete updateProd._id
        }

        if (updateProd.code) {
            let code = await productsDAO.getProductBy({ code: updateProd.code, _id: { $ne: id } })
            if (code) {
                res.setHeader("Content-Type", "application/json")
                return res.status(400).json({ error: `Ya existe el producto con code: ${code}` });
            }
        }

        try {
            let resultado = await productsDAO.updateProduct({ _id: id }, updateProd)

            if (resultado.modifiedCount > 0) {
                res.setHeader('Content-Type', 'application/json')
                res.status(200).json({ message: `Producto modificado con id ${id}` })
            } else {
                res.setHeader('Content-Type', 'application/json')
                return res.status(400).json({ error: `No existen productos con el id ${id}` })
            }

        } catch (error) {
            console.error(error)
            res.setHeader('Content-Type', 'application/json')
            return res.status(500).json({ error: "Error inesperado en el servidor" })
        }

    }

    static getById = async (req, res) => {
        let { id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.setHeader("Content-Type", "application/json")
            return res.status(400).json({ error: "id inválido" });
        }

        try {
            let prodById = await productsDAO.getProductBy({ id })

            if (prodById) {
                res.setHeader('Content-Type', 'application/json')
                return res.status(200).json({ prodById })
            } else {
                res.setHeader('Content-Type', 'application/json')
                return res.status(400).json({ error: `No existen productos con el id ${id}` })
            }

        } catch (error) {
            res.setHeader('Content-Type', 'application/json')
            return res.status(500).json({ error: "Error inesperado en el servidor" })
        }
    }

    static createProduct = async (req, res) => {
        let { title, price, description, code, stock } = req.body;
        console.log('Received product:', { title, price, description, code, thumbnail, stock })

        if (!title || !price || !description || !code || !stock) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: "Complete los campos faltantes" })
        }

        try {
            let newProduct = await productsDAO.createProduct({ title, price, description, code, stock })
            console.log('Product added successfully:', newProduct);
            res.setHeader('Content-Type', 'application/json');
            return res.status(201).json({ newProduct })

        } catch (error) {
            console.error('Error adding product:', error);
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json({ error: "Error al agregar el producto" });
        }
    }

    static getProductsPaginate = async (req, res) => {
        const options = {
            page: page || 1,
            limit: limit || 2,
            lean: true
        };

        try {
            const result = await productsDAO.getProductsPaginados({}, options);
            return result;
        } catch (error) {
            console.error('Error al obtener los productos:', error);
            throw error;
        }
    }
}
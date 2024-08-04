import mongoose from "mongoose";
import { ProductMongoDAO as ProductsDAO } from "../dao/mongo/ProductMongoDAO.js";
import CustomError from "../errors/CustomError.js";
import { argsProducts } from "../errors/productError.js";
import { ERRORES } from "../errors/errors.js";
import { productsService } from "../services/product.service.js";
import { logger } from "../utils.js";

const productsDAO = new ProductsDAO();

function isValidObjectId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

function requireRol(role) {
    if (req.user.role === 'user') {
        return res.status(401).json({ error: 'No tienes permisos suficientes para realizar esta acción' });
    }
}


export default class ProductsController {

    static getProducts = async (req, res) => {
        try {

            const products = await productsService.getProducts();

            requireRol() 
            
            res.setHeader("Content-Type", "application/json");
            return res.status(200).json({ products });
        } catch (error) {
            logger.error;
            console.log(error)
        }
    }

    static updateProduct = async (req, res) => {
        try {
            const { id } = req.params;
            const { title, description, code, price, status, stock, thumbnails } = req.body;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ error: `ID inválido` });
            }

            if (!title || !description || !code || !price || !status || !stock) {
                return res.status(400).json({ error: `Faltan datos obligatorios` });
            }

            let existingProduct = await productsService.getProductById(id);

            if (!existingProduct) {
                return res.status(404).json({ error: `No existe un producto con ID ${id}` });
            }

            if (req.user.role === 'premium' && existingProduct.owner !== req.user.email) {
                return res.status(403).json({ error: 'No tienes permiso para actualizar este producto' });
            }

            existingProduct.title = title;
            existingProduct.description = description;
            existingProduct.code = code;
            existingProduct.price = price;
            existingProduct.status = status;
            existingProduct.stock = stock;
            existingProduct.category = category;
            existingProduct.thumbnails = thumbnails;

            let updatedProduct = await existingProduct.save();

            res.status(200).json({ product: updatedProduct });
        } catch (error) {
            res.status(500).json({
                error: 'Error inesperado en el servidor - Intente más tarde, o contacte a su administrador',
                detalle: error.message
            });
        }
    }

    static deleteProducts = async (req, res) => {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            res.setHeader("Content-Type", "application/json");
            return res.status(400).json({ error: "ID inválido" });
        }

        try {
            const resultado = await productsService.deleteById(id);
            if (resultado.deletedCount > 0) {
                res.setHeader("Content-Type", "application/json");
                return res.status(200).json({ message: `Producto eliminado con ID: ${id}` });
            } else {
                res.setHeader("Content-Type", "application/json");
                return res.status(400).json({ error: `No existen productos con el ID: ${id}` });
            }
        } catch (error) {
            console.error(error);
        }
    }

    static getProductById = async (req, res) => {
        try {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ error: `Id inválido` });
            }
            const product = await productsService.getProductById(id);
            if (!product) {
                return res.status(404).json({ error: `No existe un producto con id ${id}` });
            }
            res.status(200).json({ product });
        } catch (error) {
            res.status(500).json({
                error: 'Error inesperado en el servidor - Intente más tarde, o contacte a su administrador',
                detalle: error.message
            });
        }
    }

    static createProduct = async (req, res) => {
        const { title, price, description, code, stock } = req.body;
        console.log('Received product:', { title, price, description, code, stock });

        if (!title || !price || !description || !code || !stock) {
            res.setHeader("Content-Type", "application/json");
            return res.status(400).json({ error: "Se requiere completar title, price, description, code y stock." });
        }

        try {
            const newProduct = await productsService.createProduct({ title, price, description, code, stock });
            logger.info
            res.setHeader('Content-Type', 'application/json');
            return res.status(201).json({ newProduct });
        } catch (error) {
            console.error('Error adding product:', error);
        }
    }

    // static getProductsPaginate = async (req, res) => {
    //     const { page = 1, limit = 2 } = req.query;
    //     const options = {
    //         page: parseInt(page),
    //         limit: parseInt(limit),
    //         lean: true
    //     };

    //     try {
    //         const result = await productsDAO.getProductsPaginados({}, options);
    //         res.setHeader("Content-Type", "application/json");
    //         return res.status(200).json(result);
    //     } catch (error) {
    //         console.error('Error al obtener los productos:', error);
    //         CustomError.createError({ name: 'Error al obtener los productos', cause: argsProducts(req.body), message: 'Error al obtener los productos', code: ERRORES['bad request'] });
    //         return res.status(500).json({ error: 'Error interno del servidor' });
    //     }
    // }
}
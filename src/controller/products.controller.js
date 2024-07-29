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

export default class ProductsController {

    static getProducts = async (req, res) => {
        try {
            const products = await productsService.getProducts();
            res.setHeader("Content-Type", "application/json");
            return res.status(200).json({ products });
        } catch (error) {
            logger.error;
            CustomError.createError({ name: 'Error al obtener productos', cause: argsProducts(req.body), message: 'Error al obtener productos', code: ERRORES['bad request'] });
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    static updateProduct = async (req, res) => {
        const { id } = req.params;
        const updateProd = req.body;

        if (!isValidObjectId(id)) {
            res.setHeader("Content-Type", "application/json");
            return res.status(400).json({ error: "ID inválido" });
        }

        if (updateProd.hasOwnProperty('_id')) {
            delete updateProd._id;
        }

        if (updateProd.code) {
            const code = await productsService.getProductById({ code: updateProd.code, _id: { $ne: id } });
            if (code) {
                res.setHeader("Content-Type", "application/json");
                return res.status(400).json({ error: `Ya existe un producto con el código: ${code}` });
            }
        }

        try {
            const resultado = await productsService.updateProductById(id, updateProd);
            if (resultado.modifiedCount > 0) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(200).json({ message: `Producto modificado con ID ${id}` });
            } else {
                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({ error: `No existen productos con el ID ${id}` });
            }
        } catch (error) {
            console.error(error);
            CustomError.createError({ name: 'Error al actualizar el producto', cause: argsProducts(req.body), message: 'Error al actualizar el producto', code: ERRORES['bad request'] });
            res.status(500).json({ error: 'Error interno del servidor' });
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
            CustomError.createError({ name: 'Error al eliminar el producto', cause: argsProducts(req.body), message: 'Error al eliminar el producto', code: ERRORES['error interno del servidor'] });
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    static getById = async (req, res) => {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            res.setHeader("Content-Type", "application/json");
            return res.status(400).json({ error: "ID inválido" });
        }

        try {
            const prodById = await productsService.getProductById(id);
            if (prodById) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(200).json({ prodById });
            } else {
                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({ error: `No existen productos con el ID ${id}` });
            }
        } catch (error) {
            console.error(error);
            CustomError.createError({ name: 'Error al obtener el producto', cause: argsProducts(req.body), message: 'Error al obtener el producto', code: ERRORES['bad request'] });
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    static createProduct = async (req, res) => {
        const { title, price, description, code, stock } = req.body;
        console.log('Received product:', { title, price, description, code, stock });

        if (!title || !price || !description || !code || !stock) {
            CustomError.createError({ name: 'Error al crear el producto', cause: argsProducts(req.body), message: 'Complete la propiedad que falta', code: ERRORES['argumentos inválidos'] });
            return res.status(400).json({ error: 'Complete todas las propiedades requeridas' });
        }

        try {
            const newProduct = await productsService.createProduct({ title, price, description, code, stock });
            console.log('Product added successfully:', newProduct);
            res.setHeader('Content-Type', 'application/json');
            return res.status(201).json({ newProduct });
        } catch (error) {
            console.error('Error adding product:', error);
            CustomError.createError({ name: 'Error al crear el producto', cause: argsProducts(req.body), message: 'Error al crear el producto', code: ERRORES['bad request'] });
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    static getProductsPaginate = async (req, res) => {
        const { page = 1, limit = 2 } = req.query;
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            lean: true
        };

        try {
            const result = await productsDAO.getProductsPaginados({}, options);
            res.setHeader("Content-Type", "application/json");
            return res.status(200).json(result);
        } catch (error) {
            console.error('Error al obtener los productos:', error);
            CustomError.createError({ name: 'Error al obtener los productos', cause: argsProducts(req.body), message: 'Error al obtener los productos', code: ERRORES['bad request'] });
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
}

import { ProductMongoDAO as ProductsDAO } from "../dao/ProductMongoDAO.js";

const productsDAO = new ProductsDAO

export default class ProductsController {

    static getProducts = async (req, res) => {

        let products = productsDAO.getProducts()

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
            let code = await productsDAO.getProductsBy({ code: updateProd.code, _id: { $ne: id } })
            if (code) {
                res.setHeader("Content-Type", "application/json")
                return res.status(400).json({ error: `Ya existe el producto con code: ${code}` });
            }
        }

        try {
            let resultado = await productsDAO.updateProducts({ _id: id }, updateProd)

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
            res.status(400).json({ error: "id inválido" });
        }

        try {
            let prodById = await productsDAO.getProductsById({ id })

            if (prodById) {
                res.setHeader('Content-Type', 'application/json')
                res.status(200).json({ prodById })
            } else {
                res.setHeader('Content-Type', 'application/json')
                return res.status(400).json({ error: `No existen productos con el id ${id}` })
            }

        } catch (error) {
            res.setHeader('Content-Type', 'application/json')
            return res.status(500).json({ error: "Error inesperado en el servidor" })
        }
    }

    static updateProduct = async (req, res) => {
        let { title, price, description, code, thumbnail, stock } = req.body;

        if (!title || !price || !description || !code || !stock) {
          res.setHeader('Content-Type', 'application/json');
          return res.status(400).json({ error: "Complete los campos faltantes" })
        }
      
        try {
          let newProduct = await productsDAO.addProducts({title, price, description, code, thumbnail, stock})
          res.setHeader('Content-Type', 'application/json');
          return res.status(201).json({newProduct})
      
        } catch(error) {
          res.setHeader('Content-Type', 'application/json');
          return res.status(500).json({ error: "Error al agregar el producto" })
        }
    }
}

import { ProductsMongoDAO as ProductsDAO } from "../dao/ProductMongoDAO.js";

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
}
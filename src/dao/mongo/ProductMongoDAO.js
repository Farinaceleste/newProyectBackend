import { productsModelo } from "../models/products.model.js"

export class ProductMongoDAO {

    async getProductsPaginados(page, limit) {
        return await productsModelo.find(page, limit)
    }

    async getAll () {
        return await productsModelo.find().lean()
    }

    async getProductById(filtro={}) {
        return await productsModelo.findOne(filtro).lean()
        
    }

    async updateProduct(id, product = {}) {
        return await productsModelo.updateOne({ _id: id }, product).lean()
    }

    async deleteById(id) {
        return await productsModelo.deleteOne({ _id: id }).lean()
    }

    async createProduct (product) {
        let resultado = await productsModelo.create(product)
        return resultado.toJSON()
    }

}

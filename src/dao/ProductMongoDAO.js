import { productsModelo } from "./models/products.model.js"

export class ProductMongoDAO {

    // async getProducts(page, limit) {
    //     // //return await modeloProducts.find().lean()

    //     // const options = {
    //     //     page: page || 1,
    //     //     limit: limit || 2,
    //     //     lean: true
    //     // };

    //     // try {
    //     //     const result = await productsModelo.paginate({}, options);
    //     //     return result;
    //     // } catch (error) {
    //     //     console.error('Error al obtener los productos:', error);
    //     //     throw error;
    //     // }
    // }

    async getProductsPaginados(page, limit) {
        return await productsModelo.find(page, limit)
    }

    async getAll () {
        return await productsModelo.find().lean()
    }

    async getProductBy(filtro={}) {
        return await productsModelo.findOne(filtro).lean()
    }

    async updateProduct(id, modificacion = {}) {
        return await productsModelo.findOneAndUpdate({ _id: id }, modificacion).lean()
    }

    async deleteProduct(id) {
        return await productsModelo.deleteOne({ _id: id }).lean()
    }

    async createProduct (product) {
        let resultado = await productsModelo.create(product)
        console.log(resultado)
        return resultado.toJSON()
    }

}

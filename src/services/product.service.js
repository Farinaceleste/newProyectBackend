import { ProductMongoDAO as DAO } from "../dao/mongo/ProductMongoDAO.js";

class ProductService {
    constructor(dao) {
        this.dao = new dao();
    }

    async getProducts() {
        return await this.dao.getAll();
    }

    async getProductById(id) { 
        return await this.dao.getProductById( {_id:id} );
    }

    async createProduct(product) {
        return await this.dao.createProduct(product);
    }

    async deleteById(id){
        return await this.dao.deleteById({_id:id});
    }

    async updateProduct(id, product = {}) {
        return await this.dao.updateProduct({ _id: id }, product)
    }
}

export const productsService = new ProductService(DAO);
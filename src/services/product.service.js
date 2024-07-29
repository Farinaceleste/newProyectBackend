import { ProductMongoDAO as DAO } from "../dao/mongo/ProductMongoDAO.js";

class ProductService {
    constructor(dao) {
        this.dao = new dao();
    }

    async getProducts() {
        return await this.dao.getAll();
    }

    async getProductById(id) { 
        return await this.dao.getById({ id });
    }

    async createProduct(product) {
        return await this.dao.createProduct(product);
    }

    async deleteProduct(id) {
        return await this.dao.deleteProduct(id);
    }

    async deleteById(id){
        return await this.dao.deleteById(id);
    }
}

export const productsService = new ProductService(DAO);
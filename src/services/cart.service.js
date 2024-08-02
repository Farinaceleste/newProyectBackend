import { CartMongoDAO as DAO } from "../dao/mongo/CartMongoDAO.js";

class CartService {
    constructor(dao){
        this.dao = new dao();
    }

    async getAllCarts(){
        return await this.dao.getAllCarts();
    }

    async getCartById(cid){
        return await this.dao.getCartById(cid);
    }

    async createCart(cart){
        return await this.dao.createCart(cart);
        
    }

    async deleteCart(cid){
        return await this.dao.deleteCart({cid});
    }

    async deleteFromCart(pid, cid) {
        return await this.dao.deleteFromCart({pid, cid});
    }

    async updateCart(pid, cid){
        return await this.dao.updateCart({pid, cid});
    }

    async getCartByPopulate(){
        return await this.dao.getCartByPopulate();
    }
        
}

export const cartService=new CartService(DAO)
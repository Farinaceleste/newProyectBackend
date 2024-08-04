import { CartMongoDAO as DAO } from "../dao/mongo/CartMongoDAO.js";

class CartService {
    constructor(dao){
        this.dao = new dao();
    }

    async getAllCarts(){
        return await this.dao.getAllCarts();
    }

    async getCartById(cid){
        return await this.dao.getCartById({_id:cid});
    }

    async getCartByPopulate(cid){
        return await this.dao.getCartByPopulate({_id:cid})
    }

    async createCart(cart){
        return await this.dao.createCart(cart);
        
    }

    async deleteCart(cid){
        return await this.dao.deleteCart({_id:cid});
    }

    async deleteFromCart(pid, cid) {
        return await this.dao.deleteFromCart(cid, pid);
    }

    async updateCart(cid, cart){
        return await this.dao.updateCart({_id: cid}, cart);
    }

    async getCartByPopulate(){
        return await this.dao.getCartByPopulate();
    }
        
}

export const cartService=new CartService(DAO)
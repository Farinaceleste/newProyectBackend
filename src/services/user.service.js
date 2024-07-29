import { UsuariosMongoDAO as DAO } from "../dao/mongo/UserMongoDAO.js";

class UsuariosService {
    constructor(dao){
        this.dao = new dao();
    }

    async getUsers(){
        try {
            return await this.dao.getUsers();
        } catch (error) {
            console.error("Error getting users:", error);
            throw error;
        }
    }

    async getUserById(id){
        try {
            return await this.dao.getUserById({_id:id});
        } catch (error) {
            console.error("Error getting user by ID:", error);
            throw error;
        }
    }

    async getUserByEmail(email){
        try {
            return await this.dao.getUserByEmail({email});
        } catch (error) {
            console.error("Error getting user by email:", error);
            throw error;
        }
    }

    async createUser(user){
        try {
            return await this.dao.createUser(user);
        } catch (error) {
            console.error("Error creating user:", error);
            throw error;
        }
    }

    async deleteUser(id) {
        try {
            return await this.dao.deleteUser({_id:id});
        } catch (error) {
            console.error("Error deleting user:", error);
            throw error;
        }
    }

    async updateOne(user) {
        try {
            return await this.dao.updateOne(user)
        } catch (error) {
            console.log("Error updating user: ", error)
            throw error
        }
    }
}

export const usuariosService = new UsuariosService(DAO);
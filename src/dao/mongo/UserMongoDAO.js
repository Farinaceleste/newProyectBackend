import { usersModelo } from "../models/users.model.js";

export class UsuariosMongoDAO {

    async createUser(user) {
        try {
            const resultado = await usersModelo.create(user);
            return resultado.toJSON();
        } catch (error) {
            console.error("Error creando usuario:", error);
            throw error;
        }
    }

    async getUserByEmail(email) {
        try {
            return await usersModelo.findOne( email ).lean();
        } catch (error) {
            console.error("Error obteniendo usuario por email:", error);
            throw error;
        }
    }

    async getUsers() {
        try {
            return await usersModelo.find().lean();
        } catch (error) {
            console.error("Error obteniendo usuarios:", error);
            throw error;
        }
    }

    async getUserById(id) {
        try {
            return await usersModelo.findById({_id:id}).lean();
        } catch (error) {
            console.error("Error obteniendo usuario por ID:", error);
            throw error;
        }
    }

    async deleteUser(id) {
        try {
            return await usersModelo.deleteOne({ _id: id });
        } catch (error) {
            console.error("Error eliminando usuario:", error);
            throw error;
        }
    }

    async updateOne(id, user) {
        try {
            return await usersModelo.updateOne({ _id: id }, user).lean();
        } catch (error) {
            console.error("Error actualizando usuario:", error);
            throw error;
        }
    }
}

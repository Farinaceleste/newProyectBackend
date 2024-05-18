import { usersModelo } from "./models/users.models.js";

export class UsuariosMongoDAO {

    async create(user) { // crear un nuevo usuario
        return await usersModelo.create(user)
    }

    async getBy (filter={}) { // buscar usuario en particular, segun un filtro
        return await usersModelo.findOne(filter).lean()
    }

    async getAll(filter={}) {
        return await usersModelo.find(filter).lean()
    }


}
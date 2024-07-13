import { usersModelo } from "./models/users.model.js";

export default class UsuariosMongoDAO {

    async create(user) { // crear un nuevo usuario
        let resultado = await usersModelo.create(user)
        return resultado.toJSON()
    }

    async getOneBy (filter={}) { // buscar usuario en particular, segun un filtro
        return await usersModelo.findOne(filter).lean()
    }

    async getAll(filter={}) {
        return await usersModelo.find(filter).lean()
    }

    async get() {
        return await usersModelo.find.lean()
    }
}


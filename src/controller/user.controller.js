import { UsuariosMongoDAO as UsersDAO} from "../dao/UserMongoDAO.js";

const usersDAO = new UsersDAO

export default class UserController {

    static getUsers = async (req, res) => {

        let users = usersDAO.getAll()

        res.setHeader('Content-Type', 'application/json')
        res.status(200).json({users})
    }

    static create = async (req, res) => {
        let {nombre, email} = req.body

        if(!email) {
            res.setHeader('Content-Type', 'application/json')
            return res.status(400).json({error: 'email requerido'})
        }

        let existe 

        try {
            existe = await usersDAO.getBy({email})
        } catch (error) {
            console.log(error)
            res.setHeader('Content-Type', 'application/json')
            return res.status(500).json({error: 'Error inesperado en el servidor'})
        }

        if (existe) {
            res.setHeader('Content-Type', 'application/json')
            return res.status(400).json({error: 'Ya existe el email'})
        }

        try {
            let newUser = await usersDAO.create({nombre, email})
            res.setHeader('Content-Type', 'application/json')
            return res.status(200).json({newUser})

        } catch (error) {
            console.log(error)
            res.setHeader('Content-Type', 'application/json')
            return res.status(500).json({error: 'Error inesperado en el servidor'})
        }
    }


}
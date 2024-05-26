import { UsuariosMongoDAO } from "../dao/UserMongoDAO.js";

const usersDAO = new UsuariosMongoDAO

export default class UserController {

    static getAll= async (req, res) => {

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

    static getBy = async (req, res) => {
        let {email} = req.params
            
        try {
            existeUser = await usersDAO.getBy({email})
            if(existeUser) {
                res.setHeader('Content-Type', 'application/json')
                return res.status(200).json({existeUser})
            } else {
                res.setHeader('Content-Type', 'application/json')
                return res.status(400).json({error: `No existe usuario con el email ${email}`})
            }
        } catch (error) {
            console.log(error)
            res.setHeader('Content-Type', 'application/json')
            return res.status(500).json({error: 'Error inesperado en el servidor'})
        }
    }


}
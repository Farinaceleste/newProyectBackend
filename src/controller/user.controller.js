import { UsuariosMongoDAO } from "../dao/UserMongoDAO.js";
import { ERRORES } from "../errors/errors.js";
import { argsUser } from "../errors/userError.js";

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
            // res.setHeader('Content-Type', 'application/json')
            // return res.status(400).json({error: 'email requerido'})
            CustomError.createError({name: 'Falta completar campos', cause: argsUser(req.body), message: 'Falta completar campos', code: ERRORES['argumentos inválidos']})
        }

        let existe 

        try {
            existe = await usersDAO.getBy({email})
        } catch (error) {
            console.log(error)
            // res.setHeader('Content-Type', 'application/json')
            // return res.status(500).json({error: 'Error inesperado en el servidor'})
            CustomError.createError({name: 'Error interno del servidor', cause: argsProducts(req.body), message: 'Error interno del servidor', code: ERRORES['error interno del servidor']})
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
            // res.setHeader('Content-Type', 'application/json')
            // return res.status(500).json({error: 'Error inesperado en el servidor'})
            CustomError.createError({name: 'Error interno del servidor', cause: argsProducts(req.body), message: 'Error interno del servidor', code: ERRORES['error interno del servidor']})
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
            // res.setHeader('Content-Type', 'application/json')
            // return res.status(500).json({error: 'Error inesperado en el servidor'})
            CustomError.createError({name: 'Error interno del servidor', cause: argsProducts(req.body), message: 'Error interno del servidor', code: ERRORES['error interno del servidor']})
        }
    }
}
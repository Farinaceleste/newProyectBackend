import { usuariosService } from "../services/user.service.js";
import { creaHash, validaPassword } from "../utils.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import UsuariosDTO from "../DTO/UsuariosDTO.js";

const register = async (req, res) => {
    try {
        const {first_name, last_name, email, password} = req.body
        if(!first_name || !last_name || !email || !password) {
            return res.status(400).json({message: "Incomplete values"})
        }

        const existUser = await usuariosService.getUserByEmail(email)
        if(existUser) {
            return res.status(400).json({message: "User already exists."})
        }

        if(email==="admin@test.com" && password==="123"){
            usuario={email, rol:"admin"}
        }

        const hashedPassword = await creaHash(password)
        const newUser = {
            first_name,
            last_name,
            email, 
            password: hashedPassword
        }

        let result = await usuariosService.createUser(newUser)
        res.send({status: "success", payload: result._id})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "Server error"})
    }
}

const login = async (req, res) => {

    const {email, password} = req.body

    if (!email || !password) {
        return res.status(400).json({message: "Incomplete values"})
    }
    const user = await usuariosService.getUserByEmail(email)
    if(!user){
        return res.status(400).json({message: "User not found."})
    }

    const isValidPassword = await validaPassword(password, user.password)

    if(!isValidPassword) {
        return res.status(400).json({message: "Invalid password."})
    }

    const userDto = UsuariosDTO.getUserTokenFrom(user)
    const token = jwt.sign(userDto, config.general.PASSWORD, {expiresIn:"1h"})
    res.cookie("CoderCoder123", token, {maxAge:3600000}).send({status:"success", user, token})
}

const current = async (req, res) => {
    if (req.isAuthenticated()) {
        const userDTO = new UsuariosDTO(req.user);
        return res.json({ userDTO });
    } else {
        return res.status(401).json({ error: "No hay usuario autenticado." });
    }
}

const logout = async (req, res) => {
    req.session.destroy(e => {
        if (e) {
            res.setHeader('Content-Type', 'application/json')
            res.status(500).json({
                error: 'Error al cerrar sesión',
                detalle: `${e.message}`
            })
        } else {
            console.log('Logout exitoso')
            res.redirect('/login');
        }
    })
}
 
export default {
    register,
    login,
    current,
    logout

}
import { isValidObjectId } from "mongoose"
import { usuariosService } from "../services/user.service.js"

export default class UsuariosController{

    static getUsers=async(req,res)=>{

        let user=await usuariosService.getUsers()

        res.setHeader('Content-Type','application/json')
        res.status(200).json({user})
    }

    static deleteUser=async(req,res)=>{

        const { id } = req.params;

        try {
            const resultado = await usuariosService.deleteUser();
            if (resultado.deletedCount > 0) {
                res.setHeader("Content-Type", "application/json");
                return res.status(200).json({ message: `Usuario eliminado con ID: ${id}` });
            } else {
                res.setHeader("Content-Type", "application/json");
                return res.status(400).json({ error: `No existen usuarios con el ID: ${id}` });
            }
        } catch (error) {
            console.error(error);
        }
    } 

    static getUsuarioById=async(req,res)=>{

        let {id}=req.params
        if(!isValidObjectId(id)){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`Ingrese un id de MongoDB válido`})
        }

        let user=await usuariosService.getUserById({_id:id})

        res.setHeader('Content-Type','application/json')
        res.status(200).json({user})
    }

    static createUser =async(req,res)=>{
        let{first_name, last_name, email, role}=req.body
        if(!email){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`email es requerido`})
        }

        let existe
        try {
            existe = await usuariosService.getUserByEmail({email})
        } catch (error) {
            console.log(error);
            res.setHeader('Content-Type','application/json');
            return res.status(500).json(
                {
                    error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                    detalle:`${error.message}`
                }
            )
        }
        if(existe){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`Ya existe un usuarios con email ${email}`})
        }

        try {
            let newUser=await usuariosService.createUser({first_name, last_name, role, email})
            res.setHeader('Content-Type','application/json');
            return res.status(200).json({newUser});            
        } catch (error) {
            console.log(error);
            res.setHeader('Content-Type','application/json');
            return res.status(500).json(
                {
                    error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                    detalle:`${error.message}`
                }
            )
        }
    }
}
import { Router } from "express";
import passport from "passport";
import UserController from "../controller/user.controller.js";
import { passportCall, SECRET, sendMail } from "../utils.js";
import { usersModelo } from "../dao/models/users.model.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

export const router = Router()


router.get('/error', async(req, res) => {
    res.setHeader('Content-Type','application/json')
    return res.status(500).json({error: 'Algo salió mal'})
})

router.post('/registro', passport.authenticate('registro', {failureRedirect:'api/sessions/error'}), async (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    // return res.status(200).json({ message: 'Registro exitoso', user: req.user })
    return res.redirect('/login');
})

router.post('/recupero01', async (req, res) => {
    
    let {email} = req.body

    if(!email) {
        res.setHeader('Content-Type', 'application/json')
        res.status(400).json({ error: `No existen usuarios con email ${email}` })
    }

    let user = await usersModelo.findOne({email}).lean()
    
    delete user.password
    let url = `http://localhost:8080/api/sessions/recupero02?token=${token}`
    let token = jwt.sign(user, config.general.PASSWORD, {expiresIn:'1hr'})
    let mensaje = `Ha solicitado reinicio de clave, si no fue usted, contacte al administrador. <a href="${url}">Haga click aquí</a>`


try {
    await sendMail(email, 'Recupero de password', mensaje)
    res.redirect('/recupero01.html?mensaje=Recibirá un email, siga los pasos')
} catch (error) {
    console.log(error)
    res.setHeader('Content-Type', 'application/json')
    return res.status(500).json(
        {
            error:`Error inesperado en el servidor.
            detalle:${error.message}`
        }
    )
}
})

router.get('/user', passportCall('jwt'), (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.status(200).json({
        mensaje: 'Perfil usuario',
        datosUsuario: req.user
    })
})

router.post('/login', passport.authenticate('login', {failureRedirect:'api/sessions/error'}), async (req, res) => {

    req.session.user = req.user

    let token=jwt.sign(user, SECRET)

    res.setHeader('Content-Type', 'application/json')
    res.status(200).json({ message: 'login correcto', user: req.user })
})

router.get('/current', (req, res) => {
    const user = req.session.user
    const userData = {
        email: user.email,
    }
    if(user) {
        res.setHeader('Content-Type', 'application/json')
        res.status(200).json({userData, login:req.session.user})
    } else {
        res.setHeader('Content-Type', 'application/json')
        res.status(401).json({error: 'No hay usuario logueado'})
    }  
})

router.get('/logout', (req, res) => {

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
})

router.get('/github', passport.authenticate('github', {}) , async (req, res) => {

})

router.get('/callbackGithub', passport.authenticate('github', {failureRedirect:'api/sessions/error'}) , async (req, res) => {

    req.session.usuario=req.user

    res.setHeader('Content-Type','application/json')
    res.status(200).json({message: 'Registro exitoso', user: req.user})

})

router.get('/', UserController.getAll)

router.post('/', UserController.create)

router.post('/', UserController.getBy)


import { Router } from "express";
import passport from "passport";
import UserController from "../controller/user.controller.js";
export const router = Router()

router.get('/error', async(req, res) => {
    res.setHeader('Content-Type','application/json')
    return res.status(500).json({error: 'Algo salió mal'})
})

router.post('/registro', passport.authenticate('registro', {failureRedirect:'api/sessions/error'}), async (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    return res.status(200).json({ message: 'Registro exitoso', user: req.user })
})

router.post('/login', passport.authenticate('login', {failureRedirect:'api/sessions/error'}), async (req, res) => {

    req.session.user = req.user

    res.setHeader('Content-Type', 'application/json')
    res.status(200).json({ message: 'login correcto', user: req.user })

})

router.get('/current', (req, res) => {
    let user = req.session.user
    if(user) {
        res.status(200).json({user, login:req.session.user})
    } else {
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

// router.get('/current', (req, res) => {

// req.session.user = req.user
//     res.setHeader('Content-Type', 'application/json')
//     res.status(200).json({user: req.user})

// })

router.get('/', UserController.getUsers)

router.post('/', UserController.create)


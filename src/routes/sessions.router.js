import { Router } from "express";
import { UsuariosManagerMongo } from "../dao/usersmanager.js";
import passport from "passport";
export const router = Router()

let userManager = new UsuariosManagerMongo()

router.get('/error', async(req, res) => {
    res.setHeader('Content-Type','application/json')
    return res.status(500).json({error: 'Algo salió mal'})
})

router.post('/registro', passport.authenticate('registro', {failureRedirect:'api/sessions/error'}), async (req, res) => {

    // let { first_name, last_name, email, age, password } = req.body
    // if (!first_name || !last_name || !email || !age || !password) {

    //     // res.setHeader('Content-Type','application/json')
    //     return res.redirect("/registro?error=Faltan datos")
    // }

    // let existsUser = await userManager.getBy({ email })

    // if (existsUser) {
    //     // res.setHeader('Content-Type','application/json')
    //     // return res.status(400).json({error: `El usuario con email ${email} ya está registrado`})
    //     return res.redirect(`/registro?error=El usuario con email ${email} ya está registrado`)
    // }

    // // validaciones de contraseña, caracteres minimos, y email con formato valido

    // password = creaHash(password)

    // try {
    //     let newUser = await userManager.create({ first_name, last_name, email, age, password })

    //     // res.setHeader('Content-Type','application/json')
    //     // res.status(200).json({payload: 'Registro exitoso', newUser})
    //     return res.redirect(`/registro?mensaje=Registro exitoso para el usuario ${email}`)

    // } catch (error) {

    //     // res.setHeader('Content-Type','application/json')
    //     // return res.status(500).json({error:'Error inesperado en el servidor'})
    //     return res.redirect(`/registro?error=Error 500 - error inesperado`)
    // }



    res.setHeader('Content-Type', 'application/json')
    return res.status(200).json({ message: 'Registro exitoso', user: req.user })

})

router.post('/login', passport.authenticate('login', {failureRedirect:'api/sessions/error'}), async (req, res) => {

    req.session.user = req.user
    // let { email, password } = req.body
    // if (!email || !password) {

    //     res.setHeader('Content-Type', 'application/json')
    //     return res.redirect("/registro?error=Faltan datos")
    // }

    // let user = await userManager.getBy({ email })

    // if (!user) {
    //     res.setHeader('Content-Type', 'application/json')
    //     return res.status(401).json({ error: 'Email no registrado' })
    // }

    // if (user.password !== creaHash(password)) {
    //     res.setHeader('Content-Type', 'application/json')
    //     return res.status(401).json({ error: 'Contraseña incorrecta' })
    // }

    // if(!validPassword(user, password)) {
    //     res.setHeader('Content-Type', 'application/json')
    //     return res.status(401).json({ error: 'Contraseña incorrecta' })
    // }

    // user = { ...user }
    // delete user.password

    // req.session.user = user

    // if(200) {
    //     res.redirect('/profile')
    // }

    res.setHeader('Content-Type', 'application/json')
    res.status(200).json({ message: 'login correcto', user: req.user })

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
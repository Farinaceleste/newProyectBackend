import { Router } from "express";
import passport from "passport";
import { passportCall, sendMail } from "../utils.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import { usuariosService } from "../services/user.service.js";
import bcrypt from "bcrypt";

export const router = Router();

router.get('/error', async (req, res) => {
    res.status(500).json({ error: 'Algo salió mal', message: error.message });
});

router.post('/registro', passport.authenticate("registro", {
    failureRedirect: "/api/sessions/error"
}), (req, res) => {
    console.log(req.user)
    return res.redirect(`/registro?mensaje=Registro exitoso para ${user.email}`)
});


router.post('/recupero01', async (req, res) => {
    let { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Debe proporcionar un email' });
    }

    try {
        let user = await usuariosService.getUserByEmail(email);
        if (!user) {
            return res.status(400).json({ error: `No existen usuarios con email ${email}` });
        }

        delete user.password;
        let token = jwt.sign(user, config.general.PASSWORD, { expiresIn: '1h' });
        let url = `http://localhost:8080/api/sessions/recupero02?token=${token}`;
        let mensaje = `Ha solicitado reinicio de clave, si no fue usted, contacte al administrador. <a href="${url}">Haga click aquí</a>`;

        await sendMail(email, 'Recupero de password', mensaje);
        res.redirect('/recupero01.html?mensaje=Recibirá un email, siga los pasos');
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: 'Error inesperado en el servidor',
            detalle: error.message
        });
    }
});

router.get('/user', (req, res) => {
    res.status(200).json({
        mensaje: 'Perfil usuario',
        datosUsuario: req.user
    });
});

router.post('/login', passport.authenticate("login", { failureRedirect: "/api/sessions/error" }), async (req, res) => {

    let user = req.user
    user = { ...user }
    delete user.password
    let token = jwt.sign(user, config.auth.COOKIE, { expiresIn: "1h" })
    req.session.user = user
    console.log(req.user.role)
    res.cookie(config.auth.COOKIE, token, { maxAge: 1000 * 60 * 60, signed: true, httpOnly: true })

    if (user) {
        res.status(200).render("profile", { user })
    }

})



router.get('/current', passportCall("current"), (req, res) => {
    let user = req.session.user

    try {
        if (user) {
            res.status(200).render("profile", { user })
        } else {
            res.status(401).redirect("/login")
        }
    } catch (error) {
        console.error(error)
    }
});

router.get('/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    async (req, res) => {
        req.session.usuario = req.user;
        res.status(200).json({ message: 'Registro exitoso', user: req.user });
    }
);

router.get('/callbackGithub', passport.authenticate('github', { failureRedirect: '/api/sessions/error' }), async (req, res) => {
    req.session.user = req.user;
    delete user.password
    res.status(200).json({ message: 'Registro exitoso', user: req.user });
});

router.get("/recupero02", (req, res) => {
    const { token } = req.query;

    try {
        const decoded = jwt.verify(token, config.SECRET);
        res.redirect(`/recoverpsw02.html?token=${token}`);
    } catch (error) {
        res.status(400).json({ error: "Token inválido o expirado" });
    }
});

router.post("/recupero03", async (req, res) => {
    const { token, password, confirmPassword } = req.body;

    if (!token) {
        return res.status(400).json({ error: "Token es requerido" });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ error: "Las contraseñas no coinciden" });
    }

    try {
        const decoded = jwt.verify(token, config.SECRET);
        const userId = decoded._id;

        const hashedPassword = await bcrypt.hash(password, 10);
        const updateResult = await usuariosService.updateOne({ _id: userId }, { password: hashedPassword });

        if (updateResult.nModified === 0) {
            return res.status(400).json({ error: "Usuario no encontrado para actualizar contraseña" });
        }

        res.status(200).json({ message: "Contraseña actualizada exitosamente" });
    } catch (error) {
        console.error('Error al cambiar la contraseña:', error);
        res.status(400).json({ error: "Token inválido o expirado" });
    }
});

router.get("/logout", (req, res) => {
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

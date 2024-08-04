import passport from "passport";
import local from "passport-local";
import { creaHash, validaPassword } from "../utils.js";
import github from "passport-github2";
import JwtStrategy from 'passport-jwt';
import { usuariosService } from "../services/user.service.js";
import { usersModelo } from "../dao/models/users.model.js";
import { cartService } from "../services/cart.service.js";
import { config } from "./config.js";

const buscarToken = (req) => {
    let token = null;
    const cookieName = config.auth.COOKIE;

    if (req.signedCookies[cookieName]) {
        token = req.signedCookies[cookieName];
    }

    return token;
};

export const initPassport = () => {

    passport.use(
        'registro',
        new local.Strategy(
            {
                usernameField: 'email',
                passwordField: 'password',
                passReqToCallback: true
            },
            async (req, username, password, done) => {
                try {
                    const { first_name, last_name, email, age } = req.body;
                    if (!first_name || !email) {
                        return done(null, false, { message: 'complete campos faltantes' });
                    }

                    const existe = await usuariosService.getUserByEmail(email);

                    if (existe) {
                        return done(null, false, { message: 'Email already exists' });
                    }

                    password = creaHash(password);

                    const role = req.body.role;
                    let rol;
                    if (role === 'user') {
                        rol = await usersModelo.findOne({ descrip: "user" });
                    } else if (role === 'admin') {
                        rol = await usersModelo.findOne({ descrip: "admin" });
                    }
                    const newCart = await cartService.createCart();
                    const newUser = await usuariosService.createUser({
                        first_name,
                        last_name,
                        age,
                        email: username,
                        password,
                        role: role,
                        cart: newCart._id
                    });
                    console.log((newCart._id))
                    delete newUser.password
                    return done(null, newUser)

                } catch (error) {
                    return done(error);
                }
            }
        )
    );
    passport.use(
        'login',
        new local.Strategy(
            {
                usernameField: "email",
                passwordField: "password"
            },
            async (username, password, done) => {
                try {
                    let user = await usuariosService.getUserByEmail(username)
                    if (!user) {
                        return done(null, false)
                    }

                    if (!validaPassword(password, user.password)) {
                        return done(null, false)
                    }

                    return done(null, user)

                } catch (error) {
                    return done(error)
                }
            }
        )
    )

    passport.use(
        'github',
        new github.Strategy(
            {
                clientID: 'Iv1.17565cf9e9e26584',
                clientSecret: 'f8b46dc73d16d58b2ec3b9f5ad0203edfca9040d',
                callbackURL: 'http://localhost:8080/api/sessions/callbackGithub'
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    let { name: first_name, email } = profile._json

                    let user = await usuariosService.getUserByEmail(email)
                    if (!user) {
                        user = await usuariosService.createUser({
                            first_name, email, profileGithub: profile
                        })
                    }
                    return done(null, user)

                } catch (error) {
                    return done(error)
                }
            }
        )
    )

    passport.use("current",
        new JwtStrategy.Strategy(
            {
                secretOrKey: config.general.PASSWORD,
                jwtFromRequest: JwtStrategy.ExtractJwt.fromExtractors([buscarToken])
            },
            async (user, done) => {
                try {
                    return done(null, user);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );

    passport.serializeUser((user, done) => {
        return done(null, user)
    })

    passport.deserializeUser((user, done) => {
        return done(null, user)
    })
}
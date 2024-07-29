import passport from "passport";
import local from "passport-local";
import { creaHash, validaPassword } from "../utils.js";
import github from "passport-github2";
import passportjwt from "jsonwebtoken";
import { usuariosService } from "../services/user.service.js";
import { usersModelo } from "../dao/models/users.model.js";

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
                    const { first_name, last_name, email } = req.body;
                    if (!first_name || !email ) {
                        return done(null, false, { message: 'complete campos faltantes' });
                    }

                    const existe = await usuariosService.getUserByEmail(email);

                    if (existe) {
                        return done(null, false, { message: 'Email already exists' });
                    }

                    password = creaHash(password);

                    let rol = await usersModelo.findOne({ descrip: "usuario" });
                    if (!rol) {
                        rol = await usersModelo.create({ descrip: "usuario" });
                    }

                    const user = await usuariosService.createUser({
                        first_name,
                        last_name,
                        age,
                        email: username,
                        password,
                        rol: rol._id,
                        cart: null 
                    });

                    if (user) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: 'Error creating user' });
                    }

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

                    let user = await usuariosService.getUserByEmail( email )
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

    // passport.use(
    //     'jwt',
    //     new passportjwt.Strategy(
    //         {
    //             secretOrKey: SECRET,
    //             jwtFromRequest: new passportjwt.ExtractJwt.fromExtractors([buscaToken])
    //         },
    //         async (contenidoToken, done) => {
    //             try {
    //                 console.log('passport')

    //                 if (contenidoToken === 'Maria'){
    //                     return done (null, false, {message:'El usuario tiene permisos para acceder'})
    //                 }

    //                 return done (null, contenidoToken)
    //             } catch (error) {
    //                 return done(error)
    //             }
    //         }
    //     )
    // )

    passport.serializeUser((user, done) => {
        return done(null, user)
    })

    passport.deserializeUser((user, done) => {
        return done(null, user)
    })
}
import passport from "passport";
import local from "passport-local";
import { UsuariosMongoDAO } from "../dao/UserMongoDAO.js";
import { creaHash, validaPassword } from "../utils.js";
import github from "passport-github2";
import { config } from "./config.js";

let usersDAO = new UsuariosMongoDAO()

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
                    let { first_name } = req.body
                    if (!first_name) {
                        return done(null, false)
                    }

                    let existe = await usersDAO.getBy({ email: username })

                    if (existe) {
                        return done(null, false)
                    }

                    password = creaHash(password)

                    let user = await usersDAO.create({
                        first_name, password, email: username
                    })

                    if (user) {
                        return done(null, user)
                    } else {
                        return done(null, false)
                    }

                } catch (error) {
                    return done(error)
                }
            }
        )
    )

    passport.use(
        'login',
        new local.Strategy(
            {
                usernameField: "email",
            },
            async (username, password, done) => {
                try {
                    let user = await usersDAO.getBy({email: username}) 
                    if (!user){
                        return done (null, false)
                    }

                    if(!validaPassword(password, user.password)){
                        return done(null, false)
                    }

                    return done (null, user)

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

                        let user = await usersDAO.getBy({ email })
                        if (!user) {
                            user = await usersDAO.create({
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

    passport.serializeUser((user, done) => {
        return done(null, user)
    })

    passport.deserializeUser((user, done) => {
        return done(null, user)
    })
}
import passport from "passport";
import local from "passport-local";
import { UsuariosManagerMongo } from "../dao/usersmanager.js";
import { creaHash } from "../utils.js";

let userManager = new UsuariosManagerMongo()

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
                    let {first_name} = req.body
                    if (!first_name) {
                        return done (null, false)
                    }

                    let existe = await userManager.getBy({email:username})

                    if(existe) {
                        return done (null, false)
                    }

                    password = creaHash(password)

                    let user = await userManager.create({
                        first_name, password, email:username
                    })

                    if (user) {
                        return done (null, user)
                    } else {
                        return done (null, false)
                    }


                } catch (error) {
                    return done (error)
                }
            }
        )

    )

    passport.use(
        'login', 
        new local.Strategy(
            {}, 
            async () => {
                try {
                    
                } catch (error) {
                    return done (error)
                }
            }
        )



    )
   




    passport.serializeUser((user, done) => {
        return done (null, user)
    })

    passport.deserializeUser((user, done) => {
        return done (null, user)
    })
}




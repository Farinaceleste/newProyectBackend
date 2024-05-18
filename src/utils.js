import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import crypto from "crypto";
import bcrypt from "bcrypt";
import passport from 'passport';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

export const rutaProducts = join(__dirname, "data", "products.json")
export const rutaCarts = join(__dirname, "data", "carts.json")

export const SECRET = "CoderCoder123"
// export const creaHash = password => crypto.createHmac("sha256", SECRET).update(password).digest('hex')
export const creaHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
export const validaPassword = (password, passwordConHash) => bcrypt.compareSync(password, passwordConHash)

export const passportCall = (estrategia) => {
    return function (req, res, next) {
        passport.authenticate(estrategia, function (err, user, info, status) {
            if (err) { return next(err) }
            if (!user) {
                res.setHeader('Content-Type', 'application-json')
                return res.status(401).json({
                    error: info.message ? info.message : info.toString(),
                    detalle: info.detalle ? info.detalle : '-',
                })
            }
            req.user=user
            next()
        })(req, res, next)
    }
}

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import bcrypt from "bcrypt";
import passport from 'passport';
import winston from 'winston';
import { config } from './config/config.js';
import nodemailer from "nodemailer"

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
            req.user = user
            next()
        })(req, res, next)
    }
}

const customLevels={
    fatal:0,
    error:1,
    warning:2,
    info:3,
    http:4,
    debug:5
}

export const logger = winston.createLogger(
    {
        levels: customLevels,
        transports: [
            new winston.transports.File(
                {
                    level: "info",
                    filename: "./logs/errors.log",
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.colorize({
                            colors:{fatal:"red", error:"orange", info:"blue", leve:"green"}
                        }),
                        winston.format.json()
                    )

                }
            )
        ]
    }
)

const transportConsola = new winston.transports.Console(
    {
        level: "debug",
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize({
                colors:{grave:"red", medio:"yellow", info:"blue", leve:"green"}
            }),
            winston.format.simple()
        )
    }
)

if(config.general.MODE != "production") {
    logger.add(transportConsola)
}

export const middLogg = (req, res, next) => {
    req.logger=logger
    next()
}

const transporter=nodemailer.createTransport(
    {
        service:"gmail",
        port:"587",
        auth:{
            user:config.auth.EMAIL,
            passGmail:config.auth.PASSGMAIL
        }
    }
)

export const sendMail=async(to, subject, message) => {
    return await transporter.sendMail(
        {
            from:config.auth.EMAIL,
            to,
            subject,
            html:message
        }
    )
}
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import bcrypt from "bcrypt";
import passport from 'passport';
import winston from 'winston';
import { config } from './config/config.js';
import nodemailer from "nodemailer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const rutaProducts = join(__dirname, "data", "products.json");
export const rutaCarts = join(__dirname, "data", "carts.json");

export const SECRET = config.general.PASSWORD;
export const creaHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const validaPassword = (password, passwordConHash) => bcrypt.compareSync(password, passwordConHash);

export const passportCall = (estrategia) => {
    return function (req, res, next) {
        passport.authenticate(estrategia, function (err, user, info, status) {
            if (err) { return next(err); }
            if (!user) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(401).json({
                    error: info.message ? info.message : info.toString(),
                    detalle: info.detalle ? info.detalle : '-',
                });
            }
            req.user = user;
            next();
        })(req, res, next);
    };
};

export const logger=winston.createLogger(
    {
        transports: [
            new winston.transports.Console(
                {
                    level: "info",
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.colorize(),
                        winston.format.simple()
                    )
                }
            ),
            new winston.transports.Console(
                {
                    level: "silly",
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        // winston.format.colorize(),
                        winston.format.prettyPrint()
                    )
                }
            ),
            new winston.transports.File(
                {
                    level: "warn",
                    filename: "./src/logs/error.log",
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        // winston.format.colorize(),
                        winston.format.prettyPrint()
                    )
                }
            )            
        ]
    }
)
if (config.general.MODE != "production") {
    logger.add(new winston.transports.Console({
        level: 'debug',
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize({ all: true }),
            winston.format.simple()
        )
    }));
}

export const middLogg = (req, res, next) => {
    req.logger = logger;
    next();
};

const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
        user: config.auth.EMAIL,
        pass: config.auth.PASSGMAIL
    }
});

export const sendMail = async (to, subject, message) => {
    try {
        if (!to || !subject || !message) {
            throw new Error('Missing required parameters');
        }

        const mailOptions = {
            from: config.auth.EMAIL,
            to,
            subject,
            html: message
        };

        const info = await transporter.sendMail(mailOptions);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

export default __dirname;

export function generateUniqueCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const codeLength = 10;
    let code = '';

    for (let i = 0; i < codeLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters.charAt(randomIndex);
    }

    return code;
}

export function calculateTotalAmount(products) {
    let total = 0;

    for (const item of products) {
        total += item.quantity * item.product.price;
    }

    return total;
}
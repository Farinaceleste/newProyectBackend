import dotenv from 'dotenv';

dotenv.config({
    path: "./src/.env",
    override: true
})

export const config = {
    general: {
        PASSWORD: process.env.PASSWORD,
        PORT: process.env.PORT || 3000,
    },
    db: {
        MONGOURL: process.env.MONGOURL,
    },
    auth: {
        CLIENTSECRET: process.env.CLIENTSECRET,
        CLIENTID: process.env.CLIENTID
    }
}
import dotenv from "dotenv"

dotenv.config({
    path: "/.env",
    override: true
})

export const config = {
    general: {
        PASSWORD:process.env.PASSWORD,
        PORT:process.env.PORT||3000,
        MODE:process.env.MODE||"development"
    },
    db: {
        MONGOURL:process.env.MONGOURL
    },
    auth: {
        CLIENTSECRET:process.env.CLIENTSECRET,
        CLIENTID:process.env.CLIENTID
    }
}
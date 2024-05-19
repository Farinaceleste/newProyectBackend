import dotenv from 'dotenv'; 

dotenv.config({
    path: "./src/.env",
    override:true
})

export const config = {
   PORT : process.env.PORT || 8080,
   PASSWORD : process.env.PASSWORD,
   CLIENTSECRET: process.env.CLIENTSECRET,
   MONGOURL: process.env.MONGOURL, 
   CLIENTID: process.env.CLIENTID
}
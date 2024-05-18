import dotenv from 'dotenv'; 


dotenv.config({
    path: '/src/.env',
    override:true
})

export const config = {
   port : process.env.port || 3000,
   secret : process.env.secret,
   clientSecret: process.env.clientSecret,
   mongooseConnect: process.env.mongooseConnect
}
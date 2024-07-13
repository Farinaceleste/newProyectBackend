import { expect } from "chai"
import { describe, it } from "mocha"
import mongoose, { isValidObjectId } from "mongoose"
import supertest from "supertest"

const requester = supertest("http://localhost:8080")

const connDB = async () => {
    try {
        await mongoose.connect(
            "mongodb+srv://farinaceleste:<password>@cluster0.nwo2jkx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
        {
            dbName: "ecommerce"
        })
    } catch (error) {
        console.log(error)
    }
}
connDB()

describe('Pruebas al router de sessions', function(){
    describe('Prueba circuito de registro/login/current', function(){
        this.timeout(10000)
        
        it('registro de usuario', ()=>
        {

        })
        it('login de usuario', ()=>
        {
    
        })
        it('current  de usuario', ()=>
        {
        
        })
    })
})
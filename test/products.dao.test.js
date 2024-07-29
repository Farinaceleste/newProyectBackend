import { expect, should } from "chai";
import mongoose from "mongoose";
import {it, describe} from "mocha"
import { ProductMongoDAO } from "../src/dao/ProductMongoDAO.js";
import { faker } from "@faker-js/faker";


should()

// const connDB = async () => {
//     try {
//         await mongoose.connect(
//             "mongodb+srv://farinaceleste:<password>@cluster0.nwo2jkx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
//         {
//             dbName: "ecommerce"
//         })
//     } catch (error) {
//         console.log(error)
//     }
// }
// connDB()

describe("Pruebas al DAO de Productos", function(){
    
    this.timeout(10000) 

    before(function(){
        this.productDAO=new ProductMongoDAO()
    })

    beforeEach(async()=>{
        await mongoose.connection.collection("ecommerce").deleteMany({email:"farinaceleste@gmail.com"})
    })

    it("El método get del DAO retorna un arreglo de productos", async function(){
        let resultado=await this.productDAO.get()

        expect(Array.isArray(resultado)).to.be.equal(true)
        if(Array.isArray(resultado) && resultado.length>0){
            expect(resultado[0]).to.have.property("_id")
            expect(resultado[0]).to.have.property("title")
            expect(resultado[0]).to.have.property("price")
            expect(resultado[0]).to.have.property("code")
            expect(resultado[0]).to.have.property("description")
            expect(resultado[0]).to.have.property("stock")

            expect(Object.keys(resultado[0].toJSON()).includes("email")).to.be.equal(true)
        }
    })

    it("El método create permite crear un producto en la base de datos", async function(){
        let mockProd={
            "title": faker.commerce.product,
            "price": faker.commerce.price,
            "code": faker.number,
            "description": faker.commerce.productDescription,
            "stock": faker.number,
            "_id": faker.number
        }

        let resultado=await mongoose.connection.collection("ecommerce").findOne({email:"farinaceleste@gmail.com"})
        expect(resultado).to.be.null

        resultado=await this.productDAO.create(mockProd)
        expect(resultado.toJSON()).to.haveOwnProperty("_id")
        
        resultado=await mongoose.connection.collection("ecommerce").findOne({email:"farinaceleste@gmail.com"})
        expect(resultado._id).to.be.ok

    })

    it("El método delete permite eliminar un producto de la BD", async function(){

        let mockProd={
            "title": faker.commerce.product,
            "price": faker.commerce.price,
            "code": faker.number,
            "description": faker.commerce.productDescription,
            "stock": faker.number,
            "_id": faker.number
        }

        resultado=await this.productDAO.findOne(mockProd)
        expect(resultado.toJSON()).to.haveOwnProperty("_id")
        let resultado=await this.productDAO.delete(mockProd)
        expect(resultado._id).to.be.ok


    })

    // it("El método save permite grabar un user en DB, y el usuario retorna con una property cart, de tipo array sin datos", async function(){
    //     let mockUser={
    //         first_name:"Juan", last_name:"Lopez", email:"test20240624@test.com", password:"123"
    //     }

    //     let resultado=await this.userDAO.create(mockUser)
    //     expect(resultado).to.be.ok

    // })
})
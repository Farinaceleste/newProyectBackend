import chai from "chai";
import mongoose from 'mongoose';
import supertest from "supertest";
import {expect} from "chai";
import {describe, it} from "mocha";

before(async () => {
    await mongoose.connect('mongodb+srv://farinaceleste:cele6146@cluster0.nwo2jkx.mongodb.net/ecommerce', { useNewUrlParser: true, useUnifiedTopology: true });
});

after(async () => {
    await mongoose.disconnect();
});

const requester=supertest("http://localhost:8080")

describe("Pruebas al service de sessions", function(){
    this.timeout(8000)

    after(async()=>{
        // eliminar elementos creados por la prueba en DB
        await mongoose.connection.collection("pets").deleteMany({specie:"testing"})
    })

    it("La ruta /api/pets con su método POST, permite crear una mascota", async()=>{
        let petMock={name:"Marshall", specie:"testing", birthDate:"2021/10/01"}

        // let resultado=await requester.post("/api/pets").send(petMock)
        // console.log(resultado)
        let {body, status, ok, headers}=await requester.post("/api/pets").send(petMock)

        expect(body.status).to.be.ok
        expect(body.status).to.be.eq("success")
        expect(status).to.be.eq(200)
        expect(status).to.be.oneOf([200, 201])
        expect(body).has.property("payload")
        expect(body.payload).has.property("_id")

    })


    it("La ruta /api/pets con su método POST, si envío una mascota con algún dato faltante, devuelve status code 400", async()=>{
        let petMock={
            // name: "Marshall",
            specie:"testing", 
            birthDate:"2021/10/01"
        }

        // let resultado=await requester.post("/api/pets").send(petMock)
        // console.log(resultado)
        let {status}=await requester.post("/api/pets").send(petMock)

        expect(status).to.be.eq(400)

    })    

    it("prueba cookies",async()=>{
        let{body, headers}=await requester.get("/api/pets")
                                 .send({name:"Juan"})
                                 .set("Cookie","cookieDesdeTestScript=valor cookieDesdeTestScript...!!!; otraCookie=otro valor...!!!")
                                 .set("Authorization","Bearer algo...!!!")

        console.log(body)
        console.log(headers)

        })


})
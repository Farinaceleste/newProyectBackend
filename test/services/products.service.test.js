import chai from "chai";
import mongoose from 'mongoose';
import supertest from "supertest";
import { expect } from "chai"
import { describe, it } from "mocha"
import { usuariosService } from "../../src/services/user.service.js";

before(async () => {
    await mongoose.connect('mongodb+srv://farinaceleste:cele6146@cluster0.nwo2jkx.mongodb.net/ecommerce', { useNewUrlParser: true, useUnifiedTopology: true });
});

after(async () => {
    await mongoose.disconnect();
});

const requester = supertest("http://localhost:8080")

describe("Pruebas al service de products", function () {
    this.timeout(8000)

    after(async () => {
        await mongoose.connection.collection("users").deleteMany({ specie: "testing" })
    })

    describe("El método getUsers permite obtener todos los usuarios guardados en la BD", async () => {
        let userMock = { first_name: "Marshall", last_name: "Connor", rol: "testing", email: "connor@test.com", password: "123" }

        it('should throw an error if no ID is provided', async () => {
            try {
                await usuariosService.getUsers(null);
            } catch (error) {
                expect(error).to.be.an('error');
                expect(error.message).to.equal('ID is required');
            }
        });

    })


    describe("El método getUsersById devuelve un usuario con el id ingresado", async () => {
        let userMock = { first_name: "Marshall", last_name: "Connor", rol: "testing", email: "connor@test.com", password: "123" }

        it('devuelve un error si no se proporciona el id', async () => {
            try {
                await usuariosService.getUserById(null);
            } catch (error) {
                expect(error).to.be.an('error');
                expect(error.message).to.equal('ID is required');
            }
        });

    })

    describe("El método getUserByEmail devuelve un usuario que tenga un email específico", async () => {
        let userMock = { first_name: "Marshall", last_name: "Connor", rol: "testing", email: "connor@test.com", password: "123" }

        it('devuelve un error si no se proporciona el email', async () => {
            try {
                await usuariosService.getUserById(null);
            } catch (error) {
                expect(error).to.be.an('error');
                expect(error.message).to.equal('ID is required');
            }
        });
    })

    describe("El método createUser crea un nuevo usuario", async () => {
        let userMock = { first_name: "Marshall", last_name: "Connor", rol: "testing", email: "connor@test.com", password: "123" }

        it('devuelve un error si no se proporciona el nuevo usuario', async () => {
            try {
                await usuariosService.createUser(null);
            } catch (error) {
                expect(error).to.be.an('error');
                expect(error.message).to.equal('ID is required');
            }
        })
    })

    describe("El método deleteUser elimina un usuario de la BD", async () => {
        let userMock = { first_name: "Marshall", last_name: "Connor", rol: "testing", email: "connor@test.com", password: "123" }

        it('devuelve un error si no se proporciona el id', async () => {
            try {
                await usuariosService.deleteUser(null);
            } catch (error) {
                expect(error).to.be.an('error');
                expect(error.message).to.equal('ID is required');
            }
        });

    })
})
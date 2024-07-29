import chai from "chai";
import mongoose from 'mongoose';
import supertest from "supertest";
import {expect} from "chai"
import {describe, it} from "mocha"

before(async () => {
    await mongoose.connect('mongodb+srv://farinaceleste:cele6146@cluster0.nwo2jkx.mongodb.net/ecommerce', { useNewUrlParser: true, useUnifiedTopology: true });
});

after(async () => {
    await mongoose.disconnect();
});

const requester=supertest("http://localhost:8080")
import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { fakerES_MX as faker } from "@faker-js/faker";
import { productsService } from "../services/product.service.js";
import { cartService } from "../services/cart.service.js";
import passport from "passport";

export const router = Router()

router.get("/", async (req, res) => {

    let user = req.session.user

    let products = await productsService.getProducts()
    res.status(200).render("home", {
        products, user
    })
})

router.get("/profile", async (req, res) => {
    let user = req.session.user

    try {
        if (user) {
            res.status(200).render("profile", { user })
        } else {
            res.status(401).redirect("/login")
        }
    } catch (error) {
        console.error(error)
    }

})

router.get('/mockingproducts', async (req, res) => {

    try {
        const productsFaker = Array.from({ length: 100 }, () => ({ producto: faker.commerce.product() }));
        console.log(productsFaker);
        res.render('mockingproducts', { productsFaker });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor' })
    }
})

router.get('/loggerTest', async (req, res) => {

    req.logger.silly("prueba log level silly")
    req.logger.debug("prueba log level debug")
    req.logger.info("prueba log level info")
    req.logger.warn("prueba log level warn")
    req.logger.error("prueba log level error")

    res.status(200).render('home')
})

router.get("/realtimeproducts", async (req, res) => {
    // , auth(['admin'])
    let products = await productsService.getProducts()

    res.setHeader('Content-Type', 'text/html')
    res.status(200).render("realtimeproducts", {
        products
    })
});

router.get("/chat", auth, async (req, res) => {
    console.log('User DTO:', req.userDTO); 
    res.status(200).render('chat');
});

router.get('/login', async (req, res) => {

    res.setHeader('Content-Type', 'text/html')
    res.status(200).render('login', { login: req.user })

})

router.get('/registro', async (req, res) => {

    let { error, mensaje } = req.query

    res.status(200).render('registro', { error, mensaje, login: req.user })
})

router.get("/checkout", passport.authenticate("current"), async (req, res) => {
    try {
        if (!req.user) {
            return res.redirect("/login");
        }

        let cart = await cartService.getCartByPopulate({ _id: req.user.cart });

        res.render("checkout", { user: req.user, cart });
    } catch (error) {
        console.error(error);
    }
});

router.get("/products", passport.authenticate("current"), async (req, res) => {

    let products = await productsService.getProducts()

    let user = req.user

    res.setHeader("Content-Type", "text/html")
    res.status(200).render("products", {
        products, user
    })

})


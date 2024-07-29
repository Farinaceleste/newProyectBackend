import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { fakerES_MX as faker} from "@faker-js/faker";
import { productsService } from "../services/product.service.js";

export const router = Router()

router.get("/", async (req, res) => {

    let user = req.session.user
        
    let products = await productsService.getProducts()
    res.status(200).render("home", {
        products, user
    })
})

router.get('/mockingproducts', async (req, res) => {

    try {
        const productsFaker = Array.from({ length: 100 }, () => ({producto : faker.commerce.product()}));
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

router.get("/realtimeproducts",async (req, res) => {
// , auth(['admin'])
    let products = await productsService.getProducts()

    res.setHeader('Content-Type', 'text/html')
    res.status(200).render("realtimeproducts", {
        products
    })
});

router.get("/chat", async (req, res) => {

    res.status(200).render('chat')
})

router.get('/login', async (req, res) => {

    res.status(200).render('login', { login: req.session.user })

    // return res.redirect('/perfil');
})

router.get('/registro', async (req, res) => {

    let { error, mensaje } = req.query

    res.status(200).render('registro', { error, mensaje, login: req.session.user })
})

// router.get("/checkout", passportCall("current"), async (req, res) => {

//     let cart = await cartService.getCartByPopulate({_id:req.user.cart})
//     console.log(cart)

//     res.setHeader('Content-Type', 'text/html')
//     res.status(200).render('checkout', {user:req.user.carrito})
// })

router.get("/products", auth(['public']),async (req, res) => {

    let { pagina, limit } = req.query

    if (!pagina) {
        pagina = 1
    }

    if (!limit) {
        limit = 3
    }

    let {
        docs: products,
        totalPages,
        prevPage, nextPage,
        hasPrevPage, hasNextPage

    } = await productsService.getProducts()

    console.log(JSON.stringify(products, null, 5))

    res.setHeader('Content-Type', 'text/html')
    res.status(200).render("products", {
        products,
        totalPages,
        prevPage, nextPage,
        hasNextPage, hasPrevPage
        , login: req.session.user
    })

})


import { Router } from "express";
import { ProductMongoDAO } from "../dao/ProductMongoDAO.js"
import { CartMongoDAO } from "../dao/CartMongoDAO.js";
import { auth } from "../dao/middlewares/auth.js";
import { fakerES_MX as faker} from "@faker-js/faker";
import { logger } from "../utils.js";

export const router = Router()

const productDAO = new ProductMongoDAO
const cartDAO = new CartMongoDAO

router.get("/", async (req, res) => {

    let user = req.session.user
        
    
    let products = await productDAO.getAll()
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

    logger.fatal('Prueba de log FATAL') 
    logger.error('Prueba de log ERROR')
    logger.warning('Prueba de log WARNING')    
    logger.info('Prueba de log INFO')
    logger.http('Prueba de log HTTP')
    logger.debug('Prueba de log DEBUG')

    res.status(200).render('home')
  
})

router.get("/realtimeproducts",async (req, res) => {
// , auth(['admin'])
    let products = await productDAO.getAll()

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
})

router.get('/registro', async (req, res) => {

    let { error, mensaje } = req.query

    res.status(200).render('registro', { error, mensaje, login: req.session.user })
})

router.get('/perfil', auth, async (req, res) => {

    let user = req.session.user

    res.status(200).render('perfil', { user, login: req.session.user })
})

router.get("/checkout", async (req, res) => {

    let { cid } = req.params

    let cart = await cartDAO.getCartBy({ cid })

    res.setHeader('Content-Type', 'text/html')
    res.status(200).render('checkout', { cart, login: req.session.user })
})

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

    } = await productDAO.getAll()

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


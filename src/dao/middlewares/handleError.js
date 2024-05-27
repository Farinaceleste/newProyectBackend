import { ERRORES } from "../../errors/errors.js";

export const handleError = (error, req, res, next) => {
    console.log('*********')
    console.log(`${error.cause ? error.cause : error.stack}`)
    console.log('first')


    switch (error.code) {
        case ERRORES['argumentos inválidos']:
            res.setHeader('Content-Type', 'application-json');
            return res.status(ERRORES['argumentos inválidos']).json({ error: `${error.name}`, detalle: error.message })

        case ERRORES['Not Found']:
            res.setHeader('Content-Type', 'application-json');
            return res.status(ERRORES['Not Found']).json({ error: 'Recurso no encontrado' })

        default:
            res.setHeader('Content-Type', 'application-json');
            return res.status(500).json(
                {
                    error: `Error interno del servidor`,
                    detalle: `${error.message}`
                }
            )
    }
}


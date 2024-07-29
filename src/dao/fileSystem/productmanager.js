import fs from "fs/promises"

export class ProductFs {
    constructor() {
        this.path = path
    }

    async get() {
        try {
            const data = await fs.readFile(this.path, 'utf8')
            return JSON.parse(data)
        } catch (error) {
            if (error.code === 'ENOENT') {
                return []
            } else {
                throw new Error(`Error al leer el archivo: ${error.message}`)
            }
        }
    }

    async save(product) {
        try {
            const jsonData = JSON.stringify(product, null, 2); 
            await fs.writeFile(this.path, jsonData, 'utf8');
        } catch (error) {
            throw new Error(`Error al escribir en el archivo: ${error.message}`);
        }
    }

}
import os from "os"

export function argsProducts (product) {
    let {title, description, code, status, price, stock} = product

    return `Se han detectado uno o mas argumentos inválidos.
    
    Argumentos requeridos: 
    - Title: tipo String. Se ingresó ${title}
    - Description: Tipo String. Se ingresó ${description}
    - Code: Tipo String. Se ingresó ${code}
    - Status: Tipo Boolean. Se ingresó ${status}
    - Price: Tipo Number. Se ingresó ${price}
    - Stock: Tipo Number. Se ingresó ${stock}
    
    
    Fecha: ${new Date().toUTCString()}
    Usuario: ${os.userInfo().username}
    Terminal: ${os.hostname()}
    ` 
    

}
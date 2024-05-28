import os from "os"

export function argsUser (user) {
    let {first_name, last_name, age, email, password} = user

    return `Se han detectado uno o mas argumentos inválidos.
    
    Argumentos requeridos: 
    - First_name: tipo String. Se ingresó ${first_name}
    - Age: Tipo number. Se ingresó ${age}
    - last_name: Tipo String. Se ingresó ${last_name}
    - Email: Tipo String. Se ingresó ${email}
    - password: Tipo String. Se ingresó ${password}
    
    Fecha: ${new Date().toUTCString()}
    Usuario: ${os.userInfo().username}
    Terminal: ${os.hostname()}
    ` 
    

}
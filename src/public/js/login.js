import { auth } from "../../dao/middlewares/auth"

let btnSubmit = document.getElementById("submit")
let inputEmail = document.getElementById("email")
let inputPassword = document.getElementById("password")
let divMensaje = document.getElementById("mensaje")
let linkUsuarios = document.getElementById('linkUsuarios')

btnSubmit.addEventListener('click', async (e) => {
    e.preventDefault()

    let body = {
        email: inputEmail.value,
        password: inputPassword.value
    }

    try {
        let resultado = await fetch("/api/sessions/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })

        let status = resultado.status
        let datos = await resultado.json()
        console.log(datos)
        
        if (status == 200) {
            Swal.fire({
                title: 'Login exitoso',
                confirmButtonText: `Aceptar`,
                icon: 'success',
            }).then((result) => {
                location.href = "/perfil"
            })

        } else {
            Swal.fire({
                title: 'ERROR',
                confirmButtonText: `Aceptar`,
                text: 'Usuario y/o contraseña incorrectos',
                icon: 'error',
            })
        }
    } catch (error) {
        console.error(error)
        Swal.fire({
            title: 'ERROR',
            confirmButtonText: `Aceptar`,
            text: 'Usuario y/o contraseña incorrectos.',
            icon: 'error',
        })
    }
})

linkUsuarios.addEventListener('click', async (e)=>{
    e.preventDefault()

    let respuesta = await fetch ('api/sessions/current', {
        method: 'GET', 
        headers: {
            'Content-Type':'application/json'
        }
    })

    try {
        let info = await respuesta.json ()
        console.log(info)
        user.textContent=JSON.stringify(info)
    } catch (error) {
        console.log(respuesta.status)
    }
})






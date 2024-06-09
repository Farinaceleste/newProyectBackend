
// document.addEventListener('DOMContentLoaded', () => {

//     document.querySelectorAll("button[data-product-id]").forEach(button => {
//         button.addEventListener('click', async event => {
//             const prodId = event.target.getAttribute('data-product-id')

//             try {

//                 const respuesta = await fetch(`http://localhost:8080/api/products/`, {
//                     method: "GET",
//                     headers: {
//                         "Content-Type": "application/json",
//                     },
//                     body: JSON.stringify({ prodId }),
//                 });

//                 console.log({ respuesta })

//                 if (respuesta.ok) {

//                     const responseJson = await respuesta.json()
//                     const cartItemsContainer = document.getElementById("cartItems")

//                     cartItemsContainer.innerHTML = ""

//                     responseJson.cart.products.forEach(product => {
//                         const li = document.createElement("li")
//                         li.textContent = `${product.product.title} - $${product.product.price} - ${product.product.description} - ${product.product.quantity}`
//                         cartItemsContainer.appendChild(li)
//                     })

//                     Swal.fire({
//                         text: 'Producto agregado',
//                         toast: true,
//                         position: "top-right"
//                     })

//                 } else {
//                     throw new Error("Error al agregar el producto")
//                 }

//             } catch (error) {

//                 alert(error.message);
//             }

//         })

//     })
// })

const addToCart = async (pid) => {

    let h3User = document.getElementById('h3User')
    let cid = h3User.dataset.cart
    console.log(pid, cid)

    try {
        let respuesta = await fetch(`/api/carts/${cid}/products/${pid}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!respuesta.ok) {
            throw new Error(`Error: ${respuesta.statusText}`);
        } else {
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Your work has been saved",
                showConfirmButton: false,
                timer: 1500
            });
        }

        let datos = await respuesta.json();
        console.log(datos);
    } catch (error) {
        console.error('Error adding to cart:', error);
    }
}

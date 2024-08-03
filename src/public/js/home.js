const agregar = async (pid) => {
    let h3User = document.getElementById("h3User");
    let cid=h3User.dataset.cart

    console.log('Product ID:', pid);
    console.log('Cart ID:', cid);
    console.log(h3User)

    try {
        let respuesta = await fetch(`/api/carts/${cid}/product/${pid}`, {
            method: "PUT",
            headers: {
                'Content-Type':'application/json'
            }
        });

        if (!respuesta.ok) {
            const text = await respuesta.text();
            console.error('Response text:', text);
            throw new Error('Failed to add product to cart');
        }

        let datos = await respuesta.json();
        console.log(datos);

        if (respuesta.ok) {
            alert("Producto agregado al carrito");
        } else {
            alert(datos.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al agregar el producto al carrito');
    }
};
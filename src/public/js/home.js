const agregar = async (pid) => {
    const h3User = document.getElementById("h3User");
    const cid = h3User.dataset.cart;

    if (!cid) {
        console.error("Cart ID is not set");
        return;
    }

    console.log(`Product ID: ${pid}`);
    console.log(`Cart ID: ${cid}`);
    console.log(h3User);

    try {
        const url = `/api/carts/${cid}/product/${pid}`;
        const response = await fetch(url, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        } 

        const data = await response.json();
        console.log(data);

        alert("Producto agregado al carrito");
    } catch (error) {
        console.error(`Error: ${error}`);
        alert("Error al agregar el producto al carrito");
    }
};

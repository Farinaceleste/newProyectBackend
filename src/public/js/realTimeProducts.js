const socket = io()

socket.on('newProduct', datos => {
  console.log(datos)

  let ulProductos = document.getElementById("ulproducts")
  let li = document.createElement("li")
  li.innerHTML = `${datos.title} - ${datos.price} - ${datos.id} `
  li.setAttribute("id", `producto-${datos.id}`)
  ulProductos.appendChild(li)
})

const agregar = async (event) => {
  event.preventDefault();

  try {
    const product = {
      title: document.getElementById("title").value,
      price: document.getElementById("price").value,
      code: document.getElementById("code").value,
      stock: document.getElementById("stock").value,
      description: document.getElementById("description").value,
    };

    console.log({ product })

    const respuesta = await fetch(`/api/products/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });

    if (!respuesta.ok) {
      throw new Error(errorData.error || "Error al agregar el producto");
    } else {
      console.log("Producto agregado correctamente", respuesta)
      swal.fire({
        title: "Producto agregado correctamente",
        type: "success",
        confirmButtonText: "Ok"
      });
    }
    
  } catch (err) {
    console.error(err)
    alert("Ha ocurrido un error al agregar el producto");
  }
}

socket.on("deleteProduct",  async datos => {
  let ulProductos = document.getElementById("ulproducts")
  let li = document.getElementById(`producto-${datos.id}`)

  if (li) {
    ulProductos.removeChild(li)
  }

})

async function borrar(idProd) {
  
  const url = `http://localhost:8080/api/products/${idProd}`

  try {
    const respuesta = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    let datos=await respuesta.json()
    console.log(datos)

    if (!respuesta.ok) {
      console.log("Error")
    } else {
      console.log("Producto borrado correctamente")
    }

  } catch (err) {
    alert("Ha ocurrido un error al borrar el producto")
  }
 
}



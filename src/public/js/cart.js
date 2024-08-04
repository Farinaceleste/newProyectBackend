const agregar=async(pid)=>{
    
    let h3Usuario=document.getElementById("h3Usuario")
    let cid=h3Usuario.dataset.cart
    console.log(pid, cid)
    
    let respuesta=await fetch(`/api/carts/${cid}/product/${pid}`,{
        method:"put"
    })
    let datos=await respuesta.json()
    console.log(datos)
    if(respuesta.ok){
        alert("Producto agregado al carrito...!!!")
    }else{
        alert(datos.error)
    }
}
async function cargarTiendas() {

    const res = await fetch(
        "http://localhost:3005/gateway/tiendas"
    );

    const data = await res.json();

    let html = `
        <h2>Tiendas</h2>
        <div class="formulario">
            <input
                type="text"
                id="nombreTienda"
                placeholder="Nombre tienda"
            >

            <input
                type="text"
                id="categoriaTienda"
                placeholder="Categoría"
            >

            <button onclick="crearTienda()">
                Crear tienda
            </button>
        </div>

    `;

    data.tiendas.forEach(t => {

        html += `
            <div class="card tienda">
                <h3>${t.nombre}</h3>
                <p>${t.categoria}</p>
                <button onclick="verProductos(${t.id})">
                    Ver productos
                </button>
            </div>
        `;
    });

    document.getElementById(
        "contenido"
    ).innerHTML = html;
}

async function crearTienda() {
    const nombre = document.getElementById(
        "nombreTienda"
    ).value;

    const categoria = document.getElementById(
        "categoriaTienda"
    ).value;

    if (!nombre || !categoria) {
        alert("Completa todos los campos");
        return;
    }

    try {

        const res = await fetch(

            "http://localhost:3005/gateway/tiendas",

            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    nombre,
                    categoria
                })
            }
        );

        const data = await res.json();
        alert(data.mensaje);
        cargarTiendas();

    } catch (err) {
        console.log(err);
        alert("Error creando tienda");
    }
}


async function verProductos(id) {

    const res = await fetch(
        `http://localhost:3005/gateway/productos/${id}`
    );

    const data = await res.json();

    let html = "<h2>Productos</h2><div class='grid'>";
    data.productos.forEach(p => {

        html += `
            <div class="card">
                <h3>${p.nombre}</h3>
                <p>Precio: $${p.precio}</p>
                <p>Stock: ${p.stock}</p>
            </div>
        `;

    });

    html += "</div>";

    html += `

        <button
            class="btn-volver"
            onclick="cargarTiendas()"
        >
            Volver
        </button>

    `;

    document.getElementById(
        "contenido"
    ).innerHTML = html;
}

async function cargarPedidos() {

    const res = await fetch(

        "http://localhost:3005/gateway/pedidos"

    );

    const data = await res.json();
    let html = "<h2>Pedidos</h2>";
    data.pedidos.forEach(p => {

        html += `
            <div class="card pedido">
                <h3>${p.cliente}</h3>
                <p>Producto: ${p.producto}</p>
                <p>Estado: ${p.estado}</p>
            </div>

        `;

    });

    document.getElementById(
        "contenido"
    ).innerHTML = html;
}

async function cargarGPS() {

    const res = await fetch(

        "http://localhost:3005/gateway/gps"

    );

    const data = await res.json();

    let html = "<h2>Conductores</h2>";

    data.gps.forEach(g => {

        html += `
            <div class="card gps">
                <h3>${g.conductor}</h3>
                <p>Ubicación: ${g.ubicacion}</p>
            </div>
        `;
    });

    document.getElementById(
        "contenido"
    ).innerHTML = html;
}

window.cargarTiendas = cargarTiendas;
window.crearTienda = crearTienda;
window.verProductos = verProductos;
window.cargarPedidos = cargarPedidos;
window.cargarGPS = cargarGPS;
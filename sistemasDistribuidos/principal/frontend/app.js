const API = {
    login: "/gateway/login",
    tiendas: "/gateway/tiendas",
    pedidos: "/gateway/pedidos",
    gps: "/gateway/gps"
};

let usuario = null;
let carrito = [];

// LOGIN
async function login() {
    const user = document.getElementById("user").value;
    const pass = document.getElementById("pass").value;

    try {
        const resp = await fetch(API.login, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ user, pass })
        });

        const data = await resp.json();

        if (data.token || data.success) {
            usuario = user;
            document.getElementById("login").style.display = "none";
            document.getElementById("app").style.display = "block";
            cargarTiendas();
        } else {
            alert("Login incorrecto");
        }

    } catch (err) {
        console.error(err);
        alert("Error en login");
    }
}

// CARGAR TIENDAS
async function cargarTiendas() {
    try {
        const resp = await fetch(API.tiendas);
        const tiendas = await resp.json();

        const cont = document.getElementById("tiendas");
        cont.innerHTML = "";

        tiendas.forEach(t => {
            cont.innerHTML += `
                <div class="card">
                    <h3>${t.nombre}</h3>
                    <p>${t.descripcion || ""}</p>
                    <button onclick='verProductos(${JSON.stringify(t)})'>
                        Ver
                    </button>
                </div>
            `;
        });

    } catch (err) {
        console.error(err);
    }
}

// SIMULACIÓN PRODUCTOS
function verProductos(tienda) {
    const cont = document.getElementById("productos");
    cont.innerHTML = "";

    (tienda.productos || []).forEach(p => {
        cont.innerHTML += `
            <div class="card">
                <h4>${p.nombre}</h4>
                <p>$${p.precio}</p>
                <button onclick='agregarCarrito(${JSON.stringify(p)})'>
                    Agregar
                </button>
            </div>
        `;
    });
}

// CARRITO
function agregarCarrito(prod) {
    carrito.push(prod);
    renderCarrito();
}

function renderCarrito() {
    const cont = document.getElementById("carrito");
    cont.innerHTML = "";

    carrito.forEach(p => {
        cont.innerHTML += `<li>${p.nombre} - $${p.precio}</li>`;
    });
}

// GPS
function obtenerUbicacion() {
    navigator.geolocation.getCurrentPosition(async pos => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        document.getElementById("gps").innerText =
            `📍 ${lat}, ${lng}`;

        await fetch(API.gps, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ lat, lng })
        });

    });
}

// PEDIDO
async function hacerPedido() {
    try {
        const resp = await fetch(API.pedidos, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                usuario,
                productos: carrito
            })
        });

        const data = await resp.json();

        alert("Pedido realizado");
        carrito = [];
        renderCarrito();

    } catch (err) {
        console.error(err);
    }
}
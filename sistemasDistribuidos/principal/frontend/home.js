async function pintarCards(lista, titulo) {
    const cont = document.getElementById("contenido");
    cont.innerHTML = `<h2>${titulo}</h2>`;

    if (!lista || lista.length === 0) {
        cont.innerHTML += "<p>No hay datos</p>";
        return;
    }

    lista.forEach(item => {
        const card = document.createElement("div");
        card.style.border = "1px solid #ccc";
        card.style.padding = "10px";
        card.style.margin = "10px";

        card.innerHTML = Object.entries(item)
            .map(([k,v]) => `<b>${k}</b>: ${v}`)
            .join("<br>");

        cont.appendChild(card);
    });
}

async function cargarTiendas() {
    const res = await fetch("http://localhost:3005/gateway/tiendas");
    const data = await res.json();
    pintarCards(data.tiendas, "Tiendas");
}

async function cargarPedidos() {
    const res = await fetch("http://localhost:3005/gateway/pedidos");
    const data = await res.json();
    pintarCards(data.pedidos, "Pedidos");
}

async function cargarGPS() {
    const res = await fetch("http://localhost:3005/gateway/gps");
    const data = await res.json();
    pintarCards(data.gps, "GPS");
}

window.cargarTiendas = cargarTiendas;
window.cargarPedidos = cargarPedidos;
window.cargarGPS = cargarGPS;
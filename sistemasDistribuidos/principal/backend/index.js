const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();

app.use(express.json());

const _frontend = path.join(__dirname, '..', 'frontend');

app.use(express.static(_frontend));

const MS = {
    login: 'http://login:3000/api',
    tiendas: 'http://tiendas:3000/api',
    pedidos: 'http://pedidos:3000/api',
    gps: 'http://gps:3000/api'
};


let fallosPedidos = 0;
let circuitoPedidos = false;
let ultimoFalloPedidos = 0;

let fallosGPS = 0;
let circuitoGPS = false;
let ultimoFalloGPS = 0;

let fallosTiendas = 0;
let circuitoTiendas = false;
let ultimoFalloTiendas = 0;

const MAX_FALLOS = 3;
const TIEMPO_BLOQUEO = 5000;


function circuitoAbierto(circuito, ultimoFallo) {

    if (!circuito) {
        return false;
    }

    const tiempoActual = Date.now();

    // HALF OPEN
    if (tiempoActual - ultimoFallo > TIEMPO_BLOQUEO) {
        console.log("Intentando reconexión...");
        return false;
    }
    return true;
}

app.post('/gateway/login', async (req, res) => {

    try {

        const inicio = Date.now();

        const resp = await axios.post(
            `${MS.login}/login`,
            req.body
        );

        const fin = Date.now();

        console.log(
            `[LOGIN] Tiempo respuesta: ${fin - inicio} ms`
        );

        res.json(resp.data);

    } catch (e) {

        console.log("[LOGIN] Error");
        res.status(500).json({
            error: "Error en Login"
        });
    }
});

app.get('/gateway/tiendas', async (req, res) => {

    if (circuitoAbierto(circuitoTiendas, ultimoFalloTiendas)) {
        console.log("[TIENDAS] Circuito abierto");
        return res.status(503).json({
            error: "Servicio Tiendas bloqueado"
        });
    }

    try {

        const inicio = Date.now();
        const resp = await axios.get(
            `${MS.tiendas}/data`
        );

        const fin = Date.now();

        console.log(
            `[TIENDAS] Tiempo respuesta: ${fin - inicio} ms`
        );

        fallosTiendas = 0;
        circuitoTiendas = false;
        console.log("[TIENDAS] Servicio funcionando");
        res.json(resp.data);

    } catch (e) {

        fallosTiendas++;

        console.log(
            `[TIENDAS] Fallo número ${fallosTiendas}`
        );

        if (fallosTiendas >= MAX_FALLOS) {
            circuitoTiendas = true;
            ultimoFalloTiendas = Date.now();
            console.log("[TIENDAS] Circuito abierto");
        }

        res.status(500).json({
            error: "Error en Tiendas"
        });
    }
});

app.get('/gateway/pedidos', async (req, res) => {

    if (circuitoAbierto(circuitoPedidos, ultimoFalloPedidos)) {
        console.log("[PEDIDOS] Circuito abierto");
        return res.status(503).json({
            error: "Servicio Pedidos bloqueado"
        });
    }

    try {

        const inicio = Date.now();

        const resp = await axios.get(
            `${MS.pedidos}/data`
        );

        const fin = Date.now();

        console.log(
            `[PEDIDOS] Tiempo respuesta: ${fin - inicio} ms`
        );

        fallosPedidos = 0;
        circuitoPedidos = false;
        console.log("[PEDIDOS] Servicio funcionando");
        res.json(resp.data);

    } catch (e) {

        fallosPedidos++;

        console.log(
            `[PEDIDOS] Fallo número ${fallosPedidos}`
        );

        if (fallosPedidos >= MAX_FALLOS) {
            circuitoPedidos = true;
            ultimoFalloPedidos = Date.now();
            console.log("[PEDIDOS] Circuito abierto");
        }

        res.status(500).json({
            error: "Error en Pedidos"
        });
    }
});

app.get('/gateway/gps', async (req, res) => {

    if (circuitoAbierto(circuitoGPS, ultimoFalloGPS)) {
        console.log("[GPS] Circuito abierto");
        return res.status(503).json({
            error: "Servicio GPS bloqueado"
        });
    }

    try {

        const inicio = Date.now();

        const resp = await axios.get(
            `${MS.gps}/data`
        );

        const fin = Date.now();

        console.log(
            `[GPS] Tiempo respuesta: ${fin - inicio} ms`
        );

        fallosGPS = 0;
        circuitoGPS = false;
        console.log("[GPS] Servicio funcionando");
        res.json(resp.data);

    } catch (e) {

        fallosGPS++;

        console.log(
            `[GPS] Fallo número ${fallosGPS}`
        );

        if (fallosGPS >= MAX_FALLOS) {
            circuitoGPS = true;
            ultimoFalloGPS = Date.now();
            console.log("[GPS] Circuito abierto");
        }

        res.status(500).json({
            error: "Error en GPS"
        });
    }
});


app.get('/gateway/productos/:id', async (req, res) => {

    try {

        const inicio = Date.now();
        const resp = await axios.get(
            `http://tiendas:3000/api/productos/${req.params.id}`
        );

        const fin = Date.now();
        console.log(
            `[PRODUCTOS] Tiempo respuesta: ${fin - inicio} ms`
        );

        res.json(resp.data);

    } catch (e) {

        res.status(500).json({
            error: "Error productos"
        });
    }
});

app.post('/gateway/tiendas', async (req, res) => {

    try {
        const resp = await axios.post(
            'http://tiendas:3000/api/insert',
            req.body
        );

        res.json(resp.data);

    } catch (e) {

        res.status(500).json({
            error: "Error creando tienda"
        });
    }
});


app.get('/health', async (req, res) => {

    async function verificarServicio(
        nombre,
        url,
        circuito,
        ultimoFallo,
        fallos
    ) {

        const inicio = Date.now();

        try {

            await axios.get(url);
            const tiempo = Date.now() - inicio;
            return {

                estado: "ok",
                tiempo_respuesta_ms: tiempo,
                circuito: circuito
                    ? "abierto"
                    : "cerrado",
                fallos: fallos,
                tiempo_caido_ms: 0
            };

        } catch (e) {

            const tiempoCaido = circuito
                ? Date.now() - ultimoFallo
                : 0;

            return {

                estado: "down",
                tiempo_respuesta_ms: null,
                circuito: circuito
                    ? "abierto"
                    : "cerrado",
                fallos: fallos,
                tiempo_caido_ms: tiempoCaido
            };
        }
    }

    const login = await verificarServicio(
        "login",
        "http://login:3000/health",
        false,
        0,
        0
    );

    const tiendas = await verificarServicio(
        "tiendas",
        "http://tiendas:3000/health",
        circuitoTiendas,
        ultimoFalloTiendas,
        fallosTiendas
    );

    const pedidos = await verificarServicio(
        "pedidos",
        "http://pedidos:3000/health",
        circuitoPedidos,
        ultimoFalloPedidos,
        fallosPedidos
    );

    const gps = await verificarServicio(
        "gps",
        "http://gps:3000/health",
        circuitoGPS,
        ultimoFalloGPS,
        fallosGPS
    );

    res.json({

        gateway: "ok",
        timestamp: new Date(),
        servicios: {
            login,
            tiendas,
            pedidos,
            gps
        }
    });
});


app.get('/', (req, res) => {

    res.sendFile(
        path.join(_frontend, 'index.html')
    );
});



app.use((req, res) => {

    res.status(404).sendFile(
        path.join(_frontend, 'index.html')
    );
});


app.listen(3000, '0.0.0.0', () => {

    console.log("Gateway corriendo");
});
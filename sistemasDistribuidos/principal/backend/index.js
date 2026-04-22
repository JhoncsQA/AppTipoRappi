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

app.post('/gateway/login', async (req, res) => {
    try {
        const resp = await axios.post(`${MS.login}/login`, req.body);
        res.json(resp.data);
    } catch (e) {
        res.status(500).json({ error: "Error en Login" });
    }
});

app.get('/gateway/productos/:id', async (req, res) => {
    try {
        const resp = await axios.get(
            `http://tiendas:3000/api/productos/${req.params.id}`
        );
        res.json(resp.data);
    } catch (e) {
        res.status(500).json({ error: "Error productos" });
    }
});

app.get('/gateway/tiendas', async (req, res) => {
    try {
        const resp = await axios.get(`${MS.tiendas}/data`);
        res.json(resp.data);
    } catch (e) {
        res.status(500).json({ error: "Error en Tiendas" });
    }
});

app.get('/gateway/pedidos', async (req, res) => {
    try {
        const resp = await axios.get(`${MS.pedidos}/data`);
        res.json(resp.data);
    } catch (e) {
        res.status(500).json({ error: "Error en Pedidos" });
    }
});

app.get('/gateway/gps', async (req, res) => {
    try {
        const resp = await axios.get(`${MS.gps}/data`);
        res.json(resp.data);
    } catch (e) {
        res.status(500).json({ error: "Error en GPS" });
    }
});

app.post('/gateway/tiendas', async (req, res) => {
    try {
        const resp = await axios.post('http://tiendas:3000/api/insert', req.body);
        res.json(resp.data);
    } catch (e) {
        res.status(500).json({ error: "Error creando tienda" });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(_frontend, 'index.html'));
});

app.use((req, res) => {
    res.status(404).sendFile(path.join(_frontend, 'index.html'));
});

app.listen(3000, '0.0.0.0', () => {
    console.log("🚀 Orquestador Principal Estable");
});
// const express = require('express');
// const axios = require('axios');
// const path = require('path');
// const app = express();

// app.use(express.json());

// const frontendPath = path.resolve(__dirname, '..', 'frontend');
// app.use(express.static(frontendPath));
// const SERVICES = {
//     login: 'http://login_container:3000/api/data',
//     gps: 'http://gps_container:3000/api/data',
//     tiendas: 'http://tiendas_container:3000/api/data',
//     pedidos: 'http://pedidos_container:3000/api/data'
// };

// app.get('/api/full-stack', async (req, res) => {
//     try {
//         const fetchService = (url) => axios.get(url, { timeout: 2500 }).catch(() => ({ 
//             data: { status: "Offline", error: true } 
//         }));
        
//         const [auth, geo, shops, orders] = await Promise.all([
//             fetchService(SERVICES.login),
//             fetchService(SERVICES.gps),
//             fetchService(SERVICES.tiendas),
//             fetchService(SERVICES.pedidos)
//         ]);

//         res.json({
//             usuario: auth.data,
//             ubicacion: geo.data,
//             catalogo: shops.data,
//             ordenes: orders.data
//         });
//     } catch (error) {
//         res.status(500).json({ error: "Falla en el orquestador" });
//     }
// });

// app.get('/', (req, res) => {
//     res.sendFile(path.join(frontendPath, 'index.html'));
// });

// app.listen(3000, '0.0.0.0', () => {
//     console.log("🚀 Principal online en puerto 3000");
// });


const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

app.use(express.json());


const _frontend = path.join(__dirname, '..', 'frontend');
app.use(express.static(_frontend));

const MS = {
    login: 'http://login_container:3000/api',
    tiendas: 'http://tiendas_container:3000/api',
    pedidos: 'http://pedidos_container:3000/api'
};


app.post('/gateway/login', async (req, res) => {
    try {
        const resp = await axios.post(`${MS.login}/login`, req.body);
        res.json(resp.data);
    } catch (e) { res.status(500).json({ error: "Error en Login" }); }
});

app.get('/gateway/tiendas', async (req, res) => {
    try {
        const resp = await axios.get(`${MS.tiendas}/all`);
        res.json(resp.data);
    } catch (e) { res.status(500).json({ error: "Error en Tiendas" }); }
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
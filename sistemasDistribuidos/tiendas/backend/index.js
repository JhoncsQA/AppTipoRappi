const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/api/tiendas', (req, res) => {
    const tiendas = [
        { nombre: "Supermercado Central", categoria: "Víveres" },
        { nombre: "Farmacia Salud", categoria: "Medicamentos" },
        { nombre: "Pizzería Nápoles", categoria: "Comida Rápida" }
    ];
    res.json(tiendas);
});

app.listen(3000, () => console.log("Servicio TIENDAS en puerto 3000"));
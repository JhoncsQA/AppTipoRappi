const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/api/pedidos', (req, res) => {
    const listaPedidos = [
        { id: 101, item: "Hamburguesa Doble", estado: "En cocina" },
        { id: 102, item: "Pizza Pepperoni", estado: "Listo para recoger" },
        { id: 103, item: "Malteada de Vainilla", estado: "En camino" }
    ];
    res.json(listaPedidos);
});

app.listen(3000, () => console.log("Servicio PEDIDOS en puerto 3000"));
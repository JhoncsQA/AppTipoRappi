from flask import Flask, request, jsonify
import json
import os
import time
import logging
from datetime import datetime

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("pagos")

app = Flask(__name__)
ARCHIVO = "pagos.json"

MAX_FALLOS = 3
TIEMPO_REINTENTO = 120

cb_estado = {"fallos": 0, "estado": "CERRADO", "ultimo_fallo": 0}

def cb_permite():
    global cb_estado
    if cb_estado["estado"] == "ABIERTO":
        if time.time() - cb_estado["ultimo_fallo"] >= TIEMPO_REINTENTO:
            cb_estado["estado"] = "MEDIO_ABIERTO"
            logger.info("[CB-pagos] Circuito pasa a MEDIO_ABIERTO")
            return True
        return False
    return True

def cb_fallo():
    global cb_estado
    cb_estado["fallos"] += 1
    cb_estado["ultimo_fallo"] = time.time()
    logger.warning("[CB-pagos] Fallo %d/%d", cb_estado["fallos"], MAX_FALLOS)
    if cb_estado["fallos"] >= MAX_FALLOS:
        cb_estado["estado"] = "ABIERTO"
        logger.error("[CB-pagos] Circuito ABIERTO por %ds", TIEMPO_REINTENTO)

def cb_exito():
    global cb_estado
    if cb_estado["estado"] == "MEDIO_ABIERTO":
        cb_estado["estado"] = "CERRADO"
        cb_estado["fallos"] = 0
        logger.info("[CB-pagos] Circuito recuperado, vuelve a CERRADO")
    elif cb_estado["fallos"] > 0:
        cb_estado["fallos"] = 0
        logger.info("[CB-pagos] Contador de fallos reiniciado")

def leer_pagos():
    if not os.path.exists(ARCHIVO):
        return []
    with open(ARCHIVO, "r") as f:
        return json.load(f)

def guardar_pagos(data):
    with open(ARCHIVO, "w") as f:
        json.dump(data, f, indent=2)

@app.route("/pagos", methods=["GET"])
def listar_pagos():
    if not cb_permite():
        logger.warning("[CB-pagos] Peticion GET bloqueada, circuito ABIERTO")
        return {"error": "Pagos no disponible (circuito abierto)"}, 503
    try:
        pagos = leer_pagos()
        cb_exito()
        logger.info("Pagos consultados. Total: %d", len(pagos))
        return jsonify(pagos)
    except Exception as e:
        cb_fallo()
        logger.error("Error al leer pagos: %s", e)
        return {"error": "Error interno del servidor"}, 500

@app.route("/pagos", methods=["POST"])
def procesar_pago():
    if not cb_permite():
        logger.warning("[CB-pagos] Peticion POST bloqueada, circuito ABIERTO")
        return {"error": "Pagos no disponible (circuito abierto)"}, 503
    try:
        data = request.json
        pagos = leer_pagos()
        nuevo = {
            "id": len(pagos) + 1,
            "pedido_id": data["pedido_id"],
            "monto": data["monto"],
            "tarjeta": data["tarjeta"][-4:],
            "estado": "aprobado",
            "procesado": datetime.now().isoformat()
        }
        pagos.append(nuevo)
        guardar_pagos(pagos)
        cb_exito()
        logger.info("Pago procesado: pedido %d, monto $%s, tarjeta ****%s", nuevo["pedido_id"], nuevo["monto"], nuevo["tarjeta"])
        return jsonify(nuevo), 201
    except Exception as e:
        cb_fallo()
        logger.error("Error al procesar pago: %s", e)
        return {"error": "Error interno del servidor"}, 500

@app.route("/health")
def health():
    return jsonify({
        "status": "ok",
        "service": "pagos",
        "circuit_breaker": {
            "estado": cb_estado["estado"],
            "fallos": cb_estado["fallos"]
        }
    })

if __name__ == "__main__":
    logger.info("Servicio de pagos iniciado en puerto 5000")
    app.run(host="0.0.0.0", port=5000)

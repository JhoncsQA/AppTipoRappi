# from flask import Flask, jsonify, request
# import time
# import requests

# app = Flask(__name__)

# fallos_mascotas = 0
# circuito_abierto_mascotas = False
# tiempo_bloqueo_mascotas = 5
# ultimo_fallo_mascotas = 0
# URL_MASCOTAS = "http://backend:5000/mascotas"


# fallos_usuarios = 0
# circuito_abierto_usuarios = False
# tiempo_bloqueo_usuarios = 5
# ultimo_fallo_usuarios = 0
# URL_USUARIOS = "http://usuarios:5000/usuarios"

# @app.route("/mascotas")
# def mascotas():

#     global fallos_mascotas, circuito_abierto_mascotas, ultimo_fallo_mascotas

#     if circuito_abierto_mascotas:

#         tiempo_actual = time.time()

#         if tiempo_actual - ultimo_fallo_mascotas > tiempo_bloqueo_mascotas:
#             print("Estado Half-Open: Intentando reconexión...", flush=True)

#             try:
#                 #inicio = time.time()
#                 #Nuevo intanto para la reconexion
#                 response = requests.get(URL_MASCOTAS, timeout=4)
#                 #fin=time.time()
#                  # Si funciona → cerrar circuito
#                 circuito_abierto_mascotas = False
#                 fallos_mascotas = 0

#                 print("[GATEWAY] Consultando servicio mascotas",flush=True)
#                 #print(f"Tiempo de respuesta: {fin-inicio:.2f}", flush=True)
                
#                 return response.json()
            
#             except Exception as e:
#                 print(e, flush=True)

#                 ultimo_fallo_mascotas = time.time()

#                 print("El servicio sigue fallando. Circuito abierto nuevamente", flush=True)

#                 return {"error": "Servicio temporalmente bloqueado"}, 503
#         else:
#             print("El circuito esta abierto", flush=True)

#             return {"error": "Servicio temporalmente bloqueado"}, 503
    
#     try:
#         response = requests.get(URL_MASCOTAS, timeout=4)
#         fallos_mascotas = 0
#         return response.json()
    
#     except Exception as e:
#         print(e, flush=True)

#         fallos_mascotas += 1
#         print(f"Fallo número {fallos_mascotas}", flush=True)

#         if fallos_mascotas >= 3:
#             circuito_abierto_mascotas = True
#             ultimo_fallo_mascotas = time.time()
#             print("Circuito abierto", flush=True)

#         return {"error": "Servicio no disponible"}, 503


# @app.route("/usuarios")
# def usuarios():
#     global fallos_usuarios, circuito_abierto_usuarios, ultimo_fallo_usuarios
#     if circuito_abierto_usuarios:
#         tiempo_actual = time.time()
#         if tiempo_actual - ultimo_fallo_usuarios > tiempo_bloqueo_usuarios:

#             print("Estado Half-Open: Intentando reconexión a usuarios...", flush=True)
#             try:
#                 response = requests.get(URL_USUARIOS, timeout=2)
#                 circuito_abierto_usuarios = False
#                 fallos_usuarios = 0

#                 print("Servicio recuperado, circuito cerrado", flush=True)

#                 return jsonify(response.json())

#             except Exception as e:
#                 print(e, flush=True)

#                 ultimo_fallo_usuarios = time.time()
#                 print("Sigue fallando, circuito abierto nuevamente", flush=True)
#                 return {"error": "Servicio de usuarios temporalmente bloqueado"}, 503

#         else:
#             print("El circuito está abierto", flush=True)
#             return {"error": "Servicio de usuarios temporalmente bloqueado"}, 503

#     try:
#         response = requests.get(URL_USUARIOS, timeout=2)
#         fallos_usuarios = 0
#         return jsonify(response.json())

#     except:

#         fallos_usuarios += 1
#         print(f"Fallo número {fallos_usuarios} en Usuarios", flush=True)

#         if fallos_usuarios >= 3:
#             circuito_abierto_usuarios = True
#             ultimo_fallo_usuarios = time.time()
#             print("Circuito de usuarios abierto", flush=True)

#         return {"error": "Servicio de usuarios no disponible"}, 503

# @app.route("/resumen")
# def resumen():

#     resultado = {}
#     errores = {}

#     if not circuito_abierto_usuarios:
#         try:
#             usuarios_data = requests.get(URL_USUARIOS, timeout=2).json()
#             resultado["usuarios"] = usuarios_data
#         except:
#             errores["usuarios"] = "No disponible"
#     else:
#         errores["usuarios"] = "Bloqueado"

#     if not circuito_abierto_mascotas:
#         try:
#             mascotas_data = requests.get(URL_MASCOTAS, timeout=4).json()
#             resultado["mascotas"] = mascotas_data.get("mascotas", [])
#         except:
#             errores["mascotas"] = "No disponible"
#     else:
#         errores["mascotas"] = "Bloqueado"

#     if errores:
#         return jsonify({
#             "data": resultado,
#             "errores": errores
#         }), 206  

#     return jsonify(resultado), 200

# @app.route("/estado/backend")
# def estado_backend():
#     try:
#         response = requests.get("http://backend:5000/health", timeout=3)
#         return jsonify(response.json())
#     except:
#         return jsonify({"status": "down"}, 503)

# @app.route("/estado/usuarios")
# def estado_usuarios():
#     try:
#         response = requests.get("http://usuarios:5000/health", timeout=3)
#         return jsonify(response.json())
#     except:
#         return jsonify({"status": "down"}, 503)

# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=5000)




from flask import Flask, jsonify
import time
import requests

app = Flask(__name__)


URL_MASCOTAS = "http://backend:5000/mascotas"

fallos_mascotas = 0
circuito_abierto_mascotas = False
ultimo_fallo_mascotas = 0

MAX_FALLOS = 3
TIEMPO_BLOQUEO = 5


URL_USUARIOS = "http://usuarios:5000/usuarios"

fallos_usuarios = 0
circuito_abierto_usuarios = False
ultimo_fallo_usuarios = 0


def validar_circuito(circuito_abierto, ultimo_fallo):

    # Si el circuito está abierto
    if circuito_abierto:

        tiempo_actual = time.time()

        # Verifica si ya pasó el tiempo de bloqueo
        if tiempo_actual - ultimo_fallo > TIEMPO_BLOQUEO:

            # Estado HALF-OPEN
            return False

        # Sigue abierto
        return True

    return False


@app.route("/mascotas")
def mascotas():

    global fallos_mascotas
    global circuito_abierto_mascotas
    global ultimo_fallo_mascotas


    if validar_circuito(circuito_abierto_mascotas, ultimo_fallo_mascotas):

        print("[MASCOTAS] Circuito abierto", flush=True)

        return jsonify({
            "error": "Servicio mascotas temporalmente bloqueado"
        }), 503

    try:

        inicio = time.time()

        response = requests.get(URL_MASCOTAS, timeout=4)

        fin = time.time()

        tiempo_respuesta = fin - inicio

        print(f"[MASCOTAS] Tiempo respuesta: {tiempo_respuesta:.2f} segundos", flush=True)


        circuito_abierto_mascotas = False
        fallos_mascotas = 0

        print("[MASCOTAS] Servicio funcionando correctamente", flush=True)

        return jsonify(response.json())

    except Exception as e:

        print(f"[ERROR MASCOTAS] {e}", flush=True)

        fallos_mascotas += 1

        print(f"[MASCOTAS] Fallo número {fallos_mascotas}", flush=True)


        if fallos_mascotas >= MAX_FALLOS:

            circuito_abierto_mascotas = True
            ultimo_fallo_mascotas = time.time()

            print("[MASCOTAS] Circuito abierto", flush=True)

        return jsonify({
            "error": "Servicio mascotas no disponible"
        }), 503


@app.route("/usuarios")
def usuarios():

    global fallos_usuarios
    global circuito_abierto_usuarios
    global ultimo_fallo_usuarios

    if validar_circuito(circuito_abierto_usuarios, ultimo_fallo_usuarios):

        print("[USUARIOS] Circuito abierto", flush=True)

        return jsonify({
            "error": "Servicio usuarios temporalmente bloqueado"
        }), 503

    try:

        inicio = time.time()

        response = requests.get(URL_USUARIOS, timeout=4)

        fin = time.time()

        tiempo_respuesta = fin - inicio

        print(f"[USUARIOS] Tiempo respuesta: {tiempo_respuesta:.2f} segundos", flush=True)

        circuito_abierto_usuarios = False
        fallos_usuarios = 0

        print("[USUARIOS] Servicio funcionando correctamente", flush=True)

        return jsonify(response.json())

    except Exception as e:

        print(f"[ERROR USUARIOS] {e}", flush=True)

        fallos_usuarios += 1

        print(f"[USUARIOS] Fallo número {fallos_usuarios}", flush=True)

        if fallos_usuarios >= MAX_FALLOS:

            circuito_abierto_usuarios = True
            ultimo_fallo_usuarios = time.time()

            print("[USUARIOS] Circuito abierto", flush=True)

        return jsonify({
            "error": "Servicio usuarios no disponible"
        }), 503



@app.route("/resumen")
def resumen():

    resultado = {}
    errores = {}


    if not circuito_abierto_usuarios:

        try:

            response = requests.get(URL_USUARIOS, timeout=3)

            resultado["usuarios"] = response.json()

        except:

            errores["usuarios"] = "No disponible"

    else:

        errores["usuarios"] = "Circuito abierto"


    if not circuito_abierto_mascotas:

        try:

            response = requests.get(URL_MASCOTAS, timeout=3)

            resultado["mascotas"] = response.json()

        except:

            errores["mascotas"] = "No disponible"

    else:

        errores["mascotas"] = "Circuito abierto"


    if errores:

        return jsonify({
            "data": resultado,
            "errores": errores
        }), 206

    return jsonify(resultado)


@app.route("/health")
def health():

    estado_mascotas = "down"
    estado_usuarios = "down"


    try:

        response = requests.get("http://backend:5000/health", timeout=2)

        if response.status_code == 200:
            estado_mascotas = "ok"

    except:
        pass


    try:

        response = requests.get("http://usuarios:5000/health", timeout=2)

        if response.status_code == 200:
            estado_usuarios = "ok"

    except:
        pass

    return jsonify({

        "gateway": "ok",

        "servicios": {

            "mascotas": estado_mascotas,
            "usuarios": estado_usuarios

        }

    })


@app.route("/estado/backend")
def estado_backend():

    try:

        response = requests.get("http://backend:5000/health", timeout=3)

        return jsonify(response.json())

    except:

        return jsonify({
            "status": "down"
        }), 503


@app.route("/estado/usuarios")
def estado_usuarios():

    try:

        response = requests.get("http://usuarios:5000/health", timeout=3)

        return jsonify(response.json())

    except:

        return jsonify({
            "status": "down"
        }), 503


if __name__ == "__main__":

    app.run(host="0.0.0.0", port=5000)
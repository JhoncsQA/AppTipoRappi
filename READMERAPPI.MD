# AppTipoRappi - Arquitectura de Microservicios

## 1. Descripción del Sistema

Aplicación tipo **Rappi** orientada al servicio de delivery y e-commerce, construida bajo arquitectura de microservicios.

El sistema está compuesto por 5 microservicios independientes encargados de:

* Autenticación de usuarios
* Gestión de tiendas y productos
* Gestión de pedidos
* Seguimiento GPS de repartidores

El frontend consiste en una SPA (*Single Page Application*) desarrollada en HTML, CSS y JavaScript vanilla con temática visual estilo Rappi.

Todo el sistema se encuentra contenerizado mediante Docker.

---

# 2. Arquitectura

## Patrón Arquitectónico

* API Gateway
* Microservicios
* Database per Service

```txt id="ozw4x0"
                    ┌──────────────┐
                    │   Usuario     │
                    │  (Navegador)  │
                    └──────┬───────┘
                           │ :3005
                    ┌──────▼───────┐
                    │   PRINCIPAL   │
                    │ (API Gateway) │
                    └──┬───┬───┬───┘
                       │   │   │
              ┌────────┘   │   └────────┐
              ▼             ▼            ▼
        ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
        │  LOGIN   │ │ TIENDAS  │ │ PEDIDOS  │ │   GPS    │
        │ :3000    │ │ :3000    │ │ :3000    │ │ :3000    │
        └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘
             │            │            │            │
             ▼            ▼            ▼            ▼
        ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
        │ db-login │ │db-tiendas│ │db-pedidos│ │  db-gps  │
        │  MySQL   │ │  MySQL   │ │  MySQL   │ │  MySQL   │
        └──────────┘ └──────────┘ └──────────┘ └──────────┘
```

## Características de la Arquitectura

* Gateway principal expuesto en el puerto `3005`
* Comunicación interna síncrona mediante HTTP y Axios
* Implementación manual de Circuit Breaker
* Cada servicio posee su propia base de datos MySQL independiente
* Todos los contenedores comparten una red Docker privada

---

# 3. Tecnologías Utilizadas

| Tecnología     | Versión   | Propósito            |
| -------------- | --------- | -------------------- |
| Node.js        | 18        | Runtime              |
| Express.js     | 4.x / 5.x | API REST             |
| MySQL          | 8.0       | Bases de datos       |
| mysql2         | -         | Driver MySQL         |
| axios          | ^1.6.0    | Comunicación HTTP    |
| Docker         | -         | Contenerización      |
| docker-compose | -         | Orquestación         |
| concurrently   | ^8.2.2    | Ejecución simultánea |
| serve          | ^14.2.3   | Frontend estático    |
| cors           | -         | Manejo de CORS       |
| dotenv         | -         | Variables de entorno |

---

# 4. Endpoints

## Gateway (`localhost:3005`)

| Método | Ruta                     | Descripción               |
| ------ | ------------------------ | ------------------------- |
| POST   | `/gateway/login`         | Autenticación de usuarios |
| GET    | `/gateway/tiendas`       | Lista todas las tiendas   |
| GET    | `/gateway/pedidos`       | Lista todos los pedidos   |
| GET    | `/gateway/gps`           | Obtiene datos GPS         |
| GET    | `/gateway/productos/:id` | Productos por tienda      |
| GET    | `/health`                | Health check del gateway  |

---

## Login (`login:3000`)

| Método | Ruta         | Descripción                |
| ------ | ------------ | -------------------------- |
| POST   | `/api/login` | Validación de credenciales |
| GET    | `/health`    | Health check               |

---

## Tiendas (`tiendas:3000`)

| Método | Ruta                 | Descripción          |
| ------ | -------------------- | -------------------- |
| GET    | `/api/data`          | Lista tiendas        |
| GET    | `/api/productos/:id` | Productos por tienda |
| POST   | `/api/insert`        | Crear tienda         |
| GET    | `/health`            | Health check         |

---

## Pedidos (`pedidos:3000`)

| Método | Ruta        | Descripción   |
| ------ | ----------- | ------------- |
| GET    | `/api/data` | Lista pedidos |
| GET    | `/health`   | Health check  |

---

## GPS (`gps:3000`)

| Método | Ruta        | Descripción           |
| ------ | ----------- | --------------------- |
| GET    | `/api/data` | Lista ubicaciones GPS |
| GET    | `/health`   | Health check          |

---

# 5. Instrucciones de Ejecución

## — Docker 

```bash id="1vjlwm"
docker-compose up --build
```

Esto levanta automáticamente:

* 5 microservicios
* 4 bases de datos MySQL
* Red Docker compartida

El gateway queda disponible en:

```txt id="cljiv0"
http://localhost:3005
```

---



## Requisitos Previos

* Tener MySQL ejecutándose localmente
* Crear las siguientes bases de datos:

  * `login_db`
  * `tiendas_db`
  * `pedidos_db`
  * `gps_db`

O utilizar Docker directamente.

---

# 6. Explicación de Servicios

## principal (API Gateway)

Servicio encargado de centralizar y orquestar todas las peticiones entrantes del frontend.

### Funcionalidades

* Punto único de entrada
* Redirección de peticiones
* Exposición de frontend SPA
* Monitoreo básico
* Implementación de Circuit Breaker

### Circuit Breaker

El gateway implementa un mecanismo manual de tolerancia a fallos:

* Máximo de 3 fallos consecutivos
* Apertura del circuito
* Bloqueo de peticiones durante 5 segundos
* Estado Half-Open para reintentos

Esto evita sobrecarga y fallos en cascada cuando un servicio deja de responder.

---

## login (Autenticación)

Microservicio encargado de validar credenciales de usuario.

### Base de datos

* `login_db`

```

### Funcionalidad

* Validación de usuario y contraseña
* Retorno de autenticación exitosa o fallida

---

## tiendas (Catálogo)

Microservicio encargado de la gestión de tiendas y productos.

### Base de datos

* `tiendas_db`

### Funcionalidades

* Listar tiendas
* Consultar productos
* Crear nuevas tiendas

### Endpoints principales

* `/api/data`
* `/api/productos/:id`
* `/api/insert`

---

## pedidos (Órdenes)

Microservicio encargado de la gestión de pedidos.

### Base de datos

* `pedidos_db`

### Funcionalidades

* Consulta de órdenes
* Retorno de pedidos registrados

### Información manejada

* Cliente
* Producto
* Estado del pedido

---

## gps (Geolocalización)

Microservicio encargado del seguimiento de repartidores.

### Base de datos

* `gps_db`



---

# 7. Bases de Datos

Cada microservicio posee una base de datos independiente siguiendo el patrón:

## Database per Service

Esto permite:

* Bajo acoplamiento
* Independencia entre servicios
* Escalabilidad
* Mayor tolerancia a fallos

## Bases de datos utilizadas

* `login_db`
* `tiendas_db`
* `pedidos_db`
* `gps_db`

## Características

* MySQL 8.0
* Instancias aisladas
* Conexión automática con reintentos cada 3 segundos
* Persistencia independiente por servicio

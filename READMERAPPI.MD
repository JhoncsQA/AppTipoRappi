# Sistema Distribuido de Microservicios con Arquitectura de Resiliencia (Circuit Breaker)

Este proyecto consiste en un ecosistema de microservicios desarrollado para la asignatura de Sistemas Distribuidos. Implementa un patrón de **API Gateway** centralizado que actúa como orquestador y aplica mecanismos de tolerancia a fallos (**Circuit Breaker** y **Monitoreo de Latencia**) para garantizar la alta disponibilidad del sistema.

---

## 🚀 Descripción del Sistema

El sistema está diseñado bajo el enfoque de arquitectura orientada a microservicios (SOA). Cada componente resuelve una necesidad de negocio específica (Autenticación, Gestión de Tiendas, Pedidos, GPS y Mascotas), aislando sus datos en bases de datos dedicadas. 

Para evitar el acoplamiento y proteger los servicios de fallos en cascada, el **Gateway Principal** intercepta el tráfico y monitorea la salud de los backends. Si un servicio experimenta latencia o caídas consecutivas, el Gateway abre el circuito de forma autónoma, protegiendo los recursos del servidor y ofreciendo respuestas controladas (degradación graciosa).

---

## 📐 Arquitectura

El sistema utiliza una arquitectura descentralizada coordinada por un API Gateway (Orquestación):

* **Capa de Cliente:** Frontend estático y peticiones HTTP externas.
* **Capa de Puerta de Enlace (Gateway):** Enrutador, balanceador conceptual y controlador de estados del Circuit Breaker (Cerrado, Abierto, Half-Open).
* **Capa de Negocio (Microservicios):** Servicios independientes en Node.js/Express y Python/Flask.
* **Capa de Datos:** Instancias independientes de bases de datos MySQL por servicio para cumplir con el principio de *Database-per-Microservice*.

---

## 🛠️ Tecnologías Utilizadas

* **Backend & Servicios:** Node.js (Express), Python (Flask)
* **Bases de Datos:** MySQL
* **Concurrencia & Despliegue:** Docker, Docker Compose, `concurrently`
* **Monitoreo:** Librería `requests` (Python), medición de Timestamps nativos.

---

## 📂 Explicación de Servicios

El ecosistema se divide en el núcleo del sistema y los laboratorios especializados del Corte 3:

### Núcleo del Sistema (Node.js / Express)
1.  **Gateway Principal (`/principal`):** Orquestador central. Recibe las peticiones del frontend y las redirige a los microservicios internos. Implementa el patrón **Circuit Breaker** para los servicios de Tiendas, Pedidos y GPS bajo las siguientes reglas:
    * Máximo 3 fallos consecutivos antes de abrir el circuito.
    * 5 segundos de bloqueo antes de intentar reconexión (estado *Half-Open*).
    * Registro de logs con tiempos de respuesta y estado del circuito.
2.  **Login:** Gestiona la autenticación de usuarios consultando la base de datos dedicada `login_db`.
3.  **Tiendas:** Gestiona los establecimientos y sus catálogos en la base de datos `tiendas_db`.
4.  **Pedidos:** Administra el histórico de compras del sistema mediante `pedidos_db`.
5.  **GPS:** Simula el seguimiento de ubicación en tiempo real de repartidores en `gps_db`. Adicionalmente, sirve un frontend estático de radar en el puerto `5173` (usando `concurrently` + `serve`).

### Laboratorios y Componentes de Resiliencia (Corte 3 - Python / Flask)
6.  **Corte 3 Gateway:** Gateway independiente enfocado en la gestión manual de estados del Circuit Breaker para los servicios de mascotas y usuarios. Mantiene un estado global en memoria de fallos y marcas de tiempo.
7.  **Corte 3 Backend:** Servicio de gestión de mascotas conectado a MySQL. Implementa un retraso artificial (`time.sleep(3)`) para inyectar latencia y forzar la activación del Circuit Breaker en las pruebas.
8.  **Laboratorio Monitoreo Gateway:** Centralizador de monitoreo para servicios simulados (pedidos, inventario, pagos). Su endpoint de salud consulta los servicios en paralelo y genera reportes de disponibilidad.
9.  **Laboratorio Pedidos / Inventario / Pagos (Mocks):** Servicios ligeros de simulación de stock y procesamiento que exponen endpoints `/health` para validar el comportamiento del monitoreo bajo estrés y latencia controlada.

---

## 🔌 Endpoints Principales

### Gateway & Monitoreo
* `GET /resumen` (Gateway Corte 3): Combina datos de múltiples servicios con manejo de errores parcial (**HTTP 206 Partial Content**).
* `GET /estado` (Gateway Monitoreo): Consulta el estado de salud, código HTTP, tiempo de respuesta y número de caídas de los servicios mock.

### Microservicios del Sistema
* `POST /api/login`: Verifica credenciales de usuario.
* `GET /api/data` (Tiendas): Lista las tiendas disponibles.
* `GET /api/productos/:id`: Obtiene productos de una tienda específica.
* `POST /api/insert`: Registra una nueva tienda en el sistema.
* `GET /api/data` (Pedidos): Lista todos los pedidos del sistema.
* `GET /mascotas`: Obtiene el listado de mascotas (Simula latencia de 3 segundos).

---

## 💻 Instrucciones de Ejecución

Siga estos pasos para desplegar el entorno completo utilizando contenedores Docker:

### 1. Clonar el repositorio
Asegúrese de clonar el repositorio para conservar el historial y estructura de Git:
```bash
git clone <URL_DE_TU_REPOSITORIO>
cd laboratorio_circuit_breaker

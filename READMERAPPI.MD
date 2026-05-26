1. Gateway / Principal (sistemasDistribuidos/principal/)
Orquestador central. Recibe todas las peticiones del frontend y las redirige a los microservicios internos. Implementa Circuit Breaker para Tiendas, Pedidos y GPS con:
- Máximo 3 fallos consecutivos antes de abrir el circuito
- 5 segundos de bloqueo antes de intentar reconexión (half-open)
- Logs de tiempo de respuesta y estado
2. Login
Gestiona autenticación de usuarios. Consulta la tabla usuarios en su base de datos MySQL dedicada (login_db). Endpoint POST /api/login que verifica usuario y contraseña.
3. Tiendas
Gestiona tiendas y sus productos. Endpoints para listar tiendas (GET /api/data), obtener productos por tienda (GET /api/productos/:id) y crear nuevas tiendas (POST /api/insert). Base de datos tiendas_db.
4. Pedidos
Gestiona pedidos del sistema. Consulta la tabla pedidos en pedidos_db. Endpoint GET /api/data para listar todos los pedidos.
5. GPS
Simula seguimiento de ubicación en tiempo real de repartidores. Consulta tabla gps en gps_db. También sirve un frontend estático de radar en http://localhost:5173 (servido con concurrently + serve).
6. Corte 3 Gateway (Python/Flask)
Gateway con Circuit Breaker manual para servicios de mascotas y usuarios. Mantiene estado global de fallos, circuito abierto y timestamp del último fallo. Endpoint /resumen combina datos de ambos servicios con manejo de errores parcial (HTTP 206).
7. Corte 3 Backend (Python/Flask)
Servicio de mascotas con MySQL. Endpoint GET /mascotas con time.sleep(3) para simular latencia (para probar Circuit Breaker). También expone POST para crear mascotas.
8. Laboratorio Monitoreo Gateway (Python/Flask)
Centraliza peticiones y monitorea 3 servicios (pedidos, inventario, pagos). El endpoint /estado consulta el health de todos los servicios en paralelo y reporta disponibilidad, código HTTP, tiempo de respuesta y número de caídas.
9. Laboratorio Pedidos
Servicio mock que devuelve 2 pedidos de ejemplo (Laptop, Mouse). Expone /health y /pedidos.
10. Laboratorio Pagos
Simula procesamiento de pago con time.sleep(3) para probar monitoreo de latencia. Retorna mensaje de confirmación y tiempo de respuesta.
11. Laboratorio Inventario
Servicio mock de stock con 2 productos (Laptop: 5, Mouse: 20). Expone /health y /inventario.

# Laboratorio: Sistema que aprende a fallar

---

## FASE 1 – OBSERVAR (Sin modificar código)

### ¿Qué hace el sistema actualmente?
Al realizar la prueba apagando el servicio de mascotas, notamos que el Gateway intenta comunicarse con el contenedor, pero al no recibir respuesta, lanza una excepción. Actualmente, el sistema detecta que el servicio no responde y nos entrega un mensaje de error tipo JSON indicando que el servicio no está disponible. 

### ¿Se protege o insiste?
El sistema tiene una protección básica inicial, pero tras las modificaciones, ahora se protege activamente. En lugar de insistir infinitamente y dejar la petición cargando (haciendo que el usuario espere), el sistema cuenta los errores. Después de 3 intentos fallidos, el Gateway "se cansa" de insistir y bloquea la ruta para no saturar la red ni desperdiciar recursos.

---

## FASE 2 – APLICAR (Extensión del Circuit Breaker)

### ¿Cada servicio debe tener su propio contador de fallos?
**Sí.** Decidimos que cada servicio debe ser independiente. Si el servicio de mascotas falla, el contador de usuarios debe empezar en cero. No sería justo que los fallos de un microservicio afecten la disponibilidad del otro. Por eso, en el código creamos variables específicas (`fallos_usuarios` y `fallos_mascotas`) para rastrear cada uno por su cuenta.

### ¿El circuito debe abrirse de forma independiente por servicio?
**Sí.** Siguiendo la lógica de microservicios, el Circuit Breaker debe actuar por separado. Si el circuito de mascotas está "abierto" (bloqueado), el de usuarios puede estar "cerrado" (funcionando normal). Esto permite que el sistema sea resiliente y no se caiga todo por culpa de una sola pieza.

### ¿Qué pasa si falla un servicio pero el otro sigue funcionando?
El sistema sigue operativo parcialmente (Degradación controlada). En el endpoint de `/resumen`, logramos que si un servicio falla, el Gateway nos devuelva los datos del que sí sirve y nos avise con un mensaje de "Bloqueado" o "No disponible" para el que falló. Así el usuario no ve una página de error total, sino que puede seguir usando lo que sí funciona.

---

## FASE 3 – INVESTIGAR (Half-Open)

### ¿Qué significa “half-open”?
Es el estado de "prueba". Cuando el circuito está abierto (bloqueado), el sistema espera un tiempo y luego pasa a **Half-Open**. En este estado, el Gateway deja pasar una única petición de prueba para ver si el microservicio ya revivió. Es como asomarse a ver si ya es seguro pasar.

### ¿Cuándo se vuelve a intentar una llamada?
La llamada de prueba se intenta automáticamente después de que se cumple un **tiempo de bloqueo** (en nuestro código lo pusimos de 10 segundos). Si alguien intenta entrar después de ese tiempo, el sistema hace el intento de reconexión.

### ¿Qué pasa si el servicio vuelve a fallar?
Si en el estado de prueba (Half-Open) la llamada vuelve a fallar, el circuito se abre inmediatamente otra vez y se reinicia el tiempo de espera. El sistema asume que el servicio sigue inestable y vuelve a protegerse.

---

## ANÁLISIS FINAL

### ¿Qué cambió en el comportamiento del sistema?
El cambio más grande es que ahora el sistema es "consciente" de los errores. Antes, si algo fallaba, el sistema simplemente daba error cada vez. Ahora, el sistema toma decisiones: decide cuándo dejar de intentar, cuándo bloquear y cuándo intentar recuperarse solo sin que nosotros tengamos que reiniciar nada.

### ¿Qué decisiones tomaron en la implementación?
1.  **Independencia:** Cada ruta (`/usuarios`, `/mascotas`) tiene su propia lógica de protección.
2.  **Umbrales:** Elegimos 3 fallos como límite porque es un balance justo para detectar un problema real sin ser demasiado sensibles.
3.  **Timeouts:** Pusimos límites de tiempo cortos en las peticiones para que el Gateway reaccione rápido si un servicio está lento.

### ¿Qué dificultades encontraron?
Lo más complicado fue manejar los estados globales en Flask para que los contadores no se resetearan de forma extraña. También tuvimos algunos problemas de conexión con Docker porque a veces los contenedores tardan más en subir de lo que el Gateway tarda en pedir los datos, lo que disparaba el Circuit Breaker antes de tiempo. Aprendimos que configurar bien los tiempos de espera es clave en estos sistemas.

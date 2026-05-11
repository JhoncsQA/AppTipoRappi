Entiendo perfectamente lo que pasa. El problema es que Markdown (el lenguaje que usa GitHub y los archivos .md) es muy sensible a los espacios y a los saltos de línea. Si todo queda pegado, el navegador no entiende qué es un título y qué es un párrafo.

Aquí tienes el contenido formateado correctamente. He añadido separadores --- y espacios adicionales para que, al pegarlo, se vea limpio, con los títulos grandes y las listas bien organizadas.

Copia desde aquí abajo:

Fase 1 – Observar y Analizar
¿Qué hace el sistema actualmente?
La arquitectura se basa en un API Gateway centralizado que actúa como el único punto de entrada para las solicitudes del cliente. Su función principal es el enrutamiento inteligente hacia los microservicios de backend.

Gestión de flujo positivo: Cuando los servicios están operativos, el Gateway actúa como un puente transparente, entregando la data procesada al usuario.

Gestión de excepciones: En presencia de latencia, caídas de servidor o errores de red, el sistema interviene. En lugar de permitir que el error colapse la experiencia del usuario, el Gateway registra la incidencia, actualiza sus contadores internos de fallos y responde con un código HTTP 503, manteniendo la integridad de la comunicación.

¿Se protege o insiste?
El diseño del sistema prioriza la autoprotección sobre la insistencia ciega. Aunque inicialmente intenta establecer el enlace, implementa una política de "punto de ruptura".

Al acumularse 3 fallos consecutivos, se ejecutan las siguientes acciones de seguridad:

Activación del Disyuntor: El estado del componente cambia a OPEN (circuito_abierto = True).

Cese de peticiones: El Gateway bloquea de inmediato cualquier intento de conexión futuro hacia ese nodo específico.

Esta estrategia es vital para prevenir la saturación de recursos y evitar que un fallo local se convierta en una caída total del sistema (fallos en cascada).

Fase 2 - Preguntas de Análisis y Decisiones
¿Cada servicio debe tener su propio contador de fallos?
Definitivamente. En una arquitectura de microservicios, la autonomía es clave. Cada unidad (Mascotas, Usuarios, etc.) opera de forma aislada, por lo que el Gateway debe monitorearlos de manera individual.

Implementamos rastreadores separados como:

fallos_mascotas

fallos_usuarios

Tener métricas independientes permite que, si un servicio entra en crisis, el resto de la plataforma siga prestando soporte al usuario sin interrupciones innecesarias.

¿El circuito debe abrirse de forma independiente por servicio?
Sí. La independencia de los circuitos es lo que garantiza la resiliencia parcial del sistema.

Si el parámetro circuito_abierto_usuarios se activa, el Gateway detiene el tráfico hacia el microservicio de Usuarios, pero mantiene las rutas de Mascotas totalmente funcionales. Esto aísla el error y evita que un problema de base de datos en un módulo inhabilite todo el ecosistema de la aplicación.

¿Qué pasa si falla un servicio pero el otro sigue funcionando?
El Gateway entra en un modo de Degradación Controlada. En lugar de fallar por completo, el sistema entrega una respuesta híbrida.

El flujo es el siguiente:

Se recolecta la información de los servicios estables.

Se marca técnicamente el servicio inaccesible dentro de un objeto de errores.

Se devuelve un paquete de datos útil al cliente, notificando qué partes del sistema están "Bloqueadas".

Esto asegura que la aplicación siga siendo útil para el usuario final a pesar de las fallas internas.

Fase 3 – Investigar (Half-Open)
El estado Half-Open representa la fase de diagnóstico y recuperación del Circuit Breaker. Una vez que el sistema ha permanecido bloqueado por seguridad, necesita una forma de verificar si el peligro ha pasado sin exponerse a un colapso.

Lógica de prueba: El sistema permite el paso de una única solicitud de sondeo.

Evaluación: Si la respuesta es exitosa (HTTP 200), el circuito se cierra y el tráfico se normaliza. Si la conexión sigue fallando, se reactiva el bloqueo total de inmediato.

¿Cuándo se vuelve a intentar una llamada?
La reactivación no es inmediata ni aleatoria; depende de una ventana de enfriamiento definida por la lógica de negocio.

En nuestro caso, hemos configurado un intervalo de seguridad:

tiempo_bloqueo_usuarios = 10 (segundos).

Cuando el reloj del sistema detecta que el tiempo desde el último fallo ha superado este umbral, el Gateway cambia automáticamente a un modo de "reconexión tentativa" para validar la salud del microservicio.

¿Qué pasa si el servicio vuelve a fallar?
Si un microservicio falla durante el intento en estado Half-Open, el sistema actúa con rigor:

Se aborta la transición a estado cerrado.

El circuito regresa instantáneamente a la posición OPEN.

Se reinicia el temporizador de bloqueo.

Esto previene que servicios inestables o intermitentes degraden el rendimiento general del Gateway, manteniendo el escudo de protección activo hasta que la estabilidad sea absoluta.

Análisis Final
La integración de esta lógica de Circuit Breaker ha transformado la robustez de la aplicación:

Autonomía técnica: El sistema diagnostica y se auto-repara sin intervención externa.

Protección de recursos: Se eliminan las esperas innecesarias por timeouts en servicios caídos.

Transparencia: El usuario recibe respuestas claras en milisegundos, incluso ante fallas críticas de backend.

¿Qué decisiones tomaron en la implementación?
Para maximizar la estabilidad, optamos por:

Segregación de Disyuntores: Controles únicos para Usuarios y Mascotas.

Umbral de Tolerancia: Límite estricto de 3 incidencias antes del bloqueo.

Recuperación Autónoma: Implementación de la lógica Half-Open para reintentos inteligentes.

Seguridad de Conexión: Tiempos de espera (timeouts) configurados en cada petición HTTP para evitar procesos colgados.

¿Qué dificultades encontraron?
Durante el desarrollo, los retos principales fueron la orquestación de red en Docker para asegurar la visibilidad entre contenedores y la calibración del estado Half-Open, ya que un tiempo de bloqueo muy corto podría generar inestabilidad. Además, fue fundamental diferenciar correctamente los errores de código interno de los errores de conexión de red para que el contador de fallos fuera preciso.

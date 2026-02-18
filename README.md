# Arquitectura del Sistema: AppTipoRappi

Aplicación tipo **Rappi** para la **gestión de domicilios**, orientada a facilitar el proceso de pedidos, asignación de repartidores y seguimiento de entregas en tiempo real.


App Tipo Rappi

Integrantes:

Samir Ausecha - Encargado de documentación
Anderson Avendaño - Encargado tecnico
Nasly de los rios - Encargado de la presentación
Jhon Cabezas - Lider del proyecto

Link Git:
https://github.com/JhoncsQA/AppTipoRappi.git

## Problema que resuelve

ENTENDER EL PROBLEMA

1. ¿Qué problema resuelve el sistema?
  El aplicativo nos ayuda a realizar domicilios de manera facil, efectiva y de manera autonoma por medio del telefono movil
  sin depender de usuario intermedios que nos tomen la orden o nos limiten en al menu siendo poco claros con el pedido

2. ¿Quién lo usará?

  personas adultas y jovenes que requieran realizar un pedido pr medio de un App en un rango de edad entre 15 años a 50 años

3. ¿Qué pasaría si no existiera?

  Se realizarian domicilios de manera tradicional por llamada o mensajes de texto o whatsapp, pero limitaria mucho la experiencia del usuario
  el conocimeinto completo del menu y generaria problemas de tiempo y errores de entendimeinto al realizar o tomar una orden

## Servicios del sistema

IDENTIFICAR LOS SERVICIOS

¿Qué funciones principales tiene el sistema?

*Gestión de usuarios

  -Registro e inicio de sesión.

  -Administración de perfiles (cliente, restaurante, domiciliario, administrador).

*Gestión de restaurantes/comercios

  -Registro de establecimientos.

  -Administración de menú.

  -Actualización de precios y disponibilidad.

*Gestión de pedidos

  -Creación de pedidos.

  -Confirmación del pedido.

  -Cálculo de totales y costos de envío.

  -Cambio de estado del pedido (pendiente, en preparación, en camino, entregado).

*Asignación de repartidores

  -Asignación automática o manual.

  -Visualización de pedidos disponibles.

  -Confirmación de entrega.

*Seguimiento en tiempo real

  -Ubicación del repartidor.

  -Actualización del estado del pedido.

*Gestión de pagos

  -Procesamiento de pagos digitales.

  -Confirmación de transacciones.
  
¿Qué partes pueden trabajar por separado?

*Servicio de Autenticación

  Maneja usuarios y seguridad. Puede operar sin depender directamente del servicio de pedidos.

*Servicio de Menu

  Gestiona productos y restaurantes. Puede funcionar aunque no haya pedidos activos.

*Servicio de Pedidos

  Administra la lógica principal de creación y seguimiento de órdenes.

*Servicio de Domiciliarios

  Controla disponibilidad, ubicación y asignación.

*Servicio de Pagos

  Procesa transacciones de manera independiente del resto del sistema.

*Servicio de Notificaciones

  Envía notificaciones push o mensajes al usuario cuando cambia el estado del pedido.

  Cada uno puede estar alojado en servidores distintos y comunicarse mediante APIs o eventos.

¿Qué procesos son independientes?
  *Registro e inicio de sesión de usuarios.

  *Actualización del menú por parte del restaurante.

  *Procesamiento de pagos.

  *Seguimiento GPS del repartidor.

  *Envío de notificaciones.

  *Generación de reportes administrativos.

##Comunicacion entre Servicios

¿Qué servicio necesita información de otro?
  *Servicio de Pedidos

    Necesita información de:
    
    Servicio de Usuarios (datos del cliente)
    
    Servicio de Catálogo (productos y precios)
    
    Servicio de Pagos (confirmación del pago)
    
    Servicio de Repartidores (asignación y disponibilidad)

  *Servicio de Repartidores

    Necesita información de:
    
    Servicio de Pedidos (detalle del pedido)
    
    Servicio de Usuarios (dirección del cliente)

  *Servicio de Pagos

    Necesita información de:
    
    Servicio de Pedidos (monto total)
    
    Servicio de Usuarios (datos del cliente)

  *Servicio de Notificaciones

    Necesita información de:
    
    Servicio de Pedidos (cambio de estado)
    
    Servicio de Repartidores (estado de entrega)

¿Quién solicita datos?

-El Servicio de Pedidos solicita:

  Datos del usuario al Servicio de Usuarios.
  
  Información de productos al Servicio de Catálogo.
  
  Confirmación de pago al Servicio de Pagos.

-El Servicio de Repartidores solicita:

  Detalles del pedido al Servicio de Pedidos.

-El Servicio de Notificaciones solicita:

  Información del estado del pedido al Servicio de Pedidos.

¿Quién responde?

-El Servicio de Usuarios responde con:

  Nombre, dirección y datos del cliente.

-El Servicio de Catálogo responde con:

  Productos, precios y disponibilidad.

-El Servicio de Pagos responde con:

  Confirmación o rechazo de la transacción.

-El Servicio de Repartidores responde con:

  Estado de disponibilidad y ubicación.

Pedidos → solicita → Usuarios
Pedidos → solicita → Catálogo
Pedidos → solicita → Pagos
Pedidos → solicita → Repartidores

Pagos → confirma → Pedidos

Repartidores → solicita → Pedidos
Repartidores → actualiza estado → Pedidos

Notificaciones → solicita → Pedidos
Notificaciones → notifica → Usuario

Restaurantes → actualiza → Catálogo

Administrador → consulta → Reportes
Reportes → obtiene datos → Pedidos

##Tipo de Arquitectura

La arquitectura que se manejara para esta aplicacion seria Basada en Microservicios

¿Cuántos usuarios tendrá el sistema?

  El sistema está pensado para atender una gran cantidad de usuarios simultáneos, incluyendo:
  
  Clientes que realizan pedidos.
  
  Restaurantes que gestionan menús.
  
  Repartidores activos.
  
  Administradores del sistema.

  Inicalmente unos 1000 usuarios con posibilidad de crecimiento, en un escenario real, podría escalar dependiendo la demanda del negocio o la app

¿Necesita escalar?

  Si ya que en horas pico o al demandar mas trafico de usuarios se requiere un incremento en la capacidad de los servidores

¿Es un sistema pequeño o grande?

  Es un sistema que inicialmete es pequeño pero a medida que el negocio crezca se debe ir incrementando su capacidad o funcionalidades nuevas segun requiera, esta arquitectura nos ayuda a futuro
  poder generar mejoras sin afectar los modulos o servicios previamente implementados

##Base de Datos

¿Qué información debe guardarse?

-Datos de usuarios

  Nombre completo
  
  Correo electrónico
  
  Número de teléfono
  
  Dirección de entrega
  
  Contraseña cifrada
  
  Historial de pedidos

-Datos de restaurantes

  Nombre del establecimiento
  
  Dirección
  
  Menú (productos, precios, disponibilidad)
  
  Horarios de atención

-Datos de pedidos

  ID del pedido
  
  Cliente que realizó el pedido
  
  Productos seleccionados
  
  Total a pagar
  
  Estado del pedido (pendiente, en preparación, en camino, entregado)
  
  Fecha y hora

-Datos de repartidores

  Nombre
  
  Número de contacto
  
  Estado (disponible/no disponible)
  
  Ubicación en tiempo real
  
  Historial de entregas

-Datos de pagos

  ID de transacción
  
  Método de pago
  
  Estado del pago (aprobado/pndiente/rechazado)
  
  Fecha y monto

¿Todos los servicios usan la misma base de datos o cada uno tiene la suya?

  Cada Servicio tiene su propia base de datos ya que a pesar de que trabajan para un fin comun o un resultado, todas deben manejar una Base de Datos
  Independiente ya que esto nos permite una autonomia entre servicios pero se debe garantizar la sincronización entre los mismos

##Usuarios del Sistema

¿Quién usará el sistema?

  Usuario
  Restaurante
  Domiciliario
  Administrador
  
¿Todos pueden hacer lo mismo?

No, cada usuario tiene roles y permisos diferentes dentro del sistema.

El sistema debe implementar:

  -Control de acceso por roles.
  
  -Permisos específicos según el tipo de usuario.
  
  -Restricciones para evitar acciones no autorizadas.

Por ejemplo:

  -Un cliente no puede modificar el menú.
  
  -Un repartidor no puede acceder a reportes administrativos.
  
  -Un restaurante no puede gestionar otros restaurantes.
  
  -Solo el administrador tiene control total del sistema.

##Riesgos y fallas posibles

¿Qué pasaría si falla el servicio de pagos?

-Posibles consecuencias:

  No se pueden procesar pagos.
  
  Pedidos quedan en estado pendiente.
  
  Usuarios abandonan la compra.
  
  Pérdida de ingresos.
  
  Desconfianza en la plataforma.

*Posibles soluciones:

  Reintentos automáticos de la transacción.
  
  Guardar el pedido como “pendiente de pago”.
  
  Notificación al usuario indicando el problema.
  
  Integración con un segundo proveedor de pagos (servicio alternativo).
  
  Registro de errores para auditoría.


¿Qué pasaría si falla la base de datos?

-Posibles consecuencias:

  No se pueden consultar usuarios ni pedidos.
  
  Se pierde acceso a información crítica.
  
  Interrupción total del servicio.
  
  Riesgo de pérdida de datos.

*Posibles soluciones:

  Respaldo de base de datos.
  
  Base de datos en alta disponibilidad (cluster).
    
  Alertas automáticas al equipo técnico.


¿Qué pasaría si falla el servidor principal?

-Posibles consecuencias:

  La aplicación deja de funcionar.
  
  Usuarios no pueden ingresar.
  
  Pedidos activos se interrumpen.
  
  Pérdida temporal del servicio.

*Posibles soluciones:

  Infraestructura en la nube con balanceador de carga.
  
  Arquitectura de microservicios.
  
  Monitoreo constante del sistema.

# CRUDReact
Lenguaje Java IDE Eclipse. Servidor Tomcat.  Framework javascript: React. JEE 6 (persistencia y servicios) Base de datos: Postgres 

Mirar rama master

FLUJO DE EVENTOS:
Básico
1. El usuario selecciona la opción del menú denominada “Usuarios del Sistema”.
2. Se debe desplegar una pantalla que tenga una tabla con la información de usuarios activos
y las siguientes opciones
◦ Nuevo, para crear nuevos usuarios
◦ Editar para modificar la información de usuario
◦ Filtro para hacer búsqueda de suscriptores
◦ eliminar, para eliminar a un usuario
3. El sistema muestra una tabla con las siguientes columnas:
◦ Nombre
◦ Apellido
◦ Nacionalidad
◦ Tipo de documento
◦ Numero Documento Identidad
◦ email
◦ Teléfono
◦ Observaciones
◦ Fecha
◦ estado
4. El Caso de uso termina.
3
Alternos
1. Filtrar información:
1. El usuario pulsa sobre el botón filtrar
2. El sistema despliega una ventana popup en la que se puede filtrar por
▪ Numero Documento Identidad, Nombre y Apellido
3. El usuario ingresa uno o todos los datos
4. El usuario pulsa sobre el botón buscar
5. El sistema refresca la tabla con los registros que cumplen con el criterio de búsqueda.
2. Crear Registro:
1. El usuario pulsa sobre el botón nuevo
2. El sistema muestra una nueva interfaz de tipo formulario donde se visualizan los
campos siguientes:
◦ Nombre
◦ Apellido
◦ Nacionalidad
◦ Tipo de documento
◦ Numero Documento Identidad
◦ email
◦ Teléfono
◦ Observaciones
◦ Fecha
◦ estado
3. El usuario ingresa la información solicitada.
4. El usuario pulsa sobre el boton guardar.
5. El sistema valida que se haya ingresado información para los campos Nombre,
apellido, tipo de documento, email, la fecha debe ser la fecha del sistema, en caso de
que no se haya ingresado información sobre alguno de esos campos, se debe mostrar
un mensaje informativo solicitando la inserción, del o los campos faltantes.
6. El sistema muestra un mensaje informativo con el resultado de la operación y retorna a
la tabla.
7. el campo activo se pone por defecto como activo
3. Modificar Registro:
1. El usuario pulsa sobre alguno de los registros de la tabla.
2. El sistema muestra una nueva interfaz de tipo formulario donde se visualizan los
campos siguientes, precargados con la información del registro seleccionado:
◦ Nombre
◦ Apellido
◦ Nacionalidad
◦ Tipo de documento
◦ Numero Documento Identidad
◦ email
◦ Teléfono
◦ Observaciones
◦ Fecha
3. los campos fecha y estado no son modificables
4. El usuario pulsa sobre el boton guardar.
5. El sistema valida que se haya ingresado información para los campos Nombre,
apellido, tipo de documento, email,, la fecha debe ser la fecha del sistema, en caso de
que no se haya ingresado información sobre alguno de esos campos, se debe mostrar
un mensaje informativo solicitando la inserción, del o los campos faltantes.
4
6. El sistema muestra un mensaje informativo con el resultado de la operación y retorna a
la tabla.
4. Eliminar Registro:
1. El usuario selecciona el registro a eliminar.
2. El usuario pulsa sobre el botón borrar registro.
3. El sistema despliega una ventana de confirmación de la operación.
4. Si el usuario decide borrar el registro respondiendo afirmativamente a la pregunta de
confirmación el sistema desactiva el registro y despliega un mensaje informativo sobre
el proceso.
Validaciones
1. Los campos Nacionalidad, tipo de documento son combos de selección, con las
opciones
2. Nacionalidad: Colombiano y tres mas.
3. Tipo documento: Cedula de ciudadanía, cedula de extranjería, pasaporte
4. Nacionalidad colombiana, solo de debe mostrar tipo de documento cédula de
ciudadanía
5. Otra Nacionalidad solo debe mostrar: cedula de extrajeria y pasaporte
6. El numero de documento debe ser único
7. El campo email debe corresponder a una dirección de correo electrónico valida
(xxx@xxx.xxx), en caso contrario, el sistema debe solicitar el ingreso de una cuenta
valida

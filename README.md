# CuriWatch

Práctica educativa en React Native y JavaScript con Expo SDK 57. Simula un reloj circular dentro de una aplicación para teléfonos Android; no es un sistema operativo ni una aplicación para Wear OS.

## Instalar y ejecutar

Requisitos: Node.js 22.13 o superior dentro de una rama compatible (22 o 24 LTS), npm y Expo Go actualizado compatible con SDK 57 en el teléfono.

```bash
npm install
npx expo start
```

Conecta teléfono y computadora a la misma red y escanea el QR desde Expo Go. Si la red impide la conexión, prueba `npx expo start --tunnel`. En PowerShell, si la política bloquea los scripts de npm, usa `npm.cmd install` y `npx.cmd expo start`.

También puedes ejecutar `npm run web` para explorar la interfaz en el navegador. Para comprobar las versiones: `npx expo install --check` y `npx expo-doctor`. Las dependencias nativas están alineadas con `expo/bundledNativeModules.json`; al actualizar Expo, utiliza `npx expo install --fix`.

### Error: Project is incompatible with this version of Expo Go

Este proyecto fue adaptado a Expo SDK 57 para el Expo Go 57.0.9 del teléfono de prueba. Si tenías Metro abierto con la versión anterior del proyecto (SDK 58), ciérralo y ejecuta `npx.cmd expo start --clear` antes de escanear el nuevo QR. La validación en el teléfono sigue pendiente.

1. Comprueba que Expo Go admite SDK 57 y cierra la aplicación por completo.
2. Si Google Play no ofrece una versión compatible, visita https://expo.dev/go desde Android, selecciona SDK 57 y Android e instala la versión oficial correspondiente.
3. Detén Metro con Ctrl+C y ejecuta `npx.cmd expo start --clear`; abre Expo Go y escanea el nuevo QR.

Si persiste, comprueba la versión de Expo Go en su pantalla de información y el SDK que admite. Para adaptar el proyecto a un SDK anterior hace falta conocer ese número y alinear todas las dependencias nativas; cambiar solo `sdkVersion` en `app.json` no resuelve la incompatibilidad.

## Uso

- Arrastra el panal en cualquier dirección y toca un icono para abrir su aplicación. Hay veintiséis destinos en el panal; algunos están en los extremos superior e inferior. La pantalla principal mantiene únicamente el reloj y la marca superior, sin textos ni controles debajo.
- La distancia al centro determina la escala de los iconos. Los gestos y la escala se calculan en el hilo de interfaz mediante Gesture Handler y Reanimated.
- Reloj muestra la hora local y fecha, con actualización cada segundo. En Configuración → Relojes elige Digital, Analógico o Minimalista y formato 12/24 h. Ver reloj abre la esfera seleccionada. El analógico incluye manecillas de hora, minuto y segundo; el minimalista muestra tu nombre y meta si los completaste en Mi perfil.
- Cronómetro permite iniciar, pausar y reiniciar. Calcula tiempo a partir de marcas temporales, no sumando intervalos; continúa al volver al menú mientras la aplicación sigue abierta.
- Actividad actualiza valores deterministas de ejemplo cada tres segundos. No solicita permisos ni lee sensores.
- Calculadora permite sumar, restar, multiplicar y dividir, con decimales y botón C. Las operaciones encadenadas se calculan de izquierda a derecha. Dividir entre cero muestra Error.
- Temporizador ofrece 10 segundos, 1 minuto y 3 minutos; permite pausar y reiniciar. Continúa por marca temporal al volver al menú y muestra «¡Tiempo terminado!» al abrirlo después de vencer. No genera notificaciones ni alarmas en segundo plano. Elegir otra duración reinicia la cuenta.
- Memoria es un juego de tres parejas: toca dos cartas, recuerda los símbolos y encuentra todas las parejas. Cuenta los intentos y ofrece Nueva partida. Salir del juego inicia una nueva partida al volver.
- Calendario permite navegar por meses, resalta el día actual y ofrece Ir a hoy. No crea eventos ni necesita permisos.
- Contador permite sumar y restar entre 0 y 9999, y reiniciar. Su valor se guarda localmente y se recupera al cerrar y volver a abrir la aplicación.
- Respiración guía cuatro ciclos de inhalar 4 segundos y exhalar 4 segundos. Comenzar inicia una sesión de 32 segundos; Detener o salir la reinicia. El ritmo se muestra con texto y cuenta regresiva, sin requerir animaciones.
- Tres en raya permite jugar con X contra el reloj (O). Incluye instrucciones y dificultad Fácil (movimientos aleatorios), Normal (gana o bloquea) y Difícil (estrategia minimax). Guarda el total de victorias y la dificultad elegida. Otra partida vuelve a la pantalla inicial. Los toques se bloquean durante el turno del reloj.
- Reacción espera entre 1.5 y 4 segundos antes de mostrar ¡TOCA YA! Tocar antes pierde el intento; tocar a tiempo muestra milisegundos y la mejor marca guardada. Es un juego aproximado, afectado por la respuesta de la pantalla. Al pasar la app a segundo plano se cancela el intento. Incluye instrucciones antes de jugar.
- Memoria también muestra instrucciones iniciales y guarda el menor número de intentos de una partida completada.
- Configuración alterna Medianoche/Océano, controla animaciones y ofrece vibración opcional (apagada por defecto). La vibración responde a botones, parejas de memoria, final de partida y vencimiento del temporizador mientras la app está activa. Su disponibilidad depende del dispositivo. Tema, animaciones y vibración se guardan localmente.
- Hábitos permite marcar Estudiar, Caminar y Leer. Guarda las marcas del día local y presenta la lista vacía al cambiar de día; no conserva un historial.
- Pomodoro ofrece 25 minutos de estudio y 5 de descanso, con inicio, pausa y reinicio. Al completar una fase cambia a la siguiente y espera que pulses Iniciar. Continúa al volver al menú durante la sesión, pero no se guarda al cerrar la app ni genera notificaciones. El modo Prueba usa 10 segundos y 5 segundos para comprobar el ciclo; cambiar de modo reinicia el contador de sesiones.
- Simón dice muestra una secuencia de cuatro colores numerados: observa sin tocar y luego repítela. Cada ronda completada agrega un paso; un error termina la partida. Guarda la mayor cantidad de rondas completadas. Al enviar la app al fondo se cancela el intento; al salir del juego se reinicia la partida.
- CuriTap es un juego individual de 20 segundos: toca el objetivo para sumar puntos y moverlo. Cada cinco aciertos se reduce su tamaño, con un mínimo fijo. Los objetivos aparecen completos dentro del círculo; tocar fuera no suma puntos. Al terminar se guarda el récord y puedes jugar otra vez. Si pasas la app al fondo o sales del juego, se cancela el intento y no se guarda esa puntuación. También puedes añadirlo a Favoritos.
- Mayor o menor muestra un número del 1 al 9 y dos botones para adivinar el siguiente. Nunca repite un número seguido. Cada acierto suma un punto y aumenta la racha; un fallo cuesta una vida y reinicia la racha. Hay tres vidas. Siguiente permite revisar el resultado antes de decidir otra vez; al perder las vidas puedes comenzar otra partida. La mayor racha se guarda localmente, incluso si sales antes de terminar. Está disponible en Favoritos.
- Alarmas permite elegir hora y minuto, y activar/desactivar un aviso único. Cambiar la hora desactiva el aviso anterior; hay que activarlo de nuevo. Si la hora ya pasó, se programa para mañana. Guarda el aviso pendiente y muestra un diálogo al vencer mientras la app está activa. Si estaba cerrada o en segundo plano, muestra el aviso pendiente al volver a abrirla. No programa notificaciones del sistema ni reproduce una alarma con la app cerrada. La vibración depende del ajuste correspondiente.
- Favoritos reemplaza Notas rápidas. Abre hasta cuatro apps desde accesos grandes dentro del reloj. Editar permite marcar o quitar destinos; si ya hay cuatro, debes quitar uno antes de añadir otro. Listo vuelve a los accesos. La selección se guarda localmente; inicialmente incluye Reloj, Temporizador, Pendientes y Pomodoro.
- Conversor permite convertir °C/°F, km/mi y kg/lb, en ambos sentidos. Acepta coma o punto decimal y ofrece ± para valores negativos. Muestra hasta cinco decimales.
- Dados y moneda permite lanzar un dado de seis caras o una moneda, y cuenta los lanzamientos de esa sesión. Cambiar entre dado y moneda reinicia el resultado y el contador.
- Mi perfil permite escribir un nombre de hasta 24 caracteres y una meta personal de hasta 60. Ambos se guardan automáticamente en el teléfono; no crea una cuenta ni publica datos.
- Pendientes permite agregar hasta ocho tareas de 50 caracteres, marcarlas como completadas y eliminarlas. La lista se desplaza dentro del círculo y se guarda localmente; no necesita fechas ni notificaciones.
- Batería consulta el porcentaje y estado de carga reales del teléfono mediante [Expo Battery para SDK 57](https://docs.expo.dev/versions/v57.0.0/sdk/battery/). Actualiza al abrir, al volver a primer plano, ante cambios del cargador y cada 30 segundos mientras esta pantalla está abierta. Si la lectura no está disponible muestra un guion, sin inventar datos; en web se muestra no disponible.
- Modo reloj: en Configuración → Ajustes activa Iniciar con reloj. La siguiente apertura inicia en la esfera elegida. La corona abre el panal desde el reloj y regresa al reloj desde las demás apps o el panal. Con el modo desactivado se conserva el inicio en panal. No mantiene la pantalla del teléfono despierta ni crea un reloj del sistema.
- Agua permite registrar vasos manualmente, corregir con − y elegir una meta de 1 a 20. El contador se renueva cada día local; la meta y el último registro se guardan. El valor inicial es editable y no representa una recomendación personal.
- Cumpleaños guarda hasta cinco nombres con día y mes, muestra los días que faltan y ordena las fechas próximas primero. Permite eliminar registros; no necesita contactos ni genera notificaciones. El 29 de febrero se muestra el 28 de febrero en años no bisiestos.
- La corona lateral y el botón Atrás de Android regresan al menú y centran el panal. Los juegos se reinician al volver a abrirlos; se guardan récords, no partidas activas.

El tamaño del reloj se adapta al ancho disponible. Las pantallas internas usan una superficie de diseño de 300 unidades que se escala con el reloj para reducir recortes. La página puede desplazarse verticalmente en teléfonos pequeños. Falta validar tamaño de texto, precisión táctil y fluidez en dispositivos físicos.

El guardado usa AsyncStorage local, sin backend ni base de datos. Se conservan ajustes, estilo de reloj, formato horario, modo de inicio, perfil, pendientes, favoritos, agua, cumpleaños, contador, hábitos del día, alarma pendiente, récords de memoria, reacción, Simón dice, CuriTap y Mayor o menor, y victorias de tres en raya. No se guardan partidas activas ni temporizadores. Borrar los datos de la app elimina los datos locales. Si falla la lectura o escritura se muestra un aviso dentro de Configuración.

## APK Android con EAS

Necesitas una cuenta de Expo y conexión a Internet. La compilación se hace en la nube, sin Android Studio.

```bash
npx eas-cli@latest login
npx eas-cli@latest build:configure
npx eas-cli@latest build --platform android --profile preview
```

En la configuración inicial elige Android, vincula o crea el proyecto de tu cuenta y permite generar las credenciales de firma cuando EAS lo solicite. EAS puede agregar `extra.eas.projectId` a `app.json`; no se incluye un identificador ficticio en este proyecto.

El perfil `preview` de `eas.json` especifica `android.buildType: apk`. Al terminar, abre el enlace que imprime EAS o entra a tu proyecto en https://expo.dev → Builds y descarga el archivo `.apk`. Abre ese archivo en tu teléfono Android y permite la instalación desde esa fuente. La APK instalada funciona sin el servidor de desarrollo. El perfil `production` es opcional y genera AAB para la tienda; para esta práctica usa `preview`.

Referencia oficial: https://docs.expo.dev/build-reference/apk/

## Estructura

```text
App.js                      Marco, navegación y estado de sesión
src/components/Honeycomb.js  Panal, gestos y escala
src/components/Controls.js   Botones reutilizables
src/components/Feedback.js   Vibración opcional y botones
src/components/usePreferences.js Lectura y guardado local en orden
src/components/GameIntro.js  Instrucciones antes de jugar
src/data/preferences.js     Valores iniciales y validación del guardado
src/screens/WatchApps.js     Reloj, cronómetro, actividad y ajustes
src/screens/ExtraApps.js     Calculadora, temporizador y memoria
src/screens/MoreApps.js      Calendario, contador, respiración y dos juegos
src/screens/ProductivityApps.js Hábitos, Pomodoro y Simón dice
src/data/productivityLogic.js Fecha local, hábitos, fases y secuencias
src/screens/UtilityApps.js   Alarmas, conversor, dados y moneda
src/screens/Favorites.js     Accesos personales y selección de apps
src/data/favoritesLogic.js   Límites y validación de favoritos
src/data/utilityLogic.js     Próximo aviso, conversiones y azar
src/screens/PersonalApps.js  Perfil y pendientes personales
src/data/personalLogic.js    Tareas y ángulos del reloj analógico
src/screens/DailyApps.js     Batería, agua y cumpleaños
src/data/dailyLogic.js       Fechas, vasos y navegación del modo reloj
src/screens/CuriTap.js       Juego de objetivos de 20 segundos
src/data/curiTapLogic.js     Tamaños, posiciones y cuenta regresiva
src/screens/HigherLower.js   Juego Mayor o menor con tres vidas
src/data/higherLowerLogic.js Números sin repetición, puntos y rachas
src/data/extraLogic.js       Operaciones, cuenta regresiva y barajado
src/data/gameLogic.js        Tablero, movimientos del rival y calendario
src/data/apps.js            Posiciones hexagonales y destinos
src/data/logic.js            Formato de tiempo y actividad de ejemplo
src/theme/themes.js         Paletas
tests/logic.test.js          Pruebas de lógica
```

## Validación

`npm test` ejecuta veintinueve pruebas: cronómetro, datos simulados, calculadora, temporizador, memoria, tablero, rival, calendario, dificultad, validación del guardado, hábitos, fases de Pomodoro, secuencias de Simón dice, alarmas, conversiones, dado/moneda, pendientes, manecillas, perfil/esferas, favoritos, cumpleaños, agua, modo reloj geometría, tiempo y guardado de CuriTap, y números/rachas de Mayor o menor. La prueba de dificultad recorre todas las secuencias posibles del jugador y verifica que el modo difícil no pierde. `npx expo export --platform android` verifica que Metro pueda empaquetar el proyecto; no genera una APK.

Comprobación manual en Expo Go antes de entregar:

1. Arrastrar en horizontal, vertical y diagonal; tocar los iconos del centro y los bordes.
2. Abrir cada destino y regresar por corona y Atrás.
3. Verificar que cambian los segundos del reloj.
4. Iniciar cronómetro, pausar, esperar, reanudar y reiniciar; volver al menú mientras corre y abrirlo otra vez.
5. Cambiar tema, desactivar animaciones y comprobar navegación y arrastre.
6. Verificar que Actividad muestra el aviso de simulación; probar un teléfono pequeño y uno grande.
7. Calcular 0.1 + 0.2, probar C y dividir entre cero.
8. Iniciar 10 segundos, pausar y reanudar; salir al menú y regresar después del vencimiento. Reiniciar y cambiar la duración.
9. En Memoria, probar dos cartas distintas y una pareja; completar las tres parejas, verificar el contador y comenzar una nueva partida, incluso mientras se ocultan cartas.
10. En Calendario, navegar entre diciembre y enero, comprobar febrero y regresar a Hoy. Sumar/restar en Contador, salir y verificar que conserva el valor; reiniciarlo.
11. En Respiración, completar los 32 segundos, detener y comenzar otra vez; salir durante un ciclo.
12. En Tres en raya, probar victoria, derrota y empate; reiniciar durante el turno del reloj y salir mientras piensa.
13. En Reacción, tocar antes de la señal, completar varios intentos, verificar la mejor marca y enviar la app a segundo plano durante la espera. Salir del juego antes de la señal y abrirlo otra vez.
14. Cambiar tema y vibración, modificar contador y completar juegos. Cerrar y reabrir la app: comprobar ajustes, contador, récords y victorias. Con vibración apagada no deben vibrar los botones; con ella activa, probar parejas y temporizador de 10 segundos.
15. Probar apertura con un toque y centrado al pulsar la corona. Repetir en teléfonos pequeños y grandes, revisando que los textos y botones permanezcan legibles dentro del círculo.
16. Marcar y desmarcar hábitos; cerrar y reabrir para comprobar persistencia. Al cambiar la fecha local, comprobar la renovación de la lista.
17. En Pomodoro activar Prueba, completar estudio y descanso, pausar, reanudar y regresar desde el menú. Comprobar que solo aumenta el contador al terminar estudio y que cada fase espera el inicio manual.
18. En Simón dice observar la secuencia, repetirla, completar varias rondas y provocar un error. Comprobar que se bloquean toques mientras muestra colores, que conserva el récord y que cancela el intento al pasar al fondo.
19. En Alarmas seleccionar el siguiente minuto y activar; esperar con la app abierta, comprobar un único aviso y que se desactiva. Cambiar hora, cancelar y comprobar recuperación de un aviso pendiente al reabrir.
20. Abrir Favoritos (estrella), entrar a Editar, quitar y añadir apps, probar el límite de cuatro y dejar la selección vacía. Elegir destinos, pulsar Listo y abrir cada acceso. Cerrar y reabrir para comprobar que la selección se conserva.
21. Convertir 0 °C a 32 °F, invertir, probar −40, usar comas y cambiar entre distancia y peso.
22. Lanzar dado y moneda varias veces; comprobar los resultados y que el contador se reinicia al cambiar de modo.
23. En Configuración → Relojes elegir cada estilo, alternar 12/24 h y abrir Ver reloj. Comparar las manecillas con la hora local. Cambiar a Ajustes para acceder al tema, animaciones y vibración.
24. Completar nombre y meta en Mi perfil, abrir el reloj minimalista y comprobar los textos; cerrar y reabrir para verificar guardado.
25. En Pendientes crear, marcar y eliminar tareas. Probar texto vacío y el límite de ocho; desplazar la lista, cerrar y reabrir para comprobar persistencia.
26. En Batería comparar con el porcentaje del teléfono, conectar/desconectar cargador y volver desde segundo plano. La lectura real requiere prueba en un dispositivo físico.
27. Activar Iniciar con reloj, cerrar/reabrir y usar la corona para alternar esfera/panal; abrir otra app y volver. Desactivarlo y comprobar que la siguiente apertura inicia en el panal.
28. En Agua sumar y restar, cambiar la meta y comprobar persistencia al cerrar. Verificar la renovación al cambiar de día local.
29. Agregar un cumpleaños de hoy y uno próximo, verificar orden, eliminar, probar una fecha inválida y comprobar persistencia. Revisar 29 de febrero según la regla documentada.
30. En CuriTap completar una partida, verificar el límite de 20 segundos, cambio de posición y reducción cada cinco aciertos. Probar toques rápidos, toques fuera del objetivo, reinicio, cancelación al salir o pasar al fondo y conservación del récord al cerrar la app.
31. En Mayor o menor probar ambos botones, comprobar que no se repiten números y que cada decisión cuenta una sola vez. Perder tres vidas, reiniciar y verificar puntos/rachas; cerrar y reabrir para comprobar conservación del récord.

Las pruebas de lógica y empaquetado no sustituyen una prueba física de gestos, fluidez y Expo Go. No se incluye una APK compilada ni se da por probado el rendimiento en un dispositivo físico.

Verificación de las mejoras: veintinueve pruebas de lógica aprobadas, exportación Android con Metro/Hermes completada, `expo install --check` sin desajustes y Expo Doctor con 21/21 comprobaciones. Se agregó AsyncStorage 2.2.0, compatible con SDK 57; la vibración usa React Native. `npm audit` reportó 25 avisos en el árbol de dependencias (7 moderados y 18 altos); no se aplicó `audit fix --force`, que proponía versiones incompatibles con este SDK. La persistencia física, la vibración y la experiencia táctil requieren la comprobación manual en el teléfono descrita arriba.

## Referencia y licencia

Inspiración visual y de interacción: [WineGlass, de Sirui Li](https://github.com/leethree/WineGlass), distribuido bajo MIT. Esta implementación se escribió desde cero y no reutiliza su código ni sus recursos. Los iconos provienen de Ionicons mediante Expo Vector Icons, con sus respectivas licencias incluidas en las dependencias. No hay backend ni base de datos. Actividad usa valores simulados; Batería consulta datos reales del sistema.

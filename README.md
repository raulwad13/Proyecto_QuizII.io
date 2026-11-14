# Quiz II: El retorno 🎮

Quiz arcade sobre videojuegos desarrollado como proyecto educativo por **Raul Awad y Alejandro Sanchez**.

## Funcionalidades

- Diez preguntas de opción múltiple obtenidas de [Open Trivia DB](https://opentdb.com/).
- Temporizador de 30 segundos por pregunta y puntuación por rapidez.
- Registro e inicio de sesión mediante Firebase Authentication.
- Guardado de resultados y clasificación mediante Cloud Firestore.
- Gráfica de puntuaciones en la pantalla de inicio, con Chartist.

## Cómo jugar

1. Abre `home.html` y regístrate o inicia sesión.
2. Pulsa **Start Game** para comenzar.
3. Responde las preguntas antes de que termine el tiempo. Si se agota, puedes pasar a la siguiente.
4. Tras la última pregunta, consulta tu puntuación y el ranking.

## Ejecutar en local

Es un proyecto estático con HTML, CSS y JavaScript. No necesita instalar paquetes. Desde la carpeta del repositorio puedes iniciar un servidor local:

```bash
python -m http.server 8000
```

Visita `http://localhost:8000/home.html`.

**Necesita conexión a Internet** para descargar preguntas y utilizar Firebase. La autenticación, la escritura de resultados y el ranking dependen de que el proyecto Firebase siga activo, sus dominios estén autorizados y sus reglas de seguridad estén configuradas correctamente. No se ha verificado aquí el estado actual de esos servicios.

## Tecnologías

HTML5, CSS3, JavaScript, Open Trivia DB, Firebase Authentication, Cloud Firestore y Chartist.

## Estado y mejoras pendientes

- [x] Corregir la navegación del temporizador y los elementos de resultados.
- [x] Evitar que el código de la página de inicio actúe sobre otras páginas.
- [ ] Comprobar manualmente una partida completa y la conexión real a Firebase.
- [ ] Revisar reglas de seguridad de Firestore y privacidad del ranking.
- [ ] Mejorar accesibilidad y adaptar la interfaz a distintos tamaños de pantalla.

Proyecto de aprendizaje; no es una aplicación de producción.

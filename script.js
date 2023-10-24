let questionsAndAnswers = [];
let i = 0; //Contador de pregunta actual 0-10
let score = 0;

async function getQuestions() {
  let response = await fetch(
    `https://opentdb.com/api.php?amount=10&category=15&difficulty=easy&type=multiple`
  );
  return await response.json().then((res) => res.results);
}
async function startGame() {
  i = 0;
  score = 0;
  questionsAndAnswers = await getQuestions();
  console.log(questionsAndAnswers);
  //pintar primera
  printQuestion(questionsAndAnswers);
}
function printQuestion(n) {
  let nextButton = document.getElementById("next-button");
  nextButton.classList.toggle("display-none");
  if (questionsAndAnswers && questionsAndAnswers[i]) {
    let answers = [
      n[i].incorrect_answers[0],
      n[i].incorrect_answers[1],
      n[i].incorrect_answers[2],
      n[i].correct_answer,
    ];

    answers.sort(() => Math.random() - 0.5);
    console.log(answers);
    document.getElementById("preguntas-y-respuestas").innerHTML = ` <h3>${
      i + 1
    }. ${n[i].question}</h3>
                    <button class="answer-button" type="button">${
                      answers[0]
                    }</button>
                    <button class="answer-button" type="button">${
                      answers[1]
                    }</button>
                    <button class="answer-button" type="button">${
                      answers[2]
                    }</button>
                    <button class="answer-button" type="button">${
                      answers[3]
                    }</button>`;
    checkAnswers();
  }
}
function checkAnswers() {
  let botonesRespuestas = document.getElementsByClassName("answer-button");
  console.log(botonesRespuestas);
  for (let button of botonesRespuestas) {
    button.addEventListener("click", (event) => {
      console.log(event.target.innerHTML);
      if (event.target.innerHTML == questionsAndAnswers[i].correct_answer) {
        event.target.style.backgroundColor = "green";
        score += 100;
        cancelButtons();
        let nextButton = document.getElementById("next-button");
        nextButton.classList.toggle("display-none");
      } else if (
        event.target.innerHTML !== questionsAndAnswers[i].correct_answer
      ) {
        event.target.style.backgroundColor = "red";
        cancelButtons();
        let nextButton = document.getElementById("next-button");
        nextButton.classList.toggle("display-none");
      }
    });
  }
}
function cancelButtons() {
  let botonesRespuestas = document.getElementsByClassName("answer-button");
  for (let button of botonesRespuestas) {
    button.disabled = true;
  }
}
function getCurrentDate() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; //(0 = January, 1 = February, etc.) sumo + 1
  const day = currentDate.getDate();
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const seconds = currentDate.getSeconds();
  const date = `${day}/${month}/${year} - ${hours}:${minutes}:${seconds}`;
  return date;
}
function storeResultsLocal() {
  // Obtener los resultados existentes desde el localstorage, si los hay
  let existingResults = JSON.parse(localStorage.getItem("Results")) || [];
  let usuarioActual = localStorage.getItem("Usuario");
  // Agregar el nuevo resultado
  existingResults.push({
    user: usuarioActual,
    score: score,
    date: getCurrentDate(),
  });
  // Guardar en local storage
  localStorage.setItem("Results", JSON.stringify(existingResults));
}
async function storeResultsFirebase(result) {
  console.log(result);
  await db
    .collection("userScores")
    .add({
      user: result.user,
      score: result.score,
      date: result.date,
    })
    .then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
}
function getLocalStorage(item) {
  return JSON.parse(localStorage.getItem(item));
}
function showScore() {
  let resultado = document.getElementById("resultado");

  let username = document.getElementById("score-username");
  let scores = JSON.parse(localStorage.getItem("Results")).reverse(); //Le doy la vuelta para acceder al ultimo resultado siempre
  console.log(scores);
  resultado.innerHTML = scores[0].score;
  username.innerHTML = `Enhorabuena, ${scores[0].user}!`;
}
function restartGame() {
  window.location.href = "home.html";
}

function checkEmail(email) {
  let regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  return regex.test(email);
}
function checkPswd(password) {
  let regex = /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/;
  return regex.test(password);
}

//Empezar startGame() solo si estamos en question.html
if (window.location.pathname.includes("question.html")) {
  startGame();
}
//Empezar showScore() solo si estamos en results.html
if (window.location.pathname.includes("results.html")) {
  showScore();
  let restartButton = document.getElementById("restart-button");
  restartButton.addEventListener("click", (event) => {
    event.preventDefault();
    restartGame();
  });
}

//Eventos/////////////////////////////////////////////////////////////

//Boton Start
const startButton = document.querySelector("#start-button");
if (startButton) {
  startButton.addEventListener("click", (event) => {
    event.preventDefault();
    // startGame();  Ya se ejecuta al cambiar de html
    window.location.href = "question.html";
  });
}
//Boton Next
const nextButton = document.getElementById("next-button");
if (nextButton) {
  nextButton.addEventListener("click", async (event) => {
    // event.preventDefault();
    if (i < 9) {
      i++;
      printQuestion(questionsAndAnswers);
    } else if (i >= 9) {
      console.log("Hello");
      storeResultsLocal();
      let lastResult = getLocalStorage("Results").pop();
      await storeResultsFirebase(lastResult);
      window.location.href = "results.html";
    }
  });
}

// Your web app's Firebase configuration////////////////////////////////
const firebaseConfig = {
  apiKey: "AIzaSyAvBfKEeMvxp9fOpwFofn40EZM1JP8qIPs",
  authDomain: "quiz-ii-the-revenge.firebaseapp.com",
  projectId: "quiz-ii-the-revenge",
  storageBucket: "quiz-ii-the-revenge.appspot.com",
  messagingSenderId: "169985803724",
  appId: "1:169985803724:web:8fd4970097e79eb0348969",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig); // Inicializaar app Firebase

const db = firebase.firestore(); // db representa mi BBDD //inicia Firestore

//

/**************Firebase Auth*****************/

const createUser = (user) => {
  db.collection("users")
    .add(user)
    .then((docRef) => console.log("Document written with ID: ", docRef.id))
    .catch((error) => console.error("Error adding document: ", error));
};

const readAllUsers = (born) => {
  db.collection("users")
    .where("first", "==", born)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(doc.data());
      });
    });
};
//readAllUsers(1224)

// Read ONE
// function readOne(id) {
//   db.collection("users")
//     .doc(id)
//     .get()
//     .then((doc) => {
//       if (doc.exists) {
//         console.log("Document data:", doc.data());
//       } else {
//         // doc.data() will be undefined in this case
//         console.log("No such document!");
//       }
//     })
//     .catch((error) => {
//       console.log("Error getting document:", error);
//     });
// }
//readOne("690WYQfTZUoEFnq5q1Ov");

/**************Firebase Auth*****************/

const signUpUser = (email, password) => {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      let user = userCredential.user;
      console.log(`se ha registrado ${user.email} ID:${user.uid}`);
      alert(`se ha registrado ${user.email} ID:${user.uid}`);
      // ...
      // Guarda El usuario en Firestore
      createUser({
        id: user.uid,
        email: user.email,
        message: "hola!",
      });
    })
    .catch((error) => {
      let errorCode = error.code;
      let errorMessage = error.message;
      console.log("Error en el sistema" + error.message);
    });
};

//"alex@demo.com","123456"
if (window.location.pathname.includes("home.html")) {
  document.getElementById("form1").addEventListener("submit", function (event) {
    event.preventDefault();
    if (checkEmail(event.target.elements.email.value)) {
      var email = event.target.elements.email.value;
    } else {
      alert("Introduce un correo válido");
    }
    if (checkPswd(event.target.elements.pass.value)) {
      var pass = event.target.elements.pass.value;
    } else {
      alert(
        "Introduce una contraseña con al menos 6 caracteres, 1 mayúscula, 1 minúscula y 1 número"
      );
    }

    let pass2 = event.target.elements.pass2.value;

    pass === pass2 ? signUpUser(email, pass) : alert("error password");
  });
}

const signInUser = (email, password) => {
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      let user = userCredential.user;
      console.log(`se ha logado ${user.email} ID:${user.uid}`);
      alert(`se ha logado ${user.email} ID:${user.uid}`);
      console.log("USER", user);
    })
    .catch((error) => {
      let errorCode = error.code;
      let errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
    });
};

const signOut = () => {
  let user = firebase.auth().currentUser;

  firebase
    .auth()
    .signOut()
    .then(() => {
      console.log("Sale del sistema: " + user.email);
    })
    .catch((error) => {
      console.log("hubo un error: " + error);
    });
};

if (window.location.pathname.includes("home.html")) {
  document.getElementById("form2").addEventListener("submit", function (event) {
    event.preventDefault();

    if (checkEmail(event.target.elements.email2.value)) {
      var email = event.target.elements.email2.value;
    } else {
      alert("Introduce un email valido");
    }
    if (checkPswd(event.target.elements.pass3.value)) {
      var pass = event.target.elements.pass3.value;
    } else {
      alert(
        "Introduce una contraseña con al menos 6 caracteres, 1 mayúscula, 1 minúscula y 1 número"
      );
    }
    signInUser(email, pass);
  });
  document.getElementById("salir").addEventListener("click", signOut);
}

// Listener de usuario en el sistema
// Controlar usuario logado
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    console.log(`Está en el sistema:${user.email} ${user.uid}`);
    localStorage.setItem("Usuario", user.email); //Guardo usuario actual en local storage
    // getGraphData(user.email);
    printGrafic(user.email);
  } else {
    console.log("no hay usuarios en el sistema");
  }
});

// Gráfica:

// async function getGraphData(userName) {
//   let games = [];
//   await db
//     .collection("userScores").where("user", "==", userName)
//     .get()
//     .then((querySnapshot) => {
//       querySnapshot.forEach((user) => {
//         // console.log("***", user.data());
//         games.push(user.data());

//       });
//     }) .then(()=> games)
//     .then(console.log(games))
//     .then(printGrafic(games))
//     .catch(() => console.log("Error reading user scores"));
//     return games
//   }

const printGrafic = async (userName) => {
  let userGames = [];
  await db
    .collection("userScores")
    .where("user", "==", userName)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((user) => {
        // console.log("***", user.data());
        userGames.push(user.data());
      });
    })
    // .then(console.log(games))
    // .then(printGrafic(games))
    .catch(() => console.log("Error reading user scores"));

  let dates = [];
  let scores = [];

  userGames.forEach((game) => {
    dates.push(game.date);
    scores.push(game.score);
  });

  console.log(userGames, "******");

  let data = {
    // A labels array that can contain any sort of values
    labels: dates,
    // Our series array that contains series objects or in this case series data arrays
    series: [scores],
  };
  const options = {
    axisY: {
      onlyInteger: true,
    },
  };

  // console.log(data);

  // Create a new line chart object where as first parameter we pass in a selector
  // that is resolving to our chart container element. The Second parameter
  // is the actual data object.

  new Chartist.Line(".ct-chart", data, options);
};

printGrafic();

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
  if (questionsAndAnswers && questionsAndAnswers[i]) {
    let answers = [
      n[i].incorrect_answers[0],
      n[i].incorrect_answers[1],
      n[i].incorrect_answers[2],
      n[i].correct_answer,
    ];
  
    answers.sort(() => Math.random() - 0.5);
    console.log(answers);
    document.getElementById(
      "preguntas-y-respuestas"
    ).innerHTML = ` <h3>${i + 1}. ${n[i].question}</h3>
                    <button class="answer-button" type="button">${answers[0]}</button>
                    <button class="answer-button" type="button">${answers[1]}</button>
                    <button class="answer-button" type="button">${answers[2]}</button>
                    <button class="answer-button" type="button">${answers[3]}</button>`;
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
      } else if (
        event.target.innerHTML !== questionsAndAnswers[i].correct_answer
      ) {
        event.target.style.backgroundColor = "red";
        cancelButtons();
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
  // Agregar el nuevo resultado
  existingResults.push({
    score: score,
    date: getCurrentDate(),
  });
  // Guardar en local storage
  localStorage.setItem("Results", JSON.stringify(existingResults));
}
function showScore() {
  let resultado = document.getElementById('resultado'); //Obtengo la lista de scores guardada en local storage
  let scores = JSON.parse(localStorage.getItem("Results")).reverse(); //Le doy la vuelta para acceder al ultimo resultado siempre
  console.log(scores);
    resultado.innerHTML = scores[0].score;
}

//Empezar startGame() solo si estamos en question.html
if (window.location.pathname.includes("question.html")) {
  startGame();
}
//Empezar showScore() solo si estamos en results.html
if (window.location.pathname.includes("results.html")) {
  showScore();
}


//Eventos

//Boton Start
const startButton = document.querySelector('#start-button');
if (startButton) {
  startButton.addEventListener("click", (event) => {
    event.preventDefault();
    // startGame();  Ya se ejecuta al cambiar de html
    window.location.href = 'question.html';
  })
}
//Boton Next
const nextButton = document.getElementById("next-button");
if (nextButton) {
  nextButton.addEventListener("click", (event) => {
    event.preventDefault();
    if (i < 9) {
      i++;
      printQuestion(questionsAndAnswers);
    }
    else if (i >= 9) {
      storeResultsLocal();
      window.location.href='results.html'
    }
  });
}




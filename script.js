let questionsAndAnswers = [];
let i = 0;
let score = 0;

async function getQuestions() {
  let response = await fetch(
    `https://opentdb.com/api.php?amount=10&category=15&difficulty=easy&type=multiple`
  );
  return await response.json().then((res) => res.results);
}

async function startGame() {
  i = 0;
  questionsAndAnswers = await getQuestions();
  console.log(questionsAndAnswers);
  //pintar primera
  await printQuestion(questionsAndAnswers);
}

async function printQuestion(n) {
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
  ).innerHTML = ` <h3>${n[i].question}</h3>
                  <button class="answer-button" type="button">${answers[0]}</button>
                  <button class="answer-button" type="button">${answers[1]}</button>
                  <button class="answer-button" type="button">${answers[2]}</button>
                  <button class="answer-button" type="button">${answers[3]}</button>`;
  checkAnswers();
}

// function checkAnswers() {}

startGame();

//Eventos
document.getElementById("next-button").addEventListener("click", (event) => {
  event.preventDefault();
  i++;
  printQuestion(questionsAndAnswers);
});
function checkAnswers() {
  let botonesRespuestas = document.getElementsByClassName("answer-button");
  console.log(botonesRespuestas);
  for (let button of botonesRespuestas) {
    button.addEventListener('click', (event) => {
        console.log(event.target.innerHTML);
        if (event.target.innerHTML == questionsAndAnswers[i].correct_answer) {
          event.target.style.backgroundColor = 'green';
          score += 100;
          cancelButtons();
        }
        else if (event.target.innerHTML !== questionsAndAnswers[i].correct_answer) {
          event.target.style.backgroundColor = 'red';
          event.style.backgroundColor = 'green';
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

let i = 0;
let answers = [];

async function getQuestions() {
  let response = await fetch(
    `https://opentdb.com/api.php?amount=10&category=15&difficulty=easy&type=multiple`
  );
  return await response.json().then((res) => res.results);
}

async function startGame() {
  i = 0;
  let questionsAndAnswers = await getQuestions();
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
  ).innerHTML = `<h3 id="pregunta">${n[i].question}</h3>
                  <div id="respuestas">
                      <label for="respuesta1">${answers[0]}</label>
                      <input type="radio" name="respuesta" id="respuesta1" value="respuesta1">
                      <label for="respuesta2">${answers[1]}</label>
                      <input type="radio" name="respuesta" id="respuesta2" value="respuesta2">
                      <label for="respuesta3">${answers[2]}</label>
                      <input type="radio" name="respuesta" id="respuesta3" value="respuesta3">
                      <label for="respuesta4">${answers[3]}</label>
                      <input type="radio" name="respuesta" id="respuesta4" value="respuesta4">
                  </div>`;
}

// function checkAnswers() {}

startGame();

//Eventos
// document.querySelectorAll(#respuestas ).forEach(addEventListener)
async function getQuestions() {
  let response = await fetch(
    `https://opentdb.com/api.php?amount=10&category=15&difficulty=easy&type=multiple`
  );
  return await response.json().then((res) => res.results);
}

async function startGame() {
  let questionsAndAnswers = await getQuestions();
  console.log(questionsAndAnswers);
  //pintar primera
  await printQuestion(questionsAndAnswers);
}

let i = 0;
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
        <label>${answers[0]}</label>
        <input type="radio" name="" id="">
        <label>${answers[1]}</label>
        <input type="radio" name="" id="">
        <label>${answers[2]}</label>
        <input type="radio" name="" id="">
        <label>${answers[3]}</label>
        <input type="radio" name="" id="">
    </div>`;
  i++;
}

startGame();

//Eventos
document
  .getElementById("next-button")
  .addEventListener("click", () => printQuestion());

document.getElementById("back-button").addEventListener("click", () => {
  printQuestion();
});

// keep track of total score and time remaining
var answersCorrect = 0;
var answersIncorrect = 0;
var answersUnanswered = 0;
var timeRemaining = 30;

// establish all questions, and current question index
var currentQuestionIndex = 0;
var categoryId;
var questions;

// function definitions
function nextQuestion() {
  timeRemaining = 30;
  $('.question-display').empty().html(
  `
  <h4 class="time-display">
    Time remaining: ${timeRemaining}
  </h4>
  <br />
  <div>
    ${questions.results[currentQuestionIndex].question}
  </div>
  <br />
  <button class="option answer">
    ${questions.results[currentQuestionIndex].correct_answer}
  </button>
  <button class="option answer">
    ${questions.results[currentQuestionIndex].incorrect_answers[0]}
  </button>
  <button class="option answer">
    ${questions.results[currentQuestionIndex].incorrect_answers[1]}
  </button>
  <button class="option answer">
    ${questions.results[currentQuestionIndex].incorrect_answers[2]}
  </button>
  `
  );
  currentQuestionIndex++;
}

function correctAnswer() {
  answersCorrect++;
}

function incorrectAnswer() {
  answersIncorrect++;
}


$('.question-display').on("click", ".category", function() {
  categoryId = $(this).data('number');
  $('main').addClass('fadeout');
  $.ajax({
    url: `https://opentdb.com/api.php?amount=10&category=${categoryId}&difficulty=easy&type=multiple`,
    method: "GET"
  }).then((response) => {
    console.log(response);
    questions = response;
    setTimeout(() => {
      nextQuestion();
      $('main').removeClass('fadeout').addClass('fadein');
    }, 500);
  });
});
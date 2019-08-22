// keep track of total score and time remaining
var answersCorrect = 0;
var answersIncorrect = 0;
var answersUnanswered = 0;
var timeRemaining = 30;

// establish all questions, and current question index
var currentQuestionIndex = 0;
var categoryId;
var questions;

$('.question-display').on("click", ".category", function() {
  categoryId = $('this').data('number');
})

$.ajax({
  url: `https://opentdb.com/api.php?amount=10&category=${categoryId}&difficulty=easy&type=multiple`,
  method: "GET"
}).then((response) => {
  console.log(response);
  questions = response;
})
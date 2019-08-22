// keep track of total score and time remaining
var answersCorrect = 0;
var answersIncorrect = 0;
var answersUnanswered = 0;
var timeRemaining = 30;

// establish all questions, and current question index
var currentQuestionIndex = 0;
var categoryId;
var questions;

// set interval for timer
var timerInterval;

// function definitions
function nextQuestion() {
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
  timeRemaining = 30;
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeRemaining--;
    $('.time-display').text(`Time remaining: ${timeRemaining}`);
  }, 1000);
}

function correctAnswer() {
  answersCorrect++;
  $('.question-display').empty().html(
    `
    <br />
    <h2 class="right">
      CORRECT!
    </h2>
    <br />
    <div class="gif">
      GIF
    </div>
    `
    );
    $.ajax({
      url: `https://api.giphy.com/v1/gifs/search?api_key=nQtvdLS8RFmfo0CBFedERtrhHTq8NXas&q=${questions.results[currentQuestionIndex - 1].correct_answer}&limit=1`,
      method: "GET"
    }).then((response) => {
      console.log(questions.results[currentQuestionIndex - 1].correct_answer);
      console.log(response);
      $('.gif').html(`<img src="${response.data[0].images.downsized.url}">`);
    });
}

function incorrectAnswer() {
  answersIncorrect++;
  $('.question-display').empty().html(
    `
    <br />
    <h2 class="wrong">
      INCORRECT!
    </h2>
    <br />
    <div>
      GIF
    </div>
    `
    );
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

$('.question-display').on("click", ".answer", function() {
  if (true) {
    correctAnswer();
  }
  else if (false) {
    incorrectAnswer();
  }
});
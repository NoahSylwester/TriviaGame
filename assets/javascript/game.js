// keep track of total score and time remaining
var answersCorrect = 0;
var answersIncorrect = 0;
var answersUnanswered = 0;
var timeRemaining = 30;

// establish all questions, and current question index
var currentQuestionIndex = 0;
var categoryId;
var questions;
var answers;
var answer1;
var answer2;
var answer3;
var answer4;

// set interval for timer
var timerInterval;

// function definitions
function nextQuestion() {
  answers = [ // stores all answers in an array
    questions.results[currentQuestionIndex].correct_answer,
    questions.results[currentQuestionIndex].incorrect_answers[0],
    questions.results[currentQuestionIndex].incorrect_answers[1],
    questions.results[currentQuestionIndex].incorrect_answers[2]
  ]
  // create answers, filling randomly, removes options to fill as it does
  answer1 = answers[Math.floor(Math.random() * answers.length)];
  answers.splice(answers.indexOf(answer1), 1);

  answer2 = answers[Math.floor(Math.random() * answers.length)];
  answers.splice(answers.indexOf(answer2), 1);
  
  answer3 = answers[Math.floor(Math.random() * answers.length)];
  answers.splice(answers.indexOf(answer3), 1);
  
  answer4 = answers[Math.floor(Math.random() * answers.length)];
  
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
    ${answer1}
  </button>
  <button class="option answer">
    ${answer2}
  </button>
  <button class="option answer">
    ${answer3}
  </button>
  <button class="option answer">
    ${answer4}
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
      console.log(response)
      if (typeof(response.data[0]) !== 'undefined') {
        $('.gif').html(`<img style="height: 300px;" src="${response.data[0].images.downsized.url}">`);
      }
      else {
        $('.gif').html(`<img style="height: 300px;" src="https://media2.giphy.com/media/kigLtfDrV3K9N0wYCO/giphy.gif?cid=790b7611573e964e2eb2205928343b3f7ff1065e543a65fa&rid=giphy.gif">`);
      }
    });
}

function incorrectAnswer() {
  answersIncorrect++;
  $('.question-display').empty().html(
    `
    <br />
    <h2 class="wrong">
      INCORRECT! <br />
      The correct answer was ${questions.results[currentQuestionIndex - 1].correct_answer}.
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
      console.log(response)
      if (typeof(response.data[0]) !== 'undefined') {
        $('.gif').html(`<img style="height: 300px;" src="${response.data[0].images.downsized.url}">`);
      }
      else {
        $('.gif').html(`<img style="height: 300px;" src="https://media2.giphy.com/media/kigLtfDrV3K9N0wYCO/giphy.gif?cid=790b7611573e964e2eb2205928343b3f7ff1065e543a65fa&rid=giphy.gif">`);
      }
    });
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
  // checks answer
  console.log($(this).text().trim(), questions.results[currentQuestionIndex - 1].correct_answer.trim(), $(this).text() === questions.results[currentQuestionIndex - 1].correct_answer);
  if ($(this).text().trim() === questions.results[currentQuestionIndex - 1].correct_answer.trim()) {
    correctAnswer();
  }
  else {
    incorrectAnswer();
  }
});
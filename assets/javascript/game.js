// keep track of total score and time remaining
var answersCorrect = 0;
var answersIncorrect = 0;
var unanswered = 0;
var timeRemaining = 20;

// establish all questions, and current question index
var currentQuestionIndex = 0;
var categoryId;
var questions;
var answers;
var answer1;
var answer2;
var answer3;
var answer4;

// ranking for final score
var ranking = "";

// set interval for timer
var timerInterval;

// function taken from https://gomakethings.com/decoding-html-entities-with-vanilla-javascript/
// author: Chris Ferdinandi
// needed for comparing some strings from trivia API
var decodeHTML = function (html) {
	var txt = document.createElement('textarea');
	txt.innerHTML = html;
	return txt.value;
};

// function definitions
function fadeout() {
  $('main').removeClass('fadein').addClass('fadeout');
}

function fadein() {
  $('main').removeClass('fadeout').addClass('fadein');
}


function nextQuestion() {
  if (currentQuestionIndex === 10) {
    clearInterval(timerInterval);
    endGame();
  }
  timeRemaining = 20;
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
  <h3>
    Question ${currentQuestionIndex + 1}
  </h3>
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
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeRemaining--;
    $('.time-display').text(`Time remaining: ${timeRemaining}`);
    if (timeRemaining === 0) {
      clearInterval(timerInterval);
      unanswered++;
      incorrectAnswer();
    }
  }, 1000);
}

function correctAnswer() {
  answersCorrect++;
  $('.question-display').empty().html(
    `
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
    setTimeout(() => {
      fadeout();
      setTimeout(() => {
        nextQuestion();
        fadein();
      }, 600);
    }, 5000);
}

function incorrectAnswer() {
  answersIncorrect++;
  $('.question-display').empty().html(
    `
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
    setTimeout(() => {
      fadeout();
      setTimeout(() => {
        nextQuestion();
        fadein();
      }, 600);
    }, 5000);
}

function endGame() {
  fadeout()
  let score = answersCorrect - answersIncorrect;
  if (score === 10) {
    ranking = "Ultimate Grandmaster";
  }
  else if (score === 9 || score === 8) {
    ranking = "Knowledge Connoisseur";
  }
  else if (score === 7 || score === 6) {
    ranking = "Trivial Journeyman";
  }
  else if (score === 5 || score === 4) {
    ranking = "Answer Dancer";
  }
  else if (score === 3) {
    ranking = "Plucky Ducky";
  }
  else if (score === 2) {
    ranking = "Quizee Apprentice";
  }
  else if (score === 1) {
    ranking = "Question Baby";
  }
  else if (score === 0) {
    ranking = "Sinker Thinker";
  }
  else if (score === -1) {
    ranking = "Find Mind";
  }
  else if (score === -2) {
    ranking = "Try again? /:";
  }
  else if (score === -3 || score === -4) {
    ranking = "Needs Work, Champ.";
  }
  else if (score === -5 || score === -6) {
    ranking = "Chump.";
  }
  else if (score === -7 || score === -8 || score === -9) {
    ranking = "Yikes...";
  }
  else if (score === -10) {
    ranking = "Everything was wrong. Every single one.";
  }
  setTimeout(() => {
    $('.question-display').empty().html(
      `
      <h3>
        Final score
      </h3>
      <h4>
        Your ranking: <strong class="ranking">${ranking}</strong>
      </h4>
      <p>
        Correct Answers: ${answersCorrect}</p>
      <p>
        Incorrect Answers: ${answersIncorrect}</p>
      <p>
        Unanswered: ${unanswered}</p>
      <div class="gif">
        GIF
      </div>
      `
      );
      $.ajax({
        url: `https://api.giphy.com/v1/gifs/search?api_key=nQtvdLS8RFmfo0CBFedERtrhHTq8NXas&q=${ranking}&limit=1`,
        method: "GET"
      }).then((response) => {
          $('.gif').html(`<img style="height: 300px;" src="${response.data[0].images.downsized.url}">`);
      });
      fadein();
  }, 500)
}


$('.question-display').on("click", ".category", function() {
  categoryId = $(this).data('number');
  fadeout();
  $.ajax({
    url: `https://opentdb.com/api.php?amount=10&category=${categoryId}&difficulty=easy&type=multiple`,
    method: "GET"
  }).then((response) => {
    console.log(response);
    questions = response;
    setTimeout(() => {
      nextQuestion();
      fadein();
    }, 500);
  });
});

$('.question-display').on("click", ".answer", function() {
  // checks answer
  console.log($(this).text().trim(), questions.results[currentQuestionIndex - 1].correct_answer.trim(), $(this).text().trim() === questions.results[currentQuestionIndex - 1].correct_answer.trim());
  if (decodeHTML($(this).text().trim()) === decodeHTML(questions.results[currentQuestionIndex - 1].correct_answer.trim())) {
    correctAnswer();
  }
  else {
    incorrectAnswer();
  }
});
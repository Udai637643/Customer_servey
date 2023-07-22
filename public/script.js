let currentQuestionIndex = 0;
let surveyData = {};

const questions = [
  {
    question: "How satisfied are you with our products?",
    type: "rating",
    min: 1,
    max: 5,
  },
  {
    question: "How fair are the prices compared to similar retailers?",
    type: "rating",
    min: 1,
    max: 5,
  },
  {
    question: "How satisfied are you with the value for money of your purchase?",
    type: "rating",
    min: 1,
    max: 5,
  },
  {
    question: "On a scale of 1-10 how would you recommend us to your friends and family?",
    type: "rating",
    min: 1,
    max: 10,
  },
  {
    question: "What could we do to improve our service?",
    type: "text",
  },
];

const welcomeScreen = document.getElementById("welcome-screen");
const surveyScreen = document.getElementById("survey-screen");
const thankYouScreen = document.getElementById("thank-you-screen");

const startButton = document.getElementById("start-button");
const questionNumber = document.getElementById("question-number");
const questionText = document.getElementById("question");
const ratingSlider = document.getElementById("rating-slider");
const ratingValue = document.getElementById("rating-value");
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");
const skipButton = document.getElementById("skip-button");
const textAnswer = document.getElementById("text-answer");

function showWelcomeScreen() {
  welcomeScreen.style.display = "block";
  surveyScreen.style.display = "none";
  thankYouScreen.style.display = "none";
}

function showSurveyScreen() {
  welcomeScreen.style.display = "none";
  surveyScreen.style.display = "block";
  thankYouScreen.style.display = "none";
}

function showThankYouScreen() {
  welcomeScreen.style.display = "none";
  surveyScreen.style.display = "none";
  thankYouScreen.style.display = "block";
}

function startSurvey() {
  currentQuestionIndex = 0;
  surveyData = {
    sessionId: Date.now().toString(), // Generate a random session ID
    answers: [],
    status: "IN_PROGRESS",
  };
  updateQuestionUI();
  showSurveyScreen();
}

function updateQuestionUI() {
  const question = questions[currentQuestionIndex];
  questionNumber.textContent = `Question ${currentQuestionIndex + 1}/${questions.length}`;
  questionText.textContent = question.question;

  if (question.type === "rating") {
    ratingSlider.style.display = "block";
    textAnswer.style.display = "none";
    ratingSlider.min = question.min;
    ratingSlider.max = question.max;
    ratingSlider.value = (question.min + question.max) / 2; // Set default value to the middle of the range
    ratingValue.textContent = ratingSlider.value;
  } else if (question.type === "text") {
    ratingSlider.style.display = "none";
    textAnswer.style.display = "block";
    textAnswer.value = "";
  }
}

function updateRatingValue() {
  ratingValue.textContent = ratingSlider.value;
}

function saveAnswer() {
  const question = questions[currentQuestionIndex];
  const answer = question.type === "rating" ? parseInt(ratingSlider.value) : textAnswer.value;
  surveyData.answers.push({
    questionId: currentQuestionIndex + 1,
    answer: answer,
  });
}

function handlePrevButtonClick() {
  saveAnswer();
  currentQuestionIndex--;
  if (currentQuestionIndex < 0) {
    currentQuestionIndex = 0;
  }
  updateQuestionUI();
}

function handleNextButtonClick() {
  saveAnswer();
  currentQuestionIndex++;
  if (currentQuestionIndex >= questions.length) {
    surveyData.status = "COMPLETED";
    saveSurveyResponseToBackend(); // Save the survey response to the backend
    showThankYouScreen();
    setTimeout(showWelcomeScreen, 5000); // Show welcome screen after 5 seconds
  } else {
    updateQuestionUI();
  }
}

function handleSkipButtonClick() {
  saveAnswer();
  currentQuestionIndex++;
  if (currentQuestionIndex >= questions.length) {
    surveyData.status = "COMPLETED";
    saveSurveyResponseToBackend(); // Save the survey response to the backend
    showThankYouScreen();
    setTimeout(showWelcomeScreen, 5000); // Show welcome screen after 5 seconds
  } else {
    updateQuestionUI();
  }
}

function updateLocalStorageSurveyData() {
  localStorage.setItem("surveyData", JSON.stringify(surveyData));
}

function saveSurveyResponseToBackend() {
  // Send the survey response to the backend using AJAX (assuming the backend is running at http://localhost:3000)
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "http://localhost:3000/api/survey");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify(surveyData));
}

startButton.addEventListener("click", startSurvey);
ratingSlider.addEventListener("input", updateRatingValue);
prevButton.addEventListener("click", handlePrevButtonClick);
nextButton.addEventListener("click", handleNextButtonClick);
skipButton.addEventListener("click", handleSkipButtonClick);

showWelcomeScreen();

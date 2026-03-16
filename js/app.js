const categories = [
  { id: 9, name: "General", icon: "&#x1F30D;", label: "General Knowledge" },
  { id: 10, name: "Books", icon: "&#x1F4DA;", label: "Books & Literature" },
  { id: 11, name: "Film", icon: "&#x1F3AC;", label: "Film & Cinema" },
  { id: 12, name: "Music", icon: "&#x1F3B5;", label: "Music" },
  { id: 17, name: "Science", icon: "&#x1F52C;", label: "Science & Nature" },
  { id: 18, name: "Computers", icon: "&#x1F4BB;", label: "Computers & Tech" },
  { id: 21, name: "Sports", icon: "&#x26BD;", label: "Sports" },
  { id: 22, name: "Geography", icon: "&#x1F5FA;", label: "Geography" },
  { id: 23, name: "History", icon: "&#x1F3DB;", label: "History" },
  { id: 25, name: "Art", icon: "&#x1F3A8;", label: "Art & Culture" },
];

const difficultyIcons = {
  easy: "&#x1F331;",
  medium: "&#x26A1;",
  hard: "&#x1F525;",
};

const state = {
  selectedDifficulty: "medium",
  selectedCategoryId: 9,
  selectedCategoryLabel: "General Knowledge",
  timerDuration: 15,
  questionCount: 10,
  questions: [],
  currentQuestionIndex: 0,
  score: 0,
  userAnswers: [],
  timer: null,
  timeLeft: 15,
  startTime: null,
  totalTimeUsed: 0,
  currentTheme: "default",
  showStats: true,
  reducedMotion: false,
};

const categoryGrid = document.querySelector("#category-grid");
const difficultyCards = document.querySelectorAll(".difficulty-card");
const startButton = document.querySelector("#start-btn");
const instructionsButton = document.querySelector("#instructions-btn");
const notice = document.querySelector("#accessibility-notice");
const welcomeScreen = document.querySelector("#welcome-screen");
const loadingScreen = document.querySelector("#loading-screen");
const errorScreen = document.querySelector("#error-screen");
const quizScreen = document.querySelector("#quiz-screen");
const resultsScreen = document.querySelector("#results-screen");
const optionsContainer = document.querySelector("#options-container");
const nextButton = document.querySelector("#next-btn");
const restartButton = document.querySelector("#restart-btn");
const tryAgainButton = document.querySelector("#try-again-btn");
const shareResultsButton = document.querySelector("#share-results-btn");
const fallbackButton = document.querySelector("#fallback-btn");
const backToSetupButton = document.querySelector("#back-to-setup-btn");
const settingsButton = document.querySelector("#settings-btn");
const settingsPanel = document.querySelector("#settings-panel");
const themeToggle = document.querySelector("#theme-toggle");
const themeOptions = document.querySelectorAll(".theme-option");
const timerOptions = document.querySelectorAll(".timer-option");
const showStatsToggle = document.querySelector("#show-stats");
const reduceMotionToggle = document.querySelector("#reduce-motion");
const quickStartButton = document.querySelector("#quick-start-btn");
const timerDisplay = document.querySelector("#timer");
const timeLeftText = document.querySelector("#time-left");
const questionStats = document.querySelector("#question-stats");
const statsText = document.querySelector("#stats-text");

const localQuestions = [
  {
    categoryId: 9,
    category: "General Knowledge",
    difficulty: "medium",
    question: "What is the capital city of Canada?",
    correctAnswer: "Ottawa",
    incorrectAnswers: ["Toronto", "Vancouver", "Montreal"],
  },
  {
    categoryId: 9,
    category: "General Knowledge",
    difficulty: "medium",
    question: "Which element has the chemical symbol O?",
    correctAnswer: "Oxygen",
    incorrectAnswers: ["Gold", "Osmium", "Zinc"],
  },
  {
    categoryId: 10,
    category: "Books & Literature",
    difficulty: "medium",
    question: "Who wrote the novel 1984?",
    correctAnswer: "George Orwell",
    incorrectAnswers: ["Aldous Huxley", "Ray Bradbury", "Jules Verne"],
  },
  {
    categoryId: 11,
    category: "Film & Cinema",
    difficulty: "medium",
    question: "Which film features the quote, 'I'll be back'?",
    correctAnswer: "The Terminator",
    incorrectAnswers: ["RoboCop", "Predator", "Die Hard"],
  },
  {
    categoryId: 12,
    category: "Music",
    difficulty: "medium",
    question: "How many strings does a standard guitar usually have?",
    correctAnswer: "Six",
    incorrectAnswers: ["Four", "Five", "Seven"],
  },
  {
    categoryId: 17,
    category: "Science & Nature",
    difficulty: "medium",
    question: "What gas do plants absorb during photosynthesis?",
    correctAnswer: "Carbon dioxide",
    incorrectAnswers: ["Oxygen", "Nitrogen", "Hydrogen"],
  },
  {
    categoryId: 18,
    category: "Computers & Tech",
    difficulty: "medium",
    question: "What does CSS stand for?",
    correctAnswer: "Cascading Style Sheets",
    incorrectAnswers: [
      "Creative Style Syntax",
      "Computer Style System",
      "Coded Style Sheets",
    ],
  },
  {
    categoryId: 21,
    category: "Sports",
    difficulty: "medium",
    question: "How many players are on a soccer team on the field?",
    correctAnswer: "11",
    incorrectAnswers: ["9", "10", "12"],
  },
  {
    categoryId: 22,
    category: "Geography",
    difficulty: "medium",
    question: "Which is the largest ocean on Earth?",
    correctAnswer: "Pacific Ocean",
    incorrectAnswers: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean"],
  },
  {
    categoryId: 23,
    category: "History",
    difficulty: "medium",
    question: "The pyramids of Giza are located in which country?",
    correctAnswer: "Egypt",
    incorrectAnswers: ["Mexico", "Greece", "India"],
  },
  {
    categoryId: 25,
    category: "Art & Culture",
    difficulty: "medium",
    question: "Who painted The Persistence of Memory?",
    correctAnswer: "Salvador Dali",
    incorrectAnswers: ["Pablo Picasso", "Claude Monet", "Henri Matisse"],
  },
];

function init() {
  loadSettings();
  renderCategories();
  bindDifficultyCards();
  updateSummary();
  updateSettingsUI();
}

function renderCategories() {
  categoryGrid.innerHTML = "";

  categories.forEach((category) => {
    const card = document.createElement("li");
    const isSelected = category.id === state.selectedCategoryId;

    card.className = `category-card${isSelected ? " active" : ""}`;
    card.dataset.id = category.id;
    card.setAttribute("role", "radio");
    card.setAttribute("aria-checked", isSelected ? "true" : "false");
    card.tabIndex = 0;
    card.innerHTML = `
      <div class="active-check"><i class="fas fa-check"></i></div>
      <span class="cat-icon">${category.icon}</span>
      <div class="cat-name">${category.name}</div>
    `;

    card.addEventListener("click", () => {
      selectCategory(category.id, category.label);
    });
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectCategory(category.id, category.label);
      }
    });

    categoryGrid.appendChild(card);
  });
}

function bindDifficultyCards() {
  difficultyCards.forEach((card) => {
    card.addEventListener("click", () => {
      selectDifficulty(card.dataset.difficulty);
    });
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectDifficulty(card.dataset.difficulty);
      }
    });
  });
}

function selectDifficulty(level) {
  state.selectedDifficulty = level;

  difficultyCards.forEach((card) => {
    const isSelected = card.dataset.difficulty === level;
    card.classList.toggle("active", isSelected);
    card.setAttribute("aria-checked", isSelected ? "true" : "false");
  });

  updateSummary();
  saveSettings();
  showNotice(`Difficulty set to ${capitalize(level)}`);
}

function selectCategory(id, label) {
  state.selectedCategoryId = id;
  state.selectedCategoryLabel = label;
  renderCategories();
  updateSummary();
  saveSettings();
  showNotice(`Category set to ${label}`);
}

function updateSummary() {
  const category = categories.find((item) => item.id === state.selectedCategoryId);

  document.querySelector("#summary-difficulty").innerHTML =
    `${difficultyIcons[state.selectedDifficulty]} ${capitalize(state.selectedDifficulty)}`;
  document.querySelector("#summary-category").innerHTML =
    `${category.icon} ${state.selectedCategoryLabel}`;
  document.querySelector("#total-questions").textContent = state.questionCount;
  document.querySelector("#total-time").textContent =
    state.timerDuration * state.questionCount;
  document.querySelector("#header-difficulty").textContent = capitalize(
    state.selectedDifficulty,
  );
}

function showNotice(message) {
  if (state.reducedMotion) return;

  notice.textContent = message;
  notice.style.display = "block";

  setTimeout(() => {
    notice.style.display = "none";
  }, 2200);
}

function showInstructions() {
  alert(
    "Choose a difficulty and category, then start a quiz. Questions are loaded from Open Trivia DB, with sample questions available as a fallback.",
  );
}

async function startQuiz() {
  saveSettings();
  showScreen(loadingScreen);

  try {
    state.questions = await fetchQuestions();
  } catch (error) {
    showError(error.message);
    return;
  }

  state.currentQuestionIndex = 0;
  state.score = 0;
  state.userAnswers = [];
  state.startTime = Date.now();

  showScreen(quizScreen);
  renderQuestion();
  startTimer();
}

async function fetchQuestions() {
  const params = new URLSearchParams({
    amount: state.questionCount,
    category: state.selectedCategoryId,
    difficulty: state.selectedDifficulty,
    type: "multiple",
  });
  const response = await fetch(`https://opentdb.com/api.php?${params}`);

  if (!response.ok) {
    throw new Error("Network request failed. Please try again.");
  }

  const data = await response.json();

  if (data.response_code === 1) {
    throw new Error("Not enough questions are available for this selection.");
  }

  if (data.response_code !== 0) {
    throw new Error("The quiz service could not return questions right now.");
  }

  return data.results.map((question) => ({
    category: decodeHTML(question.category),
    difficulty: question.difficulty,
    question: decodeHTML(question.question),
    correctAnswer: decodeHTML(question.correct_answer),
    incorrectAnswers: question.incorrect_answers.map((answer) =>
      decodeHTML(answer),
    ),
  }));
}

function startFallbackQuiz() {
  const matchingQuestions = localQuestions.filter(
    (question) => question.categoryId === state.selectedCategoryId,
  );

  state.questions =
    matchingQuestions.length > 0
      ? matchingQuestions.slice(0, state.questionCount)
      : localQuestions.slice(0, state.questionCount);
  state.currentQuestionIndex = 0;
  state.score = 0;
  state.userAnswers = [];
  state.startTime = Date.now();

  showScreen(quizScreen);
  renderQuestion();
  startTimer();
}

function renderQuestion() {
  const question = state.questions[state.currentQuestionIndex];
  const progress = ((state.currentQuestionIndex + 1) / state.questions.length) * 100;

  document.querySelector("#current-question-num").textContent =
    state.currentQuestionIndex + 1;
  document.querySelector("#progress-text").textContent =
    `${state.currentQuestionIndex + 1}/${state.questions.length}`;
  document.querySelector("#progress-fill").style.width = `${progress}%`;
  document.querySelector("#question-category-badge").textContent =
    question.category;
  document.querySelector("#question-text").textContent = question.question;
  statsText.textContent =
    question.difficulty ? `${capitalize(question.difficulty)} question` : "Quiz question";
  questionStats.classList.toggle("show", state.showStats);

  optionsContainer.innerHTML = "";
  document.querySelector("#explanation-container").style.display = "none";
  nextButton.disabled = true;
  nextButton.setAttribute("aria-disabled", "true");
  state.timeLeft = state.timerDuration;
  updateTimerDisplay();

  const answers = shuffleArray([
    ...question.incorrectAnswers,
    question.correctAnswer,
  ]);
  const letters = ["A", "B", "C", "D"];

  answers.forEach((answer, index) => {
    const option = document.createElement("li");
    option.className = "option";
    option.innerHTML = `
      <div class="option-letter">${letters[index]}</div>
      <div class="option-text">${answer}</div>
    `;
    option.addEventListener("click", () => {
      selectAnswer(option, answer, question.correctAnswer);
    });
    optionsContainer.appendChild(option);
  });
}

function selectAnswer(selectedOption, selectedAnswer, correctAnswer) {
  if (state.userAnswers[state.currentQuestionIndex] !== undefined) return;

  clearTimer();
  state.userAnswers[state.currentQuestionIndex] = selectedAnswer;

  document.querySelectorAll(".option").forEach((option) => {
    option.classList.add("disabled");

    if (option.querySelector(".option-text").textContent === correctAnswer) {
      option.classList.add("correct");
    }
  });

  if (selectedAnswer === correctAnswer) {
    state.score++;
  } else {
    selectedOption.classList.add("wrong");
  }

  document.querySelector("#explanation-text").textContent =
    selectedAnswer === correctAnswer
      ? `Correct! "${correctAnswer}" is the right answer.`
      : `The correct answer is "${correctAnswer}".`;
  document.querySelector("#explanation-container").style.display = "block";
  nextButton.disabled = false;
  nextButton.setAttribute("aria-disabled", "false");
}

function nextQuestion() {
  state.currentQuestionIndex++;

  if (state.currentQuestionIndex < state.questions.length) {
    renderQuestion();
    startTimer();
    return;
  }

  showResults();
}

function restartQuiz() {
  clearTimer();
  showScreen(welcomeScreen);
  state.currentQuestionIndex = 0;
  state.score = 0;
  state.userAnswers = [];
  state.totalTimeUsed = 0;
}

function showResults() {
  clearTimer();
  state.totalTimeUsed = state.startTime
    ? Math.floor((Date.now() - state.startTime) / 1000)
    : 0;
  showScreen(resultsScreen);

  const percentage = Math.round((state.score / state.questions.length) * 100);
  document.querySelector("#score-value").textContent =
    `${state.score}/${state.questions.length}`;
  document.querySelector("#performance-message").textContent =
    getPerformanceMessage(percentage);
  document.querySelector("#time-used").textContent =
    state.totalTimeUsed > 0 ? `Completed in ${state.totalTimeUsed} seconds` : "";

  renderAnswerReview();
}

function showError(message) {
  document.querySelector("#error-message").textContent = message;
  showScreen(errorScreen);
}

function showScreen(activeScreen) {
  [welcomeScreen, loadingScreen, errorScreen, quizScreen, resultsScreen].forEach(
    (screen) => {
      screen.style.display = screen === activeScreen ? "block" : "none";
    },
  );
}

function startTimer() {
  clearTimer();

  if (state.timerDuration === 0) {
    updateTimerDisplay();
    return;
  }

  state.timer = setInterval(() => {
    state.timeLeft--;
    updateTimerDisplay();

    if (state.timeLeft <= 0) {
      handleTimeExpired();
    }
  }, 1000);
}

function clearTimer() {
  if (state.timer) {
    clearInterval(state.timer);
    state.timer = null;
  }
}

function updateTimerDisplay() {
  timeLeftText.textContent = state.timeLeft;
  timerDisplay.style.display = state.timerDuration === 0 ? "none" : "inline-flex";
  timerDisplay.classList.toggle(
    "warning",
    state.timerDuration > 0 && state.timeLeft <= 5 && state.timeLeft > 2,
  );
  timerDisplay.classList.toggle(
    "danger",
    state.timerDuration > 0 && state.timeLeft <= 2,
  );
}

function handleTimeExpired() {
  clearTimer();

  if (state.userAnswers[state.currentQuestionIndex] !== undefined) return;

  const question = state.questions[state.currentQuestionIndex];
  state.userAnswers[state.currentQuestionIndex] = null;

  document.querySelectorAll(".option").forEach((option) => {
    option.classList.add("disabled");

    if (option.querySelector(".option-text").textContent === question.correctAnswer) {
      option.classList.add("correct");
    }
  });

  document.querySelector("#explanation-text").textContent =
    `Time is up. The correct answer is "${question.correctAnswer}".`;
  document.querySelector("#explanation-container").style.display = "block";
  nextButton.disabled = false;
  nextButton.setAttribute("aria-disabled", "false");
}

function renderAnswerReview() {
  const reviewItems = document.querySelector("#review-items");
  reviewItems.innerHTML = "";

  state.questions.forEach((question, index) => {
    const userAnswer = state.userAnswers[index];
    const isCorrect = userAnswer === question.correctAnswer;
    const item = document.createElement("li");

    item.className = `review-item ${isCorrect ? "correct" : "incorrect"}`;
    item.innerHTML = `
      <p class="review-question">
        <span class="review-status ${isCorrect ? "correct" : "incorrect"}">
          ${isCorrect ? "✓" : "✗"}
        </span>
        ${question.question}
      </p>
      <p class="review-answer">
        ${
          isCorrect
            ? `You answered correctly: ${userAnswer}`
            : `Your answer: <span class="user-answer">${userAnswer || "No answer"}</span> | Correct: <span class="correct-answer">${question.correctAnswer}</span>`
        }
      </p>
    `;

    reviewItems.appendChild(item);
  });
}

function getPerformanceMessage(percentage) {
  if (percentage >= 90) {
    return "Outstanding! You truly are a quiz master!";
  }

  if (percentage >= 70) {
    return "Great job! You have solid knowledge.";
  }

  if (percentage >= 50) {
    return "Good effort! Keep learning and improving.";
  }

  return "Keep practicing! Every attempt makes you better.";
}

function shareResults() {
  const text = `I scored ${state.score}/${state.questions.length} on NeoQuiz (${capitalize(state.selectedDifficulty)} - ${state.selectedCategoryLabel})!`;

  if (navigator.share) {
    navigator.share({
      title: "My Quiz Results",
      text,
      url: window.location.href,
    });
    return;
  }

  navigator.clipboard.writeText(text).then(() => {
    showNotice("Results copied to clipboard.");
  });
}

function loadSettings() {
  const savedTheme = localStorage.getItem("neoQuizTheme");
  const savedTimer = localStorage.getItem("neoQuizTimer");
  const savedStats = localStorage.getItem("neoQuizShowStats");
  const savedMotion = localStorage.getItem("neoQuizReducedMotion");
  const savedDifficulty = localStorage.getItem("neoQuizDifficulty");
  const savedCategoryId = localStorage.getItem("neoQuizCategoryId");
  const savedCategoryLabel = localStorage.getItem("neoQuizCategoryLabel");

  if (savedTheme) state.currentTheme = savedTheme;
  if (savedTimer !== null) state.timerDuration = Number(savedTimer);
  if (savedStats !== null) state.showStats = savedStats === "true";
  if (savedMotion !== null) state.reducedMotion = savedMotion === "true";
  if (savedDifficulty) state.selectedDifficulty = savedDifficulty;
  if (savedCategoryId) state.selectedCategoryId = Number(savedCategoryId);
  if (savedCategoryLabel) state.selectedCategoryLabel = savedCategoryLabel;
}

function saveSettings() {
  localStorage.setItem("neoQuizTheme", state.currentTheme);
  localStorage.setItem("neoQuizTimer", state.timerDuration);
  localStorage.setItem("neoQuizShowStats", state.showStats);
  localStorage.setItem("neoQuizReducedMotion", state.reducedMotion);
  localStorage.setItem("neoQuizDifficulty", state.selectedDifficulty);
  localStorage.setItem("neoQuizCategoryId", state.selectedCategoryId);
  localStorage.setItem("neoQuizCategoryLabel", state.selectedCategoryLabel);
}

function updateSettingsUI() {
  applyTheme(state.currentTheme);

  showStatsToggle.checked = state.showStats;
  reduceMotionToggle.checked = state.reducedMotion;
  document.body.classList.toggle("reduced-motion", state.reducedMotion);

  timerOptions.forEach((option) => {
    const isSelected = Number(option.dataset.time) === state.timerDuration;
    option.classList.toggle("active", isSelected);
    option.setAttribute("aria-checked", isSelected ? "true" : "false");
  });

  difficultyCards.forEach((card) => {
    const isSelected = card.dataset.difficulty === state.selectedDifficulty;
    card.classList.toggle("active", isSelected);
    card.setAttribute("aria-checked", isSelected ? "true" : "false");
  });
}

function toggleSettings() {
  const isOpen = settingsPanel.classList.toggle("show");
  settingsPanel.hidden = !isOpen;
  settingsButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
}

function toggleTheme() {
  const themes = ["default", "dark", "high-contrast", "minimal"];
  const currentIndex = themes.indexOf(state.currentTheme);
  const nextTheme = themes[(currentIndex + 1) % themes.length];
  changeTheme(nextTheme);
}

function changeTheme(theme) {
  state.currentTheme = theme;
  applyTheme(theme);
  saveSettings();
  showNotice(`Theme set to ${theme.replace("-", " ")}`);
}

function applyTheme(theme) {
  document.body.classList.remove(
    "theme-dark",
    "theme-high-contrast",
    "theme-minimal",
  );

  if (theme !== "default") {
    document.body.classList.add(`theme-${theme}`);
  }

  themeOptions.forEach((option) => {
    const isSelected = option.dataset.theme === theme;
    option.classList.toggle("active", isSelected);
    option.setAttribute("aria-checked", isSelected ? "true" : "false");
  });
}

function changeTimer(duration) {
  state.timerDuration = duration;
  state.timeLeft = duration;
  updateSummary();
  updateSettingsUI();
  updateTimerDisplay();
  saveSettings();
  showNotice(duration === 0 ? "Timer turned off" : `Timer set to ${duration}s`);
}

function toggleQuestionStats() {
  state.showStats = !state.showStats;
  questionStats.classList.toggle("show", state.showStats);
  saveSettings();
}

function toggleReducedMotion() {
  state.reducedMotion = !state.reducedMotion;
  document.body.classList.toggle("reduced-motion", state.reducedMotion);
  saveSettings();
}

function quickStart() {
  state.selectedDifficulty = "easy";
  state.timerDuration = 15;
  updateSettingsUI();
  updateSummary();
  saveSettings();
  settingsPanel.classList.remove("show");
  settingsPanel.hidden = true;
  settingsButton.setAttribute("aria-expanded", "false");
  startQuiz();
}

document.addEventListener("click", (event) => {
  if (
    !event.target.closest("#settings-panel") &&
    !event.target.closest("#settings-btn")
  ) {
    settingsPanel.classList.remove("show");
    settingsPanel.hidden = true;
    settingsButton.setAttribute("aria-expanded", "false");
  }
});

function shuffleArray(items) {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ];
  }

  return shuffled;
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function decodeHTML(value) {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = value;
  return textarea.value;
}

startButton.addEventListener("click", startQuiz);
instructionsButton.addEventListener("click", showInstructions);
nextButton.addEventListener("click", nextQuestion);
restartButton.addEventListener("click", restartQuiz);
tryAgainButton.addEventListener("click", restartQuiz);
shareResultsButton.addEventListener("click", shareResults);
fallbackButton.addEventListener("click", startFallbackQuiz);
backToSetupButton.addEventListener("click", restartQuiz);
settingsButton.addEventListener("click", toggleSettings);
themeToggle.addEventListener("click", toggleTheme);
showStatsToggle.addEventListener("change", toggleQuestionStats);
reduceMotionToggle.addEventListener("change", toggleReducedMotion);
quickStartButton.addEventListener("click", quickStart);
themeOptions.forEach((option) => {
  option.addEventListener("click", () => changeTheme(option.dataset.theme));
});
timerOptions.forEach((option) => {
  option.addEventListener("click", () => changeTimer(Number(option.dataset.time)));
});

init();

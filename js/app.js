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
};

const categoryGrid = document.querySelector("#category-grid");
const difficultyCards = document.querySelectorAll(".difficulty-card");
const startButton = document.querySelector("#start-btn");
const instructionsButton = document.querySelector("#instructions-btn");
const notice = document.querySelector("#accessibility-notice");
const welcomeScreen = document.querySelector("#welcome-screen");
const quizScreen = document.querySelector("#quiz-screen");
const optionsContainer = document.querySelector("#options-container");
const nextButton = document.querySelector("#next-btn");
const restartButton = document.querySelector("#restart-btn");

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
  showNotice(`Difficulty set to ${capitalize(level)}`);
}

function selectCategory(id, label) {
  state.selectedCategoryId = id;
  state.selectedCategoryLabel = label;
  renderCategories();
  updateSummary();
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
  notice.textContent = message;
  notice.style.display = "block";

  setTimeout(() => {
    notice.style.display = "none";
  }, 2200);
}

function showInstructions() {
  alert(
    "Choose a difficulty and a category. The quiz engine will be added in the next milestone.",
  );
}

function startQuiz() {
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

  welcomeScreen.style.display = "none";
  quizScreen.style.display = "block";
  renderQuestion();
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

  optionsContainer.innerHTML = "";
  document.querySelector("#explanation-container").style.display = "none";
  nextButton.disabled = true;
  nextButton.setAttribute("aria-disabled", "true");

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
    return;
  }

  showNotice(`Quiz complete. Score: ${state.score}/${state.questions.length}`);
  restartQuiz();
}

function restartQuiz() {
  quizScreen.style.display = "none";
  welcomeScreen.style.display = "block";
  state.currentQuestionIndex = 0;
  state.score = 0;
  state.userAnswers = [];
}

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

renderCategories();
bindDifficultyCards();
updateSummary();

startButton.addEventListener("click", startQuiz);
instructionsButton.addEventListener("click", showInstructions);
nextButton.addEventListener("click", nextQuestion);
restartButton.addEventListener("click", restartQuiz);

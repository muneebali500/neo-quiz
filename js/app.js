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
};

const categoryGrid = document.querySelector("#category-grid");
const difficultyCards = document.querySelectorAll(".difficulty-card");
const startButton = document.querySelector("#start-btn");
const instructionsButton = document.querySelector("#instructions-btn");
const notice = document.querySelector("#accessibility-notice");

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

function handleStartClick() {
  showNotice("Quiz gameplay will be added in the next build.");
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

renderCategories();
bindDifficultyCards();
updateSummary();

startButton.addEventListener("click", handleStartClick);
instructionsButton.addEventListener("click", showInstructions);

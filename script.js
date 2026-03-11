window.NeoQuizApp = window.NeoQuizApp || {};

(function (app) {
  // ─── Quiz Categories ───────────────────────────────────────────────────
  app.CATEGORIES = [
    { id: 9, name: "General", icon: "🌍", label: "General Knowledge" },
    { id: 10, name: "Books", icon: "📚", label: "Books & Literature" },
    { id: 11, name: "Film", icon: "🎬", label: "Film & Cinema" },
    { id: 12, name: "Music", icon: "🎵", label: "Music" },
    { id: 17, name: "Science", icon: "🔬", label: "Science & Nature" },
    { id: 18, name: "Computers", icon: "💻", label: "Computers & Tech" },
    { id: 21, name: "Sports", icon: "⚽", label: "Sports" },
    { id: 22, name: "Geography", icon: "🗺️", label: "Geography" },
    { id: 23, name: "History", icon: "🏛️", label: "History" },
    { id: 25, name: "Art", icon: "🎨", label: "Art & Culture" },
  ];

  // ─── State ─────────────────────────────────────────────────────────────
  app.state = {
    questions: [],
    currentQuestionIndex: 0,
    score: 0,
    timeLeft: 15,
    timer: null,
    userAnswers: [],
    totalTimeUsed: 0,
    startTime: null,

    currentTheme: "default",
    timerDuration: 15,
    showStats: true,
    keyboardShortcutsEnabled: true,
    reducedMotion: false,

    selectedDifficulty: "medium",
    selectedCategoryId: 9,
    selectedCategoryLabel: "General Knowledge",
  };

  // ─── DOM ───────────────────────────────────────────────────────────────
  app.dom = {};

  app.cacheDom = function () {
    app.dom.welcomeScreen = document.getElementById("welcome-screen");
    app.dom.loadingScreen = document.getElementById("loading-screen");
    app.dom.quizScreen = document.getElementById("quiz-screen");
    app.dom.resultsScreen = document.getElementById("results-screen");
    app.dom.settingsPanel = document.getElementById("settings-panel");
    app.dom.questionStats = document.getElementById("question-stats");
    app.dom.shortcutHint = document.getElementById("shortcut-hint");
    app.dom.quizShortcutHint = document.getElementById("quiz-shortcut-hint");
    app.dom.accessibilityNotice = document.getElementById(
      "accessibility-notice",
    );
  };

  // ─── Utilities ─────────────────────────────────────────────────────────
  app.showAccessibilityNotice = function (msg) {
    if (app.state.reducedMotion) return;

    app.dom.accessibilityNotice.textContent = msg;
    app.dom.accessibilityNotice.style.display = "block";

    setTimeout(() => {
      app.dom.accessibilityNotice.style.display = "none";
    }, 3000);
  };

  app.decodeHTML = function (html) {
    const t = document.createElement("textarea");
    t.innerHTML = html;
    return t.value;
  };

  app.shuffleArray = function (arr) {
    const s = [...arr];
    for (let i = s.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [s[i], s[j]] = [s[j], s[i]];
    }
    return s;
  };

  app.capitalize = function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // ─── Init ──────────────────────────────────────────────────────────────
  app.init = function () {
    app.cacheDom();

    app.loadSettings();
    app.updateUIFromSettings();
    app.setupKeyboardShortcuts();
    app.renderCategories();
    app.updateConfigSummary();

    app.showAccessibilityNotice(
      "Use keyboard shortcuts: 1-4 for answers, Space for next",
    );

    document.getElementById("total-questions").textContent = "10";
    document.getElementById("total-time").textContent =
      app.state.timerDuration * 10;
    document.getElementById("header-difficulty").textContent = app.capitalize(
      app.state.selectedDifficulty,
    );
  };

  // ─── Render Categories ─────────────────────────────────────────────────
  app.renderCategories = function () {
    const grid = document.getElementById("category-grid");
    grid.innerHTML = "";

    app.CATEGORIES.forEach((cat) => {
      const card = document.createElement("div");
      card.className =
        "category-card" +
        (cat.id === app.state.selectedCategoryId ? " active" : "");
      card.dataset.id = cat.id;
      card.onclick = () => app.selectCategory(cat.id, cat.label);

      card.innerHTML = `
        <div class="active-check"><i class="fas fa-check"></i></div>
        <span class="cat-icon">${cat.icon}</span>
        <div class="cat-name">${cat.name}</div>
      `;

      grid.appendChild(card);
    });
  };

  // ─── Select Difficulty ─────────────────────────────────────────────────
  app.selectDifficulty = function (level) {
    app.state.selectedDifficulty = level;

    document
      .querySelectorAll(".difficulty-card")
      .forEach((c) => c.classList.remove("active"));

    document
      .querySelector(`.difficulty-card[data-diff="${level}"]`)
      .classList.add("active");

    document.getElementById("header-difficulty").textContent =
      app.capitalize(level);

    app.updateConfigSummary();
    app.showAccessibilityNotice(`Difficulty set to ${app.capitalize(level)}`);
  };

  // ─── Select Category ───────────────────────────────────────────────────
  app.selectCategory = function (id, label) {
    app.state.selectedCategoryId = id;
    app.state.selectedCategoryLabel = label;

    document
      .querySelectorAll(".category-card")
      .forEach((c) => c.classList.remove("active"));

    document
      .querySelector(`.category-card[data-id="${id}"]`)
      .classList.add("active");

    app.updateConfigSummary();
    app.showAccessibilityNotice(`Category set to ${label}`);
  };

  // ─── Update Config Summary ─────────────────────────────────────────────
  app.updateConfigSummary = function () {
    const diffIcons = { easy: "🌱", medium: "⚡", hard: "🔥" };
    const cat = app.CATEGORIES.find(
      (c) => c.id === app.state.selectedCategoryId,
    );

    document.getElementById("summary-difficulty").innerHTML =
      `${diffIcons[app.state.selectedDifficulty]} ${app.capitalize(app.state.selectedDifficulty)}`;

    document.getElementById("summary-category").innerHTML =
      `${cat ? cat.icon : "🌍"} ${app.state.selectedCategoryLabel}`;
  };

  // ─── Settings ──────────────────────────────────────────────────────────
  app.loadSettings = function () {
    const savedTheme = localStorage.getItem("quizTheme");
    const savedTimer = localStorage.getItem("quizTimer");
    const savedStats = localStorage.getItem("showStats");
    const savedShortcuts = localStorage.getItem("keyboardShortcuts");
    const savedMotion = localStorage.getItem("reducedMotion");
    const savedDiff = localStorage.getItem("quizDifficulty");
    const savedCatId = localStorage.getItem("quizCategoryId");
    const savedCatLabel = localStorage.getItem("quizCategoryLabel");

    if (savedTheme) app.state.currentTheme = savedTheme;
    if (savedTimer) app.state.timerDuration = parseInt(savedTimer, 10);
    if (savedStats !== null) app.state.showStats = savedStats === "true";
    if (savedShortcuts !== null) {
      app.state.keyboardShortcutsEnabled = savedShortcuts === "true";
    }
    if (savedMotion !== null) app.state.reducedMotion = savedMotion === "true";
    if (savedDiff) app.state.selectedDifficulty = savedDiff;
    if (savedCatId) app.state.selectedCategoryId = parseInt(savedCatId, 10);
    if (savedCatLabel) app.state.selectedCategoryLabel = savedCatLabel;
  };

  app.updateUIFromSettings = function () {
    document.body.classList.remove(
      "theme-dark",
      "theme-high-contrast",
      "theme-minimal",
    );

    if (app.state.currentTheme !== "default") {
      document.body.classList.add(`theme-${app.state.currentTheme}`);
    }

    document.querySelectorAll(".theme-option").forEach((o) => {
      o.classList.toggle("active", o.dataset.theme === app.state.currentTheme);
    });

    document.querySelectorAll(".timer-option").forEach((o) => {
      o.classList.toggle(
        "active",
        parseInt(o.dataset.time, 10) === app.state.timerDuration,
      );
    });

    document.getElementById("show-stats").checked = app.state.showStats;
    document.getElementById("keyboard-shortcuts").checked =
      app.state.keyboardShortcutsEnabled;
    document.getElementById("reduce-motion").checked = app.state.reducedMotion;

    document.body.classList.toggle("reduced-motion", app.state.reducedMotion);
    app.dom.shortcutHint.classList.toggle(
      "show",
      app.state.keyboardShortcutsEnabled,
    );

    if (!app.state.keyboardShortcutsEnabled) {
      app.dom.quizShortcutHint.classList.remove("show");
    }
  };

  app.toggleTheme = function () {
    const themes = ["default", "dark", "high-contrast", "minimal"];
    const currentIndex = themes.indexOf(app.state.currentTheme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    app.changeTheme(nextTheme);
  };

  app.changeTheme = function (theme) {
    app.state.currentTheme = theme;
    localStorage.setItem("quizTheme", theme);
    app.updateUIFromSettings();
    app.showAccessibilityNotice(`Theme: ${theme}`);
  };

  app.toggleSettings = function () {
    app.dom.settingsPanel.classList.toggle("show");
  };

  document.addEventListener("click", (e) => {
    if (
      !e.target.closest(".settings-btn") &&
      !e.target.closest(".settings-panel")
    ) {
      const panel = document.getElementById("settings-panel");
      if (panel) panel.classList.remove("show");
    }
  });

  app.changeTimer = function (duration) {
    app.state.timerDuration = duration;
    localStorage.setItem("quizTimer", duration);
    app.updateUIFromSettings();
    document.getElementById("total-time").textContent = duration * 10;
    app.showAccessibilityNotice(
      `Timer: ${duration === 0 ? "off" : duration + "s"}`,
    );
  };

  app.toggleQuestionStats = function () {
    app.state.showStats = !app.state.showStats;
    localStorage.setItem("showStats", app.state.showStats);
    app.dom.questionStats.classList.toggle("show", app.state.showStats);
  };

  app.toggleKeyboardShortcuts = function () {
    app.state.keyboardShortcutsEnabled = !app.state.keyboardShortcutsEnabled;
    localStorage.setItem(
      "keyboardShortcuts",
      app.state.keyboardShortcutsEnabled,
    );

    if (app.state.keyboardShortcutsEnabled) {
      app.dom.shortcutHint.classList.add("show");
      app.setupKeyboardShortcuts();
    } else {
      app.dom.shortcutHint.classList.remove("show");
      app.dom.quizShortcutHint.classList.remove("show");
      app.removeKeyboardShortcuts();
    }
  };

  app.toggleReducedMotion = function () {
    app.state.reducedMotion = !app.state.reducedMotion;
    localStorage.setItem("reducedMotion", app.state.reducedMotion);
    document.body.classList.toggle("reduced-motion", app.state.reducedMotion);
  };

  app.quickStart = function () {
    app.state.selectedDifficulty = "easy";
    app.state.timerDuration = 10;

    localStorage.setItem("quizTimer", app.state.timerDuration);
    app.updateUIFromSettings();
    app.dom.settingsPanel.classList.remove("show");

    app.startQuiz(5);
  };

  // ─── Keyboard Shortcuts ────────────────────────────────────────────────
  app.setupKeyboardShortcuts = function () {
    document.removeEventListener("keydown", app.handleKeyboardShortcuts);
    if (!app.state.keyboardShortcutsEnabled) return;
    document.addEventListener("keydown", app.handleKeyboardShortcuts);
  };

  app.removeKeyboardShortcuts = function () {
    document.removeEventListener("keydown", app.handleKeyboardShortcuts);
  };

  app.handleKeyboardShortcuts = function (event) {
    if (
      event.target.tagName === "INPUT" ||
      event.target.tagName === "TEXTAREA"
    ) {
      return;
    }

    switch (event.key) {
      case " ":
        event.preventDefault();
        if (app.dom.welcomeScreen.style.display !== "none") {
          app.startQuiz();
        } else if (
          app.dom.quizScreen.style.display !== "none" &&
          !document.getElementById("next-btn").disabled
        ) {
          app.nextQuestion();
        }
        break;

      case "n":
      case "N":
        if (
          app.dom.quizScreen.style.display !== "none" &&
          !document.getElementById("next-btn").disabled
        ) {
          app.nextQuestion();
        }
        break;

      case "r":
      case "R":
        if (app.dom.quizScreen.style.display !== "none") {
          app.restartQuiz();
        }
        break;

      case "1":
      case "2":
      case "3":
      case "4":
        if (
          app.dom.quizScreen.style.display !== "none" &&
          app.state.userAnswers[app.state.currentQuestionIndex] === undefined
        ) {
          const opt =
            document.querySelectorAll(".option")[parseInt(event.key, 10) - 1];
          if (opt) opt.click();
        }
        break;

      case "Escape":
        app.dom.settingsPanel.classList.remove("show");
        app.closePopup();
        break;

      case "t":
      case "T":
        if (event.ctrlKey) {
          event.preventDefault();
          app.toggleTheme();
        }
        break;
    }
  };

  // ─── Instructions ──────────────────────────────────────────────────────
  app.showInstructions = function () {
    alert(`HOW TO PLAY:

🎯 SETUP:
• Choose a difficulty: Easy / Medium / Hard
• Pick one of 10 categories

🎮 CONTROLS:
• Mouse: Click options to select answers
• 1-4: Select answer by keyboard
• Space / N: Next question
• R: Restart

⚙️ SETTINGS (gear icon):
• Themes, Timer duration, Stats toggle

Good luck!`);
  };

  window.onload = app.init;
})(window.NeoQuizApp);

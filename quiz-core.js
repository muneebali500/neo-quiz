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
    app.showPopup();

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

  window.onload = app.init;
})(window.NeoQuizApp);

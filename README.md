# NeoQuiz

NeoQuiz is a modern trivia quiz app built with HTML, CSS, and vanilla
JavaScript.

## Day 1 Scope

- Create a structured project with separate HTML, CSS, and JavaScript files.
- Build the original NeoQuiz visual foundation.
- Add the welcome screen, header stats, difficulty cards, category cards, and
  selected quiz summary.
- Add lightweight JavaScript for selecting difficulty and category.

Gameplay, API loading, timer logic, result review, settings, and persistence are
planned for later milestones.

## Day 2 Scope

- Add the quiz gameplay screen.
- Add a small local question bank for early testing.
- Render questions and shuffled answer options.
- Highlight correct and incorrect answers.
- Add next-question and restart controls.

## Day 3 Scope

- Add the final results screen.
- Show score and performance feedback after a round.
- Render an answer review with correct and incorrect answers.
- Add try-again and share-results actions.

## Day 4 Scope

- Load fresh quiz questions from the Open Trivia DB API.
- Add loading and error screens.
- Decode HTML entities returned by the API.
- Keep local sample questions as a fallback when the API is unavailable.

## Day 5 Scope

- Add the settings panel.
- Add default, dark, high-contrast, and minimal themes.
- Add configurable per-question timer behavior.
- Persist theme, timer, stats, difficulty, and category preferences.
- Add quick-start and reduced-motion options.

## Project Structure

```text
neo-quiz/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── app.js
└── README.md
```

## Run Locally

Open `index.html` in a browser.

// Set the starting time in seconds (Change this in the code)
const START_TIME = 600; // 10 minutes

let startTime = localStorage.getItem("startTime");
let elapsedTime = parseInt(localStorage.getItem("elapsedTime")) || 0;
let timerRunning = localStorage.getItem("timerRunning") === "true";
let interval;

const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");

// Update Timer Display
function updateTimer() {
    let remainingTime = Math.max(START_TIME - elapsedTime, 0);
    let minutes = Math.floor(remainingTime / 60);
    let seconds = remainingTime % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

// Start Timer
function startTimer() {
    if (!timerRunning) {
        startTime = Date.now() - elapsedTime * 1000;
        localStorage.setItem("startTime", startTime);
        localStorage.setItem("timerRunning", "true");

        interval = setInterval(() => {
            elapsedTime = Math.floor((Date.now() - startTime) / 1000);
            localStorage.setItem("elapsedTime", elapsedTime);
            updateTimer();
        }, 1000);

        timerRunning = true;
    }
}

// Ensure the timer starts correctly when the button is clicked
if (startBtn) {
    startBtn.addEventListener("click", startTimer);
}

// Initialize Timer
updateTimer();

// Load Persistent Hints
const hintsDisplay = document.getElementById("hintsDisplay");
const revealedHints = JSON.parse(localStorage.getItem("revealedHints")) || {};

function showHint(hintId, hintText) {
    if (!revealedHints[hintId]) {
        revealedHints[hintId] = hintText;
        localStorage.setItem("revealedHints", JSON.stringify(revealedHints));
    }

    if (!document.getElementById(hintId)) {
        const hintElement = document.createElement("p");
        hintElement.textContent = hintText;
        hintElement.id = hintId;
        hintsDisplay.appendChild(hintElement);
    }
}

// Load previously revealed hints
document.addEventListener("DOMContentLoaded", () => {
    Object.keys(revealedHints).forEach(hintId => {
        showHint(hintId, revealedHints[hintId]);
    });
});

// Attach event listeners to hint buttons
document.querySelectorAll(".hint-btn").forEach(button => {
    button.addEventListener("click", () => {
        const hintText = button.getAttribute("data-hint");
        const hintId = button.getAttribute("data-hint-id");

        if (revealedHints[hintId]) return;

        if (confirm("Are you sure you want to reveal this hint?") &&
            confirm("This will use up a hint. Are you really sure?")) {
            showHint(hintId, hintText);
        }
    });
});

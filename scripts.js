// Persistent Timer
let startTime = localStorage.getItem("startTime");
let elapsedTime = parseInt(localStorage.getItem("elapsedTime")) || 0;
let timerRunning = localStorage.getItem("timerRunning") === "true";
let interval;

const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");

function updateTimer() {
    let time = elapsedTime;
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

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

startBtn.addEventListener("click", startTimer);
updateTimer();

// Hint Buttons with Double Confirmation
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

// Load existing hints on page load
document.addEventListener("DOMContentLoaded", () => {
    Object.keys(revealedHints).forEach(hintId => {
        showHint(hintId, revealedHints[hintId]);
    });
});

document.querySelectorAll(".hint-btn").forEach(button => {
    button.addEventListener("click", () => {
        const hintText = button.getAttribute("data-hint");
        const hintId = button.getAttribute("data-hint-id");

        if (revealedHints[hintId]) return;

        const confirmFirst = confirm("Are you sure you want to reveal this hint?");
        if (confirmFirst) {
            const confirmSecond = confirm("This will use up a hint. Are you really sure?");
            if (confirmSecond) {
                showHint(hintId, hintText);
            }
        }
    });
});

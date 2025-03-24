// Persistent Timer
let startTime = localStorage.getItem("startTime");
let elapsedTime = parseInt(localStorage.getItem("elapsedTime")) || 0;
let timerRunning = localStorage.getItem("timerRunning") === "true";
let interval;

const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");

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

function pauseTimer() {
    clearInterval(interval);
    localStorage.setItem("timerRunning", "false");
    timerRunning = false;
}

startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);

if (timerRunning) {
    startTimer();
} else {
    updateTimer();
}

// Hint Buttons with Double Confirmation
const hintsDisplay = document.getElementById("hintsDisplay");

// Load revealed hints from local storage
const revealedHints = JSON.parse(localStorage.getItem("revealedHints")) || {};

function showHint(hintId, hintText) {
    revealedHints[hintId] = hintText;
    localStorage.setItem("revealedHints", JSON.stringify(revealedHints));

    const hintElement = document.createElement("p");
    hintElement.textContent = hintText;
    hintsDisplay.appendChild(hintElement);
}

document.querySelectorAll(".hint-btn").forEach(button => {
    const hintId = button.getAttribute("data-hint-id");
    
    // If hint is already revealed, display it
    if (revealedHints[hintId]) {
        showHint(hintId, revealedHints[hintId]);
    }

    button.addEventListener("click", () => {
        const hintText = button.getAttribute("data-hint");
        
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

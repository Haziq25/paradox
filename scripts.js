const countdownDuration = 30 * 60; // 30 minutes in seconds
const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");

function startTimer() {
    if (!localStorage.getItem("escapeRoomStartTime")) {
        const now = Math.floor(Date.now() / 1000);
        localStorage.setItem("escapeRoomStartTime", now);
    }
    updateTimer();
}

function updateTimer() {
    const startTime = localStorage.getItem("escapeRoomStartTime");

    if (!startTime) return;

    const interval = setInterval(() => {
        const now = Math.floor(Date.now() / 1000);
        const elapsedTime = now - startTime;
        const timeLeft = countdownDuration - elapsedTime;

        if (timeLeft <= 0) {
            clearInterval(interval);
            timerDisplay.textContent = "TIME'S UP!";
            return;
        }

        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }, 1000);
}

startBtn.addEventListener("click", () => {
    if (!localStorage.getItem("escapeRoomStartTime")) {
        startTimer();
    }
});

// Ensure the timer continues after refresh
updateTimer();

const countdownDuration = 30 * 60; // 30 minutes in seconds
const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const adminUnlockBtn = document.getElementById("adminUnlockBtn");

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

function revealHint(number) {
    if (confirm(`Are you sure you want to reveal Hint ${number}?`)) {
        document.getElementById(`hint${number}`).style.display = "block";
        localStorage.setItem(`hint${number}`, "visible");
    }
}

function restoreHints() {
    for (let i = 1; i <= 3; i++) {
        if (localStorage.getItem(`hint${i}`) === "visible") {
            document.getElementById(`hint${i}`).style.display = "block";
        }
    }
}

// Reset Timer (Admin Only)
function resetTimer() {
    if (confirm("Are you sure you want to reset the timer and clear all hints?")) {
        localStorage.clear(); // Clears all stored data (timer + hints)
        location.reload(); // Reloads the page
    }
}
// Unlock Admin Controls
adminUnlockBtn.addEventListener("click", () => {
    const passcode = prompt("Enter admin password:");
    if (passcode === "admin123") { // Change this password as needed
        resetBtn.classList.remove("hidden");
        alert("Admin mode activated.");
    } else {
        alert("Incorrect password!");
    }
});

resetBtn.addEventListener("click", resetTimer);
startBtn.addEventListener("click", () => {
    if (!localStorage.getItem("escapeRoomStartTime")) {
        startTimer();
    }
});

// Ensure timer and hints persist after refresh
updateTimer();
restoreHints();

/***** CONFIGURATION *****/
const gameDuration = 10 * 60; // Set game duration in seconds (e.g., 10 minutes)
const hints = {
    1: { text: "Look under the table!", password: "clue1" },
    2: { text: "Check the bookshelf for a hidden clue.", password: "clue2" },
    3: { text: "The lock combination is related to the paintings.", password: "clue3" }
};
/************************/

let countdown;

function startTimer() {
    const startTime = localStorage.getItem("startTime");

    if (!startTime) {
        const now = Math.floor(Date.now() / 1000);
        localStorage.setItem("startTime", now);
    }

    updateTimer();
    countdown = setInterval(updateTimer, 1000);
}

function updateTimer() {
    const startTime = parseInt(localStorage.getItem("startTime"));
    if (!startTime) return;

    const now = Math.floor(Date.now() / 1000);
    let timeLeft = gameDuration - (now - startTime);

    if (timeLeft <= 0) {
        clearInterval(countdown);
        localStorage.removeItem("startTime");
        document.getElementById("timer").textContent = "00:00";
        alert("Time's up!");
        return;
    }

    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    document.getElementById("timer").textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Restore timer on reload
if (localStorage.getItem("startTime")) {
    startTimer();
}

function requestHint(hintNumber) {
    let inputPassword = document.getElementById(`password${hintNumber}`).value;
    if (inputPassword === hints[hintNumber].password) {
        document.getElementById(`hint${hintNumber}`).textContent = hints[hintNumber].text;
        document.getElementById(`hint${hintNumber}`).classList.remove("hidden");
    } else {
        alert("Incorrect password!");
    }
}

// Generate QR Code
new QRCode(document.getElementById("qrcode"), {
    text: window.location.href,
    width: 128,
    height: 128
});

let countdown;
let timeLeft = localStorage.getItem("timeLeft") ? parseInt(localStorage.getItem("timeLeft")) : 600; // 10 minutes
let running = localStorage.getItem("running") === "true";

function startTimer() {
    if (!running) {
        running = true;
        localStorage.setItem("running", "true");
        countdown = setInterval(updateTimer, 1000);
    }
}

function updateTimer() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    document.getElementById("timer").textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    if (timeLeft <= 0) {
        clearInterval(countdown);
        alert("Time's up!");
        localStorage.clear();
    } else {
        timeLeft--;
        localStorage.setItem("timeLeft", timeLeft);
    }
}

// Restore timer state if page is refreshed
if (running) {
    startTimer();
}

// Hint password system
const hintPasswords = {
    1: "clue1",
    2: "clue2",
    3: "clue3"
};

function requestHint(hintNumber) {
    let inputPassword = document.getElementById(`password${hintNumber}`).value;
    if (inputPassword === hintPasswords[hintNumber]) {
        document.getElementById(`hint${hintNumber}`).classList.remove("hidden");
    } else {
        alert("Incorrect password!");
    }
}

// Generate QR Code for easy access
const qrCode = new QRCode(document.getElementById("qrcode"), {
    text: window.location.href,
    width: 128,
    height: 128
});

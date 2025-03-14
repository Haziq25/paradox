document.addEventListener("DOMContentLoaded", function () {
    /***** CONFIGURATION *****/
    const gameDuration = 30 * 60; // Set game duration in seconds (e.g., 10 minutes)
    const hints = {
        1: { text: "Look under the table!", password: "clue1" },
        2: { text: "Check the bookshelf for a hidden clue.", password: "clue2" },
        3: { text: "The lock combination is related to the paintings.", password: "clue3" }
    };
    /************************/

    let countdown;
    const timerElement = document.getElementById("timer");
    const startButton = document.getElementById("startButton");
    const hintsContainer = document.getElementById("hints-container");

    function startTimer() {
        if (!localStorage.getItem("startTime")) {
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
            timerElement.textContent = "00:00";
            alert("Time's up!");
            return;
        }

        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
        timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    function generateHints() {
        hintsContainer.innerHTML = ""; // Clear old hints
        Object.keys(hints).forEach((hintNumber) => {
            const hintDiv = document.createElement("div");
            hintDiv.classList.add("hint-container");
            hintDiv.innerHTML = `
                <button class="hint-btn" data-hint="${hintNumber}">Hint ${hintNumber}</button>
                <input type="password" id="password${hintNumber}" placeholder="Enter password">
                <p id="hint${hintNumber}" class="hint hidden"></p>
            `;
            hintsContainer.appendChild(hintDiv);
        });

        document.querySelectorAll(".hint-btn").forEach(button => {
            button.addEventListener("click", function () {
                const hintNumber = this.getAttribute("data-hint");
                requestHint(hintNumber);
            });
        });
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

    // Attach event listener to start button **after the DOM is loaded**
    startButton.addEventListener("click", function () {
        startTimer();
    });

    // Restore timer if the page is refreshed
    if (localStorage.getItem("startTime")) {
        startTimer();
    }

    // Generate hints on page load
    generateHints();

    // Generate QR Code
    new QRCode(document.getElementById("qrcode"), {
        text: window.location.href,
        width: 128,
        height: 128
    });
});

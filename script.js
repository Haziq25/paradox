document.addEventListener("DOMContentLoaded", function () {
    const roomId = new URLSearchParams(window.location.search).get("room") || "default";
    let gameDuration = parseInt(localStorage.getItem(`gameDuration_${roomId}`)) || 10 * 60;
    const timerElement = document.getElementById("timer");
    const startButton = document.getElementById("startButton");
    const callButton = document.getElementById("callButton");
    const callStatus = document.getElementById("callStatus");
    let countdown;

    function startTimer() {
        if (!localStorage.getItem(`startTime_${roomId}`)) {
            localStorage.setItem(`startTime_${roomId}`, Math.floor(Date.now() / 1000));
        }
        updateTimer();
        countdown = setInterval(updateTimer, 1000);
    }

    function updateTimer() {
        const startTime = parseInt(localStorage.getItem(`startTime_${roomId}`));
        if (!startTime) return;

        const now = Math.floor(Date.now() / 1000);
        let timeLeft = gameDuration - (now - startTime);

        if (timeLeft <= 0) {
            clearInterval(countdown);
            timerElement.textContent = "00:00";
            alert("Time's up!");
            return;
        }

        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
        timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    startButton.addEventListener("click", function () {
        gameDuration = parseInt(localStorage.getItem(`gameDuration_${roomId}`)) || 10 * 60;
        startTimer();
    });

    callButton.addEventListener("click", function () {
        localStorage.setItem(`helpRequest_${roomId}`, "true");
        callStatus.classList.remove("hidden");
        alert("Help request sent!");
        localStorage.setItem("helpUpdated", Date.now());
    });

    window.addEventListener("storage", function (event) {
        if (event.key === "helpUpdated") {
            callStatus.classList.add("hidden");
        }
        if (event.key === "timerReset") {
            localStorage.removeItem(`startTime_${roomId}`);
            timerElement.textContent = `${Math.floor(gameDuration / 60)}:00`;
            clearInterval(countdown);
        }
    });

    if (localStorage.getItem(`startTime_${roomId}`)) {
        startTimer();
    }
});

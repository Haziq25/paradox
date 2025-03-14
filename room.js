document.addEventListener("DOMContentLoaded", function () {
    const db = firebase.database();
    const roomName = window.location.pathname.split("/").pop().replace(".html", "");  
    const timerDisplay = document.getElementById("timer");
    const hintButton = document.getElementById("hintButton");
    const hintText = document.getElementById("hintText");
    const callButton = document.getElementById("callButton");

    // Listen for Timer Updates
    db.ref(`rooms/${roomName}/timer`).on("value", (snapshot) => {
        let timeLeft = snapshot.val();
        if (timeLeft !== null) {
            updateTimerDisplay(timeLeft);
        }
    });

    function updateTimerDisplay(seconds) {
        let minutes = Math.floor(seconds / 60);
        let secs = seconds % 60;
        timerDisplay.textContent = `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
    }

    // Show Hint
    hintButton.addEventListener("click", () => {
        hintText.style.display = "block";
    });

    // Call for Help
    callButton.addEventListener("click", () => {
        db.ref(`calls/${roomName}`).set(true);
    });
});

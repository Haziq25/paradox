document.addEventListener("DOMContentLoaded", function () {
    const rooms = ["room1", "room2", "room3"];
    const helpRequests = document.getElementById("helpRequests");
    const clearCallsButton = document.getElementById("clearCalls");
    const roomControls = document.getElementById("roomControls");
    const qrCodes = document.getElementById("qrCodes");

    rooms.forEach(room => {
        const roomDiv = document.createElement("div");
        roomDiv.innerHTML = `
            <h3>${room.toUpperCase()}</h3>
            <label>Set Timer (minutes): 
                <input type="number" id="timeInput_${room}" min="1" value="${localStorage.getItem(`gameDuration_${room}`) || 10}">
            </label>
            <button class="setTimeBtn" data-room="${room}">Set Time</button>
            <button class="resetTimerBtn" data-room="${room}">Reset Timer</button>
        `;
        roomControls.appendChild(roomDiv);
    });

    document.querySelectorAll(".setTimeBtn").forEach(button => {
        button.addEventListener("click", function () {
            const room = this.getAttribute("data-room");
            const time = document.getElementById(`timeInput_${room}`).value;
            localStorage.setItem(`gameDuration_${room}`, time * 60);
            alert(`${room} timer set to ${time} minutes.`);
        });
    });

    document.querySelectorAll(".resetTimerBtn").forEach(button => {
        button.addEventListener("click", function () {
            const room = this.getAttribute("data-room");
            localStorage.removeItem(`startTime_${room}`);
            localStorage.setItem("timerReset", Date.now());
            alert(`${room} timer reset.`);
        });
    });

    function updateHelpRequests() {
        helpRequests.innerHTML = "";
        rooms.forEach(room => {
            if (localStorage.getItem(`helpRequest_${room}`) === "true") {
                helpRequests.innerHTML += `<li>Help needed in ${room}!</li>`;
            }
        });

        if (helpRequests.innerHTML === "") {
            helpRequests.innerHTML = "<li>No active calls.</li>";
        }
    }

    clearCallsButton.addEventListener("click", function () {
        rooms.forEach(room => localStorage.removeItem(`helpRequest_${room}`));
        localStorage.setItem("helpUpdated", Date.now());
        updateHelpRequests();
    });

    document.addEventListener("DOMContentLoaded", function () {
    const rooms = ["room1", "room2", "room3"];
    const qrCodes = document.getElementById("qrCodes");

    rooms.forEach(room => {
        let roomNumber = room.replace("room", "");  // Get "1", "2", "3"
        let qrDiv = document.createElement("div");
        qrDiv.innerHTML = `
            <h3>${room.toUpperCase()}</h3>
            <a href="room${roomNumber}.html" target="_blank">Open ${room.toUpperCase()}</a>
            <div id="qr_${room}"></div>
        `;
        qrCodes.appendChild(qrDiv);

        setTimeout(() => {
            new QRCode(document.getElementById(`qr_${room}`), {
                text: window.location.origin + `/escape-room/room${roomNumber}.html`, 
                width: 128,
                height: 128
            });
        }, 500);
    });
});

    updateHelpRequests();
});

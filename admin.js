document.addEventListener("DOMContentLoaded", function () {
    const rooms = ["room1", "room2", "room3"];
    const qrCodes = document.getElementById("qrCodes");
    const callsList = document.getElementById("callsList");

    // Firebase real-time database (if used)
    const db = firebase.database();

    // Function to create QR codes
    function generateQRCodes() {
        rooms.forEach(room => {
            let roomNumber = room.replace("room", "");  // Extract room number (1, 2, 3)
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
    }

    // Function to update room timers
    function updateTimer(room, timeInMinutes) {
        db.ref(`rooms/${room}/timer`).set(timeInMinutes * 60);
    }

    // Function to handle calls from rooms
    function listenForCalls() {
        db.ref("calls").on("value", (snapshot) => {
            callsList.innerHTML = ""; // Clear previous calls
            snapshot.forEach(childSnapshot => {
                const room = childSnapshot.key;
                const callDiv = document.createElement("div");
                callDiv.innerHTML = `<strong>${room.toUpperCase()}</strong> requested help! 
                    <button onclick="resolveCall('${room}')">Resolve</button>`;
                callsList.appendChild(callDiv);
            });
        });
    }

    // Function to resolve calls
    window.resolveCall = function(room) {
        db.ref(`calls/${room}`).remove();
    };

    // Add event listeners for timer inputs
    rooms.forEach(room => {
        document.getElementById(`setTimer_${room}`).addEventListener("click", function () {
            let time = document.getElementById(`timeInput_${room}`).value;
            if (!isNaN(time) && time > 0) {
                updateTimer(room, time);
            }
        });
    });

    // Initialize QR codes and call listener
    generateQRCodes();
    listenForCalls();
});

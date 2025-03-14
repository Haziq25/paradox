document.addEventListener("DOMContentLoaded", function () {
    const rooms = ["room1", "room2", "room3"];
    const qrCodes = document.getElementById("qrCodes");
    const callsList = document.getElementById("callsList");

    const db = firebase.database();

    // Generate QR Codes
    function generateQRCodes() {
        qrCodes.innerHTML = "";
        rooms.forEach(room => {
            let roomNumber = room.replace("room", "");
            let qrDiv = document.createElement("div");
            qrDiv.innerHTML = `
                <h3>${room.toUpperCase()}</h3>
                <a href="room${roomNumber}.html" target="_blank">Open ${room.toUpperCase()}</a>
                <div id="qr_${room}"></div>
            `;
            qrCodes.appendChild(qrDiv);
            new QRCode(document.getElementById(`qr_${room}`), {
                text: window.location.origin + `/room${roomNumber}.html`,
                width: 128,
                height: 128
            });
        });
    }

    // Set Timer for Rooms
    rooms.forEach(room => {
        document.getElementById(`setTimer_${room}`).addEventListener("click", function () {
            let time = document.getElementById(`timeInput_${room}`).value;
            if (!isNaN(time) && time > 0) {
                db.ref(`rooms/${room}/timer`).set(time * 60);
            }
        });
    });

    // Listen for Calls
    db.ref("calls").on("value", (snapshot) => {
        callsList.innerHTML = "";
        snapshot.forEach(childSnapshot => {
            const room = childSnapshot.key;
            const callDiv = document.createElement("div");
            callDiv.innerHTML = `<strong>${room.toUpperCase()}</strong> needs help!
                <button onclick="resolveCall('${room}')">Resolve</button>`;
            callsList.appendChild(callDiv);
        });
    });

    // Resolve Calls
    window.resolveCall = function(room) {
        db.ref(`calls/${room}`).remove();
    };

    generateQRCodes();
});

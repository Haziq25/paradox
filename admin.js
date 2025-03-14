document.addEventListener("DOMContentLoaded", function () {
    const helpRequests = document.getElementById("helpRequests");
    const clearCallsButton = document.getElementById("clearCalls");

    function updateHelpRequests() {
        helpRequests.innerHTML = localStorage.getItem("helpRequest") === "true"
            ? "<li>Help needed!</li>" 
            : "<li>No active calls.</li>";
    }

    clearCallsButton.addEventListener("click", function () {
        localStorage.removeItem("helpRequest");
        localStorage.setItem("helpUpdated", Date.now()); // Notify game page
        updateHelpRequests();
    });

    // Real-time update listener
    window.addEventListener("storage", function (event) {
        if (event.key === "helpUpdated") {
            updateHelpRequests();
        }
    });

    updateHelpRequests();
});

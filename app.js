// Initialize Telegram
const tg = window.Telegram.WebApp;

function init() {
    tg.ready();
    tg.expand();

    // Check if the renderDashboard function exists before calling it
    if (typeof renderDashboard === "function") {
        renderDashboard();
    } else {
        console.error("ui.js was not loaded correctly!");
    }
}

// This is the safest way to trigger the UI in 2026
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}

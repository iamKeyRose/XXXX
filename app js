// Initialize Telegram WebApp
const tg = window.Telegram.WebApp;

document.addEventListener('DOMContentLoaded', () => {
    tg.ready();
    tg.expand();
    
    // Call the function from ui.js to build the page
    renderDashboard();
    
    console.log("App Initialized for:", tg.initDataUnsafe?.user?.first_name);
});

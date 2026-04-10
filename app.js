const tg = window.Telegram.WebApp;

function init() {
    tg.ready();
    tg.expand();
    tg.setHeaderColor('#ffffff');

    if (typeof renderDashboard === 'function') {
        renderDashboard();
    }
}

// Load init once everything is ready
window.addEventListener('load', init);

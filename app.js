const tg = window.Telegram.WebApp;

function init() {
    tg.ready();
    tg.expand();
    tg.setHeaderColor('#ffffff');

    if (typeof renderDashboard === 'function') {
        renderDashboard();
    }
}

window.addEventListener('load', init);

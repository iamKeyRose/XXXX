const tg = window.Telegram.WebApp;

function init() {
    tg.ready();
    tg.expand();
    tg.setHeaderColor('#ffffff');

    if (typeof renderDashboard === 'function') {
        renderDashboard();
        startCarousel();
    }
}

function startCarousel() {
    const track = document.querySelector('.carousel-container');
    if (!track) return;

    setInterval(() => {
        const width = track.offsetWidth;
        if (track.scrollLeft + width >= track.scrollWidth - 5) {
            track.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            track.scrollBy({ left: width, behavior: 'smooth' });
        }
    }, 3000);
}

window.addEventListener('load', init);

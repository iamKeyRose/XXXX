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

/* Add these functions to your app.js */

function handleTelegramLogin() {
    const user = tg.initDataUnsafe?.user;

    if (user) {
        // Here you would typically send user.id to your database
        tg.showPopup({
            title: 'Welcome!',
            message: `Hello ${user.first_name}, you are now logged in via Telegram.`,
            buttons: [{type: 'ok'}]
        });
        
        // Change the UI to show they are logged in
        document.querySelector('.auth-card').innerHTML = `
            <div>
                <strong>Logged in as ${user.first_name}</strong>
                <p style="margin:4px 0 0 0; font-size:12px; color:var(--text-muted)">ID: ${user.id}</p>
            </div>
            <div style="font-size: 24px;">✅</div>
        `;
    } else {
        tg.showAlert("Could not find Telegram user data.");
    }
}


window.addEventListener('load', init);

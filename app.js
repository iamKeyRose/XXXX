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

// Payment Handler
function handlePayment() {
    // 1. Check if the user is logged in
    const user = tg.initDataUnsafe?.user;
    if (!user) {
        tg.showAlert("Please join the Hub first!");
        return;
    }

    // 2. Open a Telegram Invoice
    // Note: In a real app, the 'url' comes from your backend after creating an invoice
    // For now, we show the Telegram UI interaction
    tg.showConfirm("Proceed to payment via Telegram?", (isConfirmed) => {
        if (isConfirmed) {
            // This is where you call your bot to send an invoice link
            tg.openInvoice("https://t.me/invoice/example_link", (status) => {
                if (status === 'paid') {
                    tg.showAlert("Payment Successful! Your balance is updated.");
                } else if (status === 'failed') {
                    tg.showAlert("Payment failed. Please try again.");
                }
            });
        }
    });
}



window.addEventListener('load', init);

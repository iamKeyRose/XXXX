const tg = window.Telegram.WebApp;

let userSession = { role: null, type: null, location: null };
let carouselTimers = [];

function init() {
    tg.ready();
    tg.expand();
    tg.setHeaderColor('#ffffff');
    renderDashboard();
    startAllCarousels();
}

function startAllCarousels() {
    // Clear existing timers to prevent duplicates
    carouselTimers.forEach(clearInterval);
    carouselTimers = [];

    const carouselIds = ['ad-main-top', 'talent-carousel', 'bottom-c1', 'bottom-c2', 'footer-track'];
    
    carouselIds.forEach(id => {
        const track = document.getElementById(id);
        if (!track) return;

        const timer = setInterval(() => {
            const width = track.offsetWidth;
            if (track.scrollLeft + width >= track.scrollWidth - 5) {
                track.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                track.scrollBy({ left: width, behavior: 'smooth' });
            }
        }, 3000);
        carouselTimers.push(timer);
    });
}

function startRegistration() {
    carouselTimers.forEach(clearInterval);
    renderRoleSelection();
}

function setRole(role) {
    userSession.role = role;
    tg.HapticFeedback.impactOccurred('medium');
    tg.showPopup({
        title: 'Account Type',
        message: 'Are you an individual or a business?',
        buttons: [{id: 'ind', text: 'Individual'}, {id: 'com', text: 'Business'}]
    }, (btn) => {
        userSession.type = btn === 'ind' ? 'individual' : 'company';
        renderManualAddressForm();
    });
}

function saveManualAddress() {
    const city = document.getElementById('city').value;
    const area = document.getElementById('area').value;
    if(!city || !area) return tg.showAlert("Fill all fields");
    userSession.location = { city, area };
    completeRegistration();
}

function completeRegistration() {
    tg.showAlert("Registration Complete!");
    renderDashboard();
    startAllCarousels();
    window.scrollTo(0, 0);
}

function handleAction(msg) {
    tg.HapticFeedback.impactOccurred('light');
    tg.showAlert(msg);
}

window.addEventListener('load', init);

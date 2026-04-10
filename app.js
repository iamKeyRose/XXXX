const tg = window.Telegram.WebApp;

// Global State
let userSession = {
    role: null,
    type: null,
    location: null
};

function init() {
    tg.ready();
    tg.expand();
    tg.setHeaderColor('#ffffff');
    renderDashboard();
}

function startRegistration() {
    renderRoleSelection();
}

function setRole(role) {
    userSession.role = role;
    tg.HapticFeedback.impactOccurred('medium');
    
    const options = role === 'guest' 
        ? ['Individual Buyer', 'Company Buyer'] 
        : ['Professional', 'Company/Agency'];

    tg.showPopup({
        title: 'Account Type',
        message: `Are you an individual or a business?`,
        buttons: [
            {id: 'ind', type: 'default', text: options[0]},
            {id: 'com', type: 'default', text: options[1]}
        ]
    }, (buttonId) => {
        userSession.type = (buttonId === 'ind') ? 'individual' : 'company';
        askForLocation();
    });
}

function askForLocation() {
    tg.showPopup({
        title: 'Location',
        message: 'How should we set your service area?',
        buttons: [
            {id: 'gps', type: 'default', text: '📍 GPS'},
            {id: 'manual', type: 'default', text: '✍️ Manual'}
        ]
    }, (buttonId) => {
        if (buttonId === 'gps') handleGPSLocation();
        else renderManualAddressForm();
    });
}

function handleGPSLocation() {
    tg.getLocation((data) => {
        if (data) {
            userSession.location = { lat: data.latitude, lon: data.longitude };
            completeRegistration();
        } else {
            tg.showAlert("GPS failed. Enter manually.");
            renderManualAddressForm();
        }
    });
}

function saveManualAddress() {
    const city = document.getElementById('city').value;
    const area = document.getElementById('area').value;
    if(!city || !area) {
        tg.showAlert("Fill all fields.");
        return;
    }
    userSession.location = { city, area };
    completeRegistration();
}

function completeRegistration() {
    tg.showAlert("Welcome to Habesha Hub!");
    renderDashboard(); // Re-renders with the "Verified" tick
}

function handleAction(msg) {
    tg.HapticFeedback.impactOccurred('light');
    tg.showAlert('Selected: ' + msg);
}

/* --- app.js --- */

let carouselInterval;

function startCarouselTimer() {
    const track = document.getElementById('ad-track');
    if (!track) return;

    // Clear any existing timer to prevent double-speeding
    if (carouselInterval) clearInterval(carouselInterval);

    carouselInterval = setInterval(() => {
        const slideWidth = track.offsetWidth;
        const totalWidth = track.scrollWidth;
        const currentScroll = track.scrollLeft;

        // Logic: If at the last slide, jump back to the start
        // We use a 5px buffer to account for sub-pixel rounding
        if (currentScroll + slideWidth >= totalWidth - 5) {
            track.scrollTo({
                left: 0,
                behavior: 'smooth' 
            });
        } else {
            track.scrollBy({
                left: slideWidth,
                behavior: 'smooth'
            });
        }
    }, 3000); // 3 seconds per slide
}

// Call this inside your init() or after renderDashboard()
function init() {
    tg.ready();
    renderDashboard();
    startCarouselTimer();
}


window.addEventListener('load', init);

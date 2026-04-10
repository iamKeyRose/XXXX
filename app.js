const tg = window.Telegram.WebApp;

// Global State
let userSession = {
    role: null,
    type: null,
    location: null
};

let carouselInterval; // Move this to the top with other globals

// Corrected Init: Combined both into one single function
function init() {
    tg.ready();
    tg.expand();
    tg.setHeaderColor('#ffffff');
    
    // Initial Render
    renderDashboard();
    
    // Start the timer after the dashboard is rendered
    startCarouselTimer();
}

/* --- CAROUSEL LOGIC --- */
function startCarouselTimer() {
    const track = document.getElementById('ad-track');
    // If we are on a registration screen, the track won't exist. 
    // This check prevents errors.
    if (!track) return;

    if (carouselInterval) clearInterval(carouselInterval);

    carouselInterval = setInterval(() => {
        const slideWidth = track.offsetWidth;
        const totalWidth = track.scrollWidth;
        const currentScroll = track.scrollLeft;

        if (currentScroll + slideWidth >= totalWidth - 5) {
            track.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            track.scrollBy({ left: slideWidth, behavior: 'smooth' });
        }
    }, 3000); 
}

/* --- REGISTRATION FLOW --- */
function startRegistration() {
    // Stop the timer when moving to registration screens 
    // so it doesn't try to scroll something that isn't there
    if (carouselInterval) clearInterval(carouselInterval);
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
    renderDashboard();
    
    // IMPORTANT: Restart the timer here because renderDashboard 
    // creates a brand new 'ad-track' element.
    startCarouselTimer();
}

function handleAction(msg) {
    tg.HapticFeedback.impactOccurred('light');
    tg.showAlert('Selected: ' + msg);
}

// Single event listener for the single init function
window.addEventListener('load', init);

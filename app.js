const tg = window.Telegram.WebApp;

// Global State - MUST stay at top
let userSession = {
    role: null,
    type: null,
    location: null
};

let carouselInterval; 

// Combined Init Function
function init() {
    tg.ready();
    tg.expand();
    tg.setHeaderColor('#ffffff');

    // 1. Render Dashboard
    renderDashboard();

    // 2. Start Carousel
    startCarouselTimer();
}

/* --- CAROUSEL LOGIC --- */
function startCarouselTimer() {
    const track = document.getElementById('ad-track');
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
    // Stop carousel when we leave the dashboard
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

/* --- THE RETURN LOGIC --- */

function completeRegistration() {
    // 1. Confirm to user
    tg.showAlert("Welcome to Habesha Hub!");

    // 2. IMPORTANT: Re-render the dashboard now that userSession is filled
    renderDashboard();

    // 3. IMPORTANT: Re-start the timer for the new dashboard ads
    startCarouselTimer();
    
    // 4. Scroll to top to show the ads and the new "Verified" badge
    window.scrollTo(0, 0);
}

function handleAction(msg) {
    tg.HapticFeedback.impactOccurred('light');
    tg.showAlert('Selected: ' + msg);
}

// Single event listener
window.addEventListener('load', init);

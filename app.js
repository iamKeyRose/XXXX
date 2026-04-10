const tg = window.Telegram.WebApp;

// Global State
let userSession = {
    role: null,
    type: null,
    location: null
};

let carouselTimers = [];

function init() {
    tg.ready();
    tg.expand();
    tg.setHeaderColor('#ffffff');

    // Render initial view
    renderDashboard();

    // Start all carousels
    startAllCarousels();
}

function startAllCarousels() {
    // Clear any existing timers
    carouselTimers.forEach(clearInterval);
    carouselTimers = [];

    const ids = ['ad-main-top', 'talent-carousel', 'bottom-c1', 'bottom-c2', 'footer-track'];
    
    ids.forEach(id => {
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

/* --- REGISTRATION FLOW --- */
async function completeRegistration() {
    const user = tg.initDataUnsafe?.user;

    const userData = {
        tg_id: user?.id || 0, // This is the PRIMARY KEY
        first_name: user?.first_name || 'User',
        role: userSession.role,
        account_type: userSession.type,
        city: userSession.location?.city,
        area: userSession.location?.area,
        balance: 0 // New users start at 0
    };

    try {
        // .upsert() means: If ID exists, update it. If not, create it.
        const { data, error } = await supabase
            .from('users')
            .upsert(userData);

        if (error) throw error;

        tg.showAlert("Data saved to Supabase!");
        renderDashboard();
    } catch (err) {
        tg.showAlert("Error: " + err.message);
    }
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
        renderManualAddressForm();
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
    startAllCarousels();
    window.scrollTo(0, 0);
}

function handleAction(msg) {
    tg.HapticFeedback.impactOccurred('light');
    tg.showAlert('Selected: ' + msg);
}

window.addEventListener('load', init);

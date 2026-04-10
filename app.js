const tg = window.Telegram.WebApp;

// 1. ADD SUPABASE CONFIG AT THE TOP
const supabaseUrl = 'https://gwqxqinaltxspwmmrrru.supabase.co';
const supabaseKey = 'sb_publishable_cC_a06m2_PLJqIZxigQmlQ_EFkdkoPE';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Global State
let userSession = {
    role: null,
    type: null,
    location: null,
    balance: 0 // Added this
};

let carouselTimers = [];

// 2. UPDATED INIT (Checks DB for returning users)
async function init() {
    tg.ready();
    tg.expand();
    tg.setHeaderColor('#ffffff');

    const user = tg.initDataUnsafe?.user;
    if (user) {
        const { data } = await supabase
            .from('users')
            .select('*')
            .eq('tg_id', user.id)
            .single();

        if (data) {
            userSession.role = data.role;
            userSession.type = data.account_type;
            userSession.location = { city: data.city, area: data.area };
            userSession.balance = data.balance;
        }
    }

    renderDashboard();
    startAllCarousels();
}

function startAllCarousels() {
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

// 3. MERGED COMPLETE REGISTRATION (One function only!)
async function completeRegistration() {
    const user = tg.initDataUnsafe?.user;

    const userData = {
        tg_id: user?.id || 0,
        first_name: user?.first_name || 'User',
        role: userSession.role,
        account_type: userSession.type,
        city: userSession.location?.city,
        area: userSession.location?.area,
        balance: 0 
    };

    try {
        const { error } = await supabase
            .from('users')
            .upsert(userData);

        if (error) throw error;

        tg.showAlert("Welcome to Habesha Hub! Data saved.");
        renderDashboard();
        startAllCarousels();
        window.scrollTo(0, 0);
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
    completeRegistration(); // Calls the async function above
}

function handleAction(msg) {
    tg.HapticFeedback.impactOccurred('light');
    tg.showAlert('Selected: ' + msg);
}

window.addEventListener('load', init);

// 1. Establish the Connection immediately
const supabaseUrl = 'https://gwqxqinaltxspwmmrrru.supabase.co';
const supabaseKey = 'sb_publishable_cC_a06m2_PLJqIZxigQmlQ_EFkdkoPE';

// Using dbClient ensures we don't overwrite the global 'supabase' object
const dbClient = supabase.createClient(supabaseUrl, supabaseKey);

const tg = window.Telegram.WebApp;

// Global State
let userSession = {
    role: null,
    type: null,
    location: null,
    balance: 0 
};

let carouselTimers = [];

// 2. Initialize App & Fetch Data
async function init() {
    tg.ready();
    tg.expand();
    tg.setHeaderColor('#ffffff');

    const user = tg.initDataUnsafe?.user;
    
    if (user && user.id) {
        // Look up the user in your Supabase 'users' table
        const { data, error } = await dbClient
            .from('users')
            .select('*')
            .eq('tg_id', user.id)
            .single();

        if (data) {
            // User exists! Load their saved data into the app
            userSession.role = data.role;
            userSession.type = data.account_type;
            userSession.location = { city: data.city, area: data.area };
            userSession.balance = data.balance || 0;
        }
    }

    renderDashboard();
    startAllCarousels();
}

// 3. Save Data to Supabase
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
        const { error } = await dbClient
            .from('users')
            .upsert(userData, { onConflict: 'tg_id' });

        if (error) throw error;

        tg.showAlert("Successfully connected to Habesha Hub!");
        renderDashboard();
        startAllCarousels();
        window.scrollTo(0, 0);
    } catch (err) {
        tg.showAlert("Database Error: " + err.message);
    }
}

// --- Support Functions ---
function setRole(role) {
    userSession.role = role;
    tg.HapticFeedback.impactOccurred('medium');
    const options = role === 'guest' ? ['Buyer', 'Company'] : ['Pro', 'Agency'];

    tg.showPopup({
        title: 'Account Type',
        message: `Select your registration type:`,
        buttons: [
            {id: 'ind', type: 'default', text: options[0]},
            {id: 'com', type: 'default', text: options[1]}
        ]
    }, (btn) => {
        userSession.type = (btn === 'ind') ? 'individual' : 'company';
        renderManualAddressForm();
    });
}

function saveManualAddress() {
    const cityVal = document.getElementById('city').value;
    const areaVal = document.getElementById('area').value;
    if(!cityVal || !areaVal) return tg.showAlert("Please fill in your location");
    
    userSession.location = { city: cityVal, area: areaVal };
    completeRegistration();
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

function handleAction(msg) {
    tg.HapticFeedback.impactOccurred('light');
    tg.showAlert(msg);
}

window.addEventListener('load', init);

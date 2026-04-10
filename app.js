const supabaseUrl = 'https://gwqxqinaltxspwmmrrru.supabase.co';
const supabaseKey = 'sb_publishable_cC_a06m2_PLJqIZxigQmlQ_EFkdkoPE';
const dbClient = supabase.createClient(supabaseUrl, supabaseKey);

const tg = window.Telegram.WebApp;

let userSession = { role: null, type: null, location: null, balance: 0 };
let carouselTimers = [];

async function init() {
    tg.ready();
    tg.expand();
    tg.setHeaderColor('#ffffff');
    const user = tg.initDataUnsafe?.user;
    if (user && user.id) {
        try {
            const { data } = await dbClient.from('users').select('*').eq('tg_id', user.id).maybeSingle();
            if (data) {
                userSession = { role: data.role, type: data.account_type, location: { city: data.city, area: data.area }, balance: data.balance || 0 };
            }
        } catch (err) { console.warn(err); }
    }
    renderDashboard();
    startAllCarousels();
}

function startRegistration() {
    tg.HapticFeedback.impactOccurred('light');
    renderRoleSelection();
}

function setRole(role) {
    userSession.role = role;
    tg.HapticFeedback.impactOccurred('medium');
    const options = role === 'guest' ? ['Individual', 'Company'] : ['Pro', 'Agency'];
    tg.showPopup({
        title: 'Account Type',
        message: 'Choose one:',
        buttons: [{id:'ind', type:'default', text:options[0]}, {id:'com', type:'default', text:options[1]}]
    }, (btnId) => {
        if (btnId) {
            userSession.type = (btnId === 'ind') ? 'individual' : 'company';
            renderManualAddressForm();
        }
    });
}

function saveManualAddress() {
    const city = document.getElementById('city')?.value;
    const area = document.getElementById('area')?.value;
    if(!city || !area) return tg.showAlert("Fill all fields.");
    userSession.location = { city, area };
    completeRegistration();
}

async function completeRegistration() {
    const user = tg.initDataUnsafe?.user;
    const userData = { tg_id: user?.id || 0, first_name: user?.first_name || 'User', role: userSession.role, account_type: userSession.type, city: userSession.location.city, area: userSession.location.area, balance: 0 };
    try {
        const { error } = await dbClient.from('users').upsert(userData, { onConflict: 'tg_id' });
        if (error) throw error;
        tg.showAlert("Success!");
        renderDashboard();
        startAllCarousels();
    } catch (err) { tg.showAlert(err.message); }
}

function startAllCarousels() {
    carouselTimers.forEach(clearInterval);
    carouselTimers = [];
    const ids = ['ad-main-top', 'talent-carousel'];
    ids.forEach(id => {
        const track = document.getElementById(id);
        if (!track) return;
        const timer = setInterval(() => {
            const width = track.offsetWidth;
            if (track.scrollLeft + width >= track.scrollWidth - 5) track.scrollTo({ left: 0, behavior: 'smooth' });
            else track.scrollBy({ left: width, behavior: 'smooth' });
        }, 3000);
        carouselTimers.push(timer);
    });
}

function handleAction(msg) {
    tg.HapticFeedback.impactOccurred('light');
    if (msg === 'Deposit') {
        tg.showPopup({
            title: 'Deposit',
            message: 'Method:',
            buttons: [{id:'tele', text:'Telebirr'}, {id:'cbe', text:'CBE'}, {id:'x', type:'destructive', text:'Back'}]
        });
    } else {
        tg.showAlert("Clicked: " + msg);
    }
}

function openPostMenu() {
    tg.HapticFeedback.impactOccurred('medium');

    let title, message, buttons;

    if (userSession.role === 'provider') {
        title = "Provider Menu";
        message = "What would you like to list?";
        buttons = [
            {id: 'service', type: 'default', text: 'Post a Service'},
            {id: 'job', type: 'default', text: 'Post a Job Opening'},
            {id: 'cancel', type: 'destructive', text: 'Cancel'}
        ];
    } else {
        title = "Client Menu";
        message = "What are you looking for?";
        buttons = [
            {id: 'talent', type: 'default', text: 'Post Talent Request'},
            {id: 'request', type: 'default', text: 'Post Service Request'},
            {id: 'cancel', type: 'destructive', text: 'Cancel'}
        ];
    }

    tg.showPopup({ title, message, buttons }, (buttonId) => {
        if (buttonId !== 'cancel') {
            // This will lead to the form where they type the details
            renderPostForm(buttonId); 
        }
    });
}


window.addEventListener('load', init);

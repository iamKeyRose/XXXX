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

    // 1. Safety check: Is the app actually open in Telegram?
    if (!user || !user.id) {
        document.getElementById('main-content').innerHTML = `
            <div style="text-align:center; padding:50px;">
                <h3>Access Denied</h3>
                <p>Please open this app through the Telegram Bot.</p>
            </div>`;
        return;
    }

    try {
        // 2. Check the database for this specific Telegram ID
        const { data, error } = await dbClient
            .from('users')
            .select('*')
            .eq('tg_id', user.id)
            .maybeSingle();

        if (error) throw error;

        if (data) {
            // 3. USER EXISTS: Save their data to the session and show Dashboard
            userSession = { 
                role: data.role, 
                type: data.account_type, 
                location: { city: data.city, area: data.area }, 
                balance: data.balance || 0,
                full_profile: data // Store the whole profile for later use
            };
            
            renderDashboard();
            startAllCarousels();
        } else {
            // 4. NEW USER: Redirect them to the registration page immediately
            renderRegistrationForm();
        }

    } catch (err) {
        console.error("Database connection failed:", err);
        tg.showAlert("System busy. Please try again later.");
    }
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

function handleAction(type, val) {
    tg.HapticFeedback.impactOccurred('light');

    if (type === 'category') {
        showCategoryItems(val);
    } else if (val === 'Deposit') {
        // Your deposit logic...
        tg.showAlert("Deposit feature coming soon");
    } else {
        tg.showAlert("Action: " + val);
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


/**
 * LISTING SUBMISSION LOGIC
 */
async function submitPost(actionType) {
    // 1. Grab the actual category from the dropdown
    const selectedCategory = document.getElementById('post-category').value;
    
    const title = document.getElementById('post-title').value;
    const description = document.getElementById('post-desc').value;
    const price = document.getElementById('post-price').value;

    if (!title || !description) {
        tg.showAlert("Please provide a title and description.");
        return;
    }

    tg.showConfirm(`Confirm: Publish this?`, async (confirmed) => {
        if (confirmed) {
            const user = tg.initDataUnsafe?.user;

            const postData = {
                user_id: user?.id,
                type: selectedCategory, // FIX: Use selectedCategory, not actionType
                title: title,
                description: description,
                price: parseFloat(price) || 0,
                status: 'active'
            };

            try {
                const { error } = await dbClient
                    .from('listings')
                    .insert([postData]);

                if (error) throw error;

                tg.HapticFeedback.notificationOccurred('success');
                tg.showAlert(`Published in ${selectedCategory}!`);

                renderDashboard();
                window.scrollTo(0, 0);
            } catch (err) {
                tg.showAlert("Publishing Error: " + err.message);
            }
        }
    });
}

async function viewListingDetail(listingId) {
    tg.HapticFeedback.impactOccurred('medium');
    
    // 1. Fetch listing AND the owner profile in one go
    // Note: This requires a Foreign Key relationship in Supabase
    const { data, error } = await dbClient
        .from('listings')
        .select(`
            *,
            owner:users(first_name, city, area, role, account_type)
        `)
        .eq('id', listingId)
        .single();

    if (error) return tg.showAlert("Error loading profile: " + error.message);

    renderProfileDetail(data);
}


// Add this to app.js
window.viewListingDetail = async function(listingId) {
    tg.HapticFeedback.impactOccurred('medium');
    
    // FETCH LOGIC
    const { data, error } = await dbClient
        .from('listings')
        .select('*, owner:users(*)')
        .eq('id', listingId)
        .single();

    if (error || !data) {
        return tg.showAlert("Profile details not found.");
    }

    // Call the UI function to render the full profile
    renderProfileDetail(data);
};

async function openMyProfile() {
    tg.HapticFeedback.impactOccurred('light');
    const userId = tg.initDataUnsafe?.user?.id;

    // Fetch fresh data to show latest ratings/revenue
    const { data: profile, error } = await dbClient
        .from('users')
        .select('*')
        .eq('tg_id', userId)
        .single();

    if (error) return tg.showAlert("Could not load profile.");

    renderProfileView(profile);
}


window.addEventListener('load', init);

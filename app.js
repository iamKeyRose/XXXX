const supabaseUrl = 'https://gwqxqinaltxspwmmrrru.supabase.co';
const supabaseKey = 'sb_publishable_cC_a06m2_PLJqIZxigQmlQ_EFkdkoPE';
const dbClient = supabase.createClient(supabaseUrl, supabaseKey);

const tg = window.Telegram.WebApp;

let userSession = { role: null, type: null, location: null, balance: 0 };
let carouselTimers = [];

async function init() {
    tg.ready();
    tg.expand();
    const user = tg.initDataUnsafe?.user;

    if (!user) {
        document.getElementById('main-content').innerHTML = "Open in Telegram";
        return;
    }

    try {
        const { data, error } = await dbClient
            .from('users')
            .select('*')
            .eq('tg_id', user.id)
            .maybeSingle();

        if (data) {
            // User exists: Store the role and verification status
            userSession = { 
                role: data.role, 
                is_verified: data.is_verified,
                full_profile: data 
            };
            
            // Redirect based on role
            renderDashboard(); 
        } else {
            // New User: Send to role selection
            renderRoleSelection(); 
        }
    } catch (err) {
        console.error(err);
        tg.showAlert("Connection error.");
    }
}

async function submitRegistration(role) {
    const user = tg.initDataUnsafe?.user;
    const name = document.getElementById('reg-name').value;
    const phone = document.getElementById('reg-phone').value;

    if (!name || !phone) return tg.showAlert("Please fill in all fields.");

    const { error } = await dbClient.from('users').insert([{
        tg_id: user.id,
        full_name: name,
        phone: phone,
        role: role,
        is_verified: false // They must pay the 345 ETB later if they are a provider
    }]);

    if (!error) {
        tg.showAlert("Registration successful!");
        init(); // Re-run init to load the correct dashboard
    } else {
        tg.showAlert("Error: " + error.message);
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

async function saveProfileUpdates() {
    const userId = tg.initDataUnsafe?.user?.id;
    const updatedData = {
        first_name: document.getElementById('edit-name').value,
        bio: document.getElementById('edit-bio').value,
        phone: document.getElementById('edit-phone').value
    };

    tg.MainButton.showProgress();

    const { error } = await dbClient
        .from('users')
        .update(updatedData)
        .eq('tg_id', userId);

    if (error) {
        tg.showAlert("Update failed: " + error.message);
    } else {
        tg.HapticFeedback.notificationOccurred('success');
        tg.showAlert("Profile updated successfully!");
        openMyProfile(); // Refresh the view
    }
    
    tg.MainButton.hideProgress();
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


// Add this to app.js
window.handleAction = function(action) {
    tg.HapticFeedback.impactOccurred('light');

    switch(action) {
        case 'Home':
            renderDashboard();
            break;
            
        case 'Profile':
            openMyProfile(); 
            break;

        case 'Search':
            tg.showAlert("Search coming soon!");
            break;

        case 'Orders':
            tg.showAlert("Order history coming soon!");
            break;

        default:
            console.log("Unknown action:", action);
    }
};


window.saveProfileUpdates = async function() {
    const userId = tg.initDataUnsafe?.user?.id;
    
    // 1. Collect data from the UI inputs
    const updatedData = {
        first_name: document.getElementById('edit-name').value,
        bio: document.getElementById('edit-bio').value,
        phone: document.getElementById('edit-phone').value
    };

    // 2. Visual feedback for the user
    tg.MainButton.setText("Saving...");
    tg.MainButton.showProgress();
    tg.MainButton.show();

    // 3. Update the database
    const { error } = await dbClient
        .from('users')
        .update(updatedData)
        .eq('tg_id', userId);

    if (error) {
        tg.showAlert("Update failed: " + error.message);
    } else {
        tg.HapticFeedback.notificationOccurred('success');
        tg.showAlert("Profile updated successfully!");
        
        // 4. Critical: Refresh the session data so the "View" mode has the new info
        openMyProfile(); 
    }
    
    tg.MainButton.hide();
    tg.MainButton.hideProgress();
};

window.handleLogout = function() {
    tg.showConfirm("Are you sure you want to log out? You will need to re-verify your profile.", (confirmed) => {
        if (confirmed) {
            // We don't delete the DB entry, just clear the local session
            userSession = null;
            // Force the app to re-check registration (which will show the sign-up or welcome screen)
            init(); 
        }
    });
};



window.addEventListener('load', init);

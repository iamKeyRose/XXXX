const supabaseUrl = 'https://gwqxqinaltxspwmmrrru.supabase.co';
const supabaseKey = 'sb_publishable_cC_a06m2_PLJqIZxigQmlQ_EFkdkoPE';
const dbClient = supabase.createClient(supabaseUrl, supabaseKey);

const tg = window.Telegram.WebApp;

const tg = window.Telegram.WebApp;
// Ensure these match your actual Supabase project
//const supabaseUrl = 'YOUR_URL';
//const supabaseKey = 'YOUR_KEY';
const dbClient = supabase.createClient(supabaseUrl, supabaseKey);

async function init() {
    tg.ready();
    // BROWSER BYPASS: If no Telegram user, use a fake ID for testing
    const user = tg.initDataUnsafe?.user || { id: 12345, username: 'browser_test' };

    // Remove the "Open in Telegram" block so you can see your work
    const { data, error } = await dbClient
        .from('users')
        .select('*')
        .eq('tg_id', user.id)
        .maybeSingle();

    if (data) {
        renderDashboard(data);
    } else {
        renderRoleSelection();
    }
}

window.submitRegistration = async function(role) {
    const nameInput = document.getElementById('reg-name');
    const phoneInput = document.getElementById('reg-phone');
    
    if (!nameInput || !phoneInput) return;

    const name = nameInput.value;
    const phone = phoneInput.value;
    const user = tg.initDataUnsafe?.user || { id: 12345, username: 'browser_test' };

    if (!name || !phone) {
        alert("Please fill in all fields.");
        return;
    }

    // Force feedback so you know the button is working
    console.log("Attempting to save...", { name, phone, role });

    const { error } = await dbClient.from('users').insert([{
        tg_id: user.id,
        full_name: name,
        phone: phone,
        role: role,
        is_verified: false,
        account_tier: 'basic'
    }]);

    if (!error) {
        alert("Account created successfully!");
        init(); 
    } else {
        alert("Database Error: " + error.message);
    }
};

function renderDashboard(profile) {
    document.getElementById('main-content').innerHTML = `
        <div class="card">
            <h3>Welcome, ${profile.full_name}</h3>
            <p>You are registered as a <b>${profile.role}</b></p>
            <button onclick="localStorage.clear(); location.reload();" class="btn" style="background:#888;">Logout (Test)</button>
        </div>
    `;
}

init();

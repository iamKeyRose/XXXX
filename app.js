const supabaseUrl = 'https://gwqxqinaltxspwmmrrru.supabase.co';
const supabaseKey = 'sb_publishable_cC_a06m2_PLJqIZxigQmlQ_EFkdkoPE';
const dbClient = supabase.createClient(supabaseUrl, supabaseKey);

const tg = window.Telegram.WebApp;

// Ensure these match your actual Supabase project
//const supabaseUrl = 'YOUR_URL';
//const supabaseKey = 'YOUR_KEY';
const dbClient = supabase.createClient(supabaseUrl, supabaseKey);

async function init() {
    console.log("App Initializing...");
    tg.ready();
    tg.expand();

    // 1. Get User (with Browser Fallback)
    const user = tg.initDataUnsafe?.user || { id: 99999, first_name: "Developer" };

    // 2. Clear "Loading" text from HTML
    const main = document.getElementById('main-content');
    main.innerHTML = '<p style="text-align:center;">Checking account...</p>';

    try {
        // 3. Check Supabase
        const { data, error } = await dbClient
            .from('users')
            .select('*')
            .eq('tg_id', user.id)
            .maybeSingle();

        if (error) throw error;

        if (data) {
            renderDashboard(data);
        } else {
            renderRoleSelection();
        }
    } catch (err) {
        console.error("Init Error:", err);
        // If DB fails, we still show the Selection so you can fix the UI
        renderRoleSelection(); 
    }
}

// Ensure the button logic is GLOBAL
window.submitRegistration = async function(role) {
    const name = document.getElementById('reg-name').value;
    const phone = document.getElementById('reg-phone').value;
    const user = tg.initDataUnsafe?.user || { id: 99999 };

    if (!name || !phone) {
        alert("Please fill in all fields.");
        return;
    }

    const { error } = await dbClient.from('users').insert([{
        tg_id: user.id,
        full_name: name,
        phone: phone,
        role: role,
        is_verified: false
    }]);

    if (!error) {
        alert("Success!");
        init(); // Go to dashboard
    } else {
        alert("Save Error: " + error.message);
    }
};

init();

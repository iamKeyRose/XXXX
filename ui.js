// ui.js
function renderRoleSelection() {
    const main = document.getElementById('main-content');
    main.innerHTML = `
        <div class="card">
            <h2 style="margin-bottom:20px;">Habesha Hub</h2>
            <p>Are you an Event Planner or a Service Provider?</p>
            <button onclick="renderRegistrationForm('planner')" class="btn btn-planner" style="margin-bottom:12px;">I am a Planner</button>
            <button onclick="renderRegistrationForm('provider')" class="btn btn-provider">I am a Provider</button>
        </div>
    `;
}

function renderRegistrationForm(role) {
    const main = document.getElementById('main-content');
    
    main.innerHTML = `
        <div class="card">
            <div style="text-align:left; margin-bottom:15px;">
                <button onclick="renderRoleSelection()" class="back-btn">← Back</button>
            </div>
            
            <h3>${role === 'provider' ? 'Provider' : 'Planner'} Registration</h3>
            
            <div class="input-group">
                <label>FULL NAME</label>
                <input type="text" id="reg-name" placeholder="Enter name...">
            </div>
            
            <div class="input-group">
                <label>PHONE / WHATSAPP</label>
                <input type="tel" id="reg-phone" placeholder="+251...">
            </div>

            <button onclick="window.submitRegistration('${role}')" class="btn ${role === 'provider' ? 'btn-provider' : 'btn-planner'}">
                Complete Registration
            </button>
        </div>
    `;
}

function renderDashboard(user) {
    const main = document.getElementById('main-content');
    main.innerHTML = `
        <div class="card">
            <h2>Welcome, ${user.full_name}</h2>
            <p>Dashboard for <b>${user.role}</b> coming soon.</p>
            <button onclick="location.reload()" class="btn" style="background:#888;">Refresh</button>
        </div>
    `;
}

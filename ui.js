function renderRoleSelection() {
    const main = document.getElementById('main-content');
    main.innerHTML = `
        <div class="card" style="margin-top: 50px;">
            <h2>Choose Your Role</h2>
            <p>Select your account type</p>
            <button onclick="renderRegistrationForm('planner')" class="btn btn-planner" style="margin-bottom:10px;">Event Planner</button>
            <button onclick="renderRegistrationForm('provider')" class="btn btn-provider">Service Provider</button>
        </div>
    `;
}

function renderRegistrationForm(role) {
    const main = document.getElementById('main-content');
    const isProvider = (role === 'provider');
    
    main.innerHTML = `
        <div class="card">
            <div style="text-align: left; margin-bottom: 15px;">
                <button onclick="renderRoleSelection()" style="background:none; border:none; color:var(--primary); cursor:pointer; font-weight:bold;">← Back</button>
            </div>

            <h2>${isProvider ? 'Provider' : 'Planner'} Signup</h2>
            
            <div class="input-group">
                <label>FULL NAME</label>
                <input type="text" id="reg-name" placeholder="Enter name">
            </div>
            
            <div class="input-group">
                <label>WHATSAPP NUMBER</label>
                <input type="tel" id="reg-phone" placeholder="+251...">
            </div>

            <button id="submit-btn" class="btn ${isProvider ? 'btn-provider' : 'btn-planner'}">
                Complete Registration
            </button>
        </div>
    `;

    // Fix for unresponsive button: Explicitly wait for DOM
    setTimeout(() => {
        const btn = document.getElementById('submit-btn');
        if(btn) {
            btn.onclick = () => window.submitRegistration(role);
        }
    }, 100);
}

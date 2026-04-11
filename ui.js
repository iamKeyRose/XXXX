// Function to show Role Selection
function renderRoleSelection() {
    const main = document.getElementById('main-content');
    main.innerHTML = `
        <div class="card" style="margin-top: 50px;">
            <h2>Choose Your Role</h2>
            <p>Are you planning or providing?</p>
            <button onclick="renderRegistrationForm('planner')" class="btn btn-planner" style="margin-bottom:10px;">Event Planner</button>
            <button onclick="renderRegistrationForm('provider')" class="btn btn-provider">Service Provider</button>
        </div>
    `;
}

// Function to show Registration
function renderRegistrationForm(role) {
    const main = document.getElementById('main-content');
    const isProvider = (role === 'provider');
    
    main.innerHTML = `
        <div class="card">
            <h2>${isProvider ? 'Provider' : 'Planner'} Signup</h2>
            <div class="input-group">
                <label>FULL NAME / BUSINESS</label>
                <input type="text" id="reg-name" placeholder="Enter name">
            </div>
            <div class="input-group">
                <label>PHONE (WHATSAPP)</label>
                <input type="tel" id="reg-phone" placeholder="+251...">
            </div>
            <button id="submit-btn" class="btn ${isProvider ? 'btn-provider' : 'btn-planner'}">
                Complete Registration
            </button>
        </div>
    `;

    // The most reliable way to bind the button
    document.getElementById('submit-btn').onclick = () => {
        window.submitRegistration(role);
    };
}

/* --- HELPER: Multi-Carousel Generator --- */
function renderAdSlider(id, height = "140px") {
    const colors = ['#2481cc', '#f4a261', '#2a9d8f', '#e63946', '#457b9d'];
    let slidesHtml = '';
    for(let i=1; i<=10; i++) {
        slidesHtml += `<div class="slide" style="background:${colors[i%5]}"><h3>Slide ${i}</h3><p>3s Auto-running</p></div>`;
    }
    return `<div class="track-container" id="${id}" style="height: ${height}">${slidesHtml}</div>`;
}

/* --- COMPONENTS --- */
function renderCategory(icon, label) {
    return `<div class="card" onclick="handleAction('${label}')"><div style="font-size:24px">${icon}</div><div style="font-size:10px;margin-top:5px">${label}</div></div>`;
}

/* --- REGISTRATION SCREENS --- */
function renderRoleSelection() {
    document.getElementById('main-content').innerHTML = `
        <div style="padding: 20px; text-align: center;">
            <h2 style="margin-top: 40px;">Join Habesha Hub</h2>
            <div class="auth-card" onclick="setRole('guest')" style="flex-direction:column; gap:10px; cursor:pointer;">🛍️ <strong>Register as Guest</strong></div>
            <div class="auth-card" onclick="setRole('provider')" style="flex-direction:column; gap:10px; cursor:pointer;">🛠️ <strong>Register as Provider</strong></div>
        </div>`;
}

function renderManualAddressForm() {
    document.getElementById('main-content').innerHTML = `
        <div style="padding: 20px;"><h3>📍 Set Address</h3>
            <input type="text" id="city" placeholder="City" style="width:100%; padding:12px; margin-bottom:10px; border-radius:10px; border:1px solid #ddd;">
            <input type="text" id="area" placeholder="Area" style="width:100%; padding:12px; margin-bottom:20px; border-radius:10px; border:1px solid #ddd;">
            <button class="auth-btn" style="width:100%" onclick="saveManualAddress()">Finish</button>
        </div>`;
}

/* --- MAIN DASHBOARD --- */
function renderDashboard() {
    const main = document.getElementById('main-content');
    const isRegistered = userSession.role !== null;
    const user = window.Telegram.WebApp.initDataUnsafe?.user;

    main.innerHTML = `
        <header>🔵 HABESHA HUB</header>

        ${renderAdSlider('ad-main-top')}

        ${isRegistered ? `
            <div style="background: linear-gradient(135deg, #2ecc71, #27ae60); color: white; padding: 20px; border-radius: 18px; margin-bottom: 25px; box-shadow: var(--shadow);">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div><small style="opacity:0.8">BALANCE</small><h2 style="margin:0">0.00 ETB</h2></div>
                    <button class="auth-btn" style="background:white; color:#27ae60" onclick="handleAction('Deposit')">Deposit</button>
                </div>
            </div>
        ` : `
            <div class="auth-card">
                <div><strong>${user?.first_name || 'Hello'}!</strong><p style="margin:0; font-size:12px; color:var(--text-muted)">Login to access services</p></div>
                <button class="auth-btn" onclick="startRegistration()">Join</button>
            </div>
        `}

        <div class="section-header"><h3>Services</h3><b onclick="handleAction('All Services')">More</b></div>
        <div class="grid-4">${Array(16).fill(0).map(() => renderCategory('🛠️', 'Repair')).join('')}</div>

        <div class="grid-4">${Array(4).fill('<div class="ad-box square">Ad</div>').join('')}</div>
        <div class="grid-3">${Array(3).fill('<div class="ad-box rect">Ad</div>').join('')}</div>
        <div class="grid-2">${Array(2).fill('<div class="ad-box rect">Ad</div>').join('')}</div>
        <div class="ad-box rect">1 Rectangle Ad</div>
        <div class="ad-box big-sq">1 Big Square Ad</div>

        <h3>⭐ Top Rated</h3>
        <div class="grid-2">${Array(8).fill('<div class="card" style="border:1px solid gold">👤<br><b>Top Pro</b><br>⭐ 5.0</div>').join('')}</div>

        <div class="section-header" style="margin-top:20px"><h3>All Providers</h3><b onclick="handleAction('All Providers')">More</b></div>
        <div class="grid-4">
            ${Array(4).fill('<div class="card paid-gold">👤<br>PAID</div>').join('')}
            ${Array(12).fill('<div class="card">👤<br>Provider</div>').join('')}
        </div>

        <div class="grid-4">${Array(4).fill('<div class="ad-box square">Ad</div>').join('')}</div>
        <section><h3>Talent</h3><div class="grid-3">${Array(9).fill('<div class="card">Talent</div>').join('')}</div></section>
        <div class="grid-3" style="margin-top:10px">${Array(3).fill('<div class="ad-box square">Ad</div>').join('')}</div>
        <div class="big-sq">${renderAdSlider('talent-carousel', '100%')}</div>

        <div class="ad-box rect" style="margin-top:20px">Ad Above Jobs</div>
        <section><h3>Job Posts</h3><div class="grid-3">${Array(12).fill('<div class="card" style="height:100px">Job Detail</div>').join('')}</div></section>

        <div class="grid-2">
            ${renderAdSlider('bottom-c1', '120px')}
            ${renderAdSlider('bottom-c2', '120px')}
        </div>
        
        <div class="big-sq">${renderAdSlider('footer-track', '100%')}</div>
    `;
}

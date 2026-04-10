/* --- 1. DATA & CONFIG --- */
const adsData = [
    {t:"Car Wash", d:"20% Off Today", c:"#2481cc"}, 
    {t:"New Salon", d:"Opening Sale", c:"#f4a261"},
    {t:"Repair", d:"Fast Fix", c:"#2a9d8f"}, 
    {t:"Food", d:"Free Delivery", c:"#e63946"},
    {t:"Cleaning", d:"Deep Clean", c:"#457b9d"}, 
    {t:"Electric", d:"24/7 Service", c:"#ffb703"},
    {t:"Plumbing", d:"Expert Care", c:"#219ebc"}, 
    {t:"Laundry", d:"Express Wash", c:"#6d597a"},
    {t:"Gardening", d:"Full Care", c:"#52b788"}, 
    {t:"Moving", d:"Cheap Rates", c:"#355070"}
];

function shuffleAds(array) {
    return array.sort(() => Math.random() - 0.5);
}

/* --- 2. COMPONENT HELPERS --- */

function renderPaymentCard(amount) {
    return `
        <div class="card-base" style="background: linear-gradient(135deg, #2ecc71, #27ae60); color: white; padding: 20px; border-radius: 18px; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <small style="opacity: 0.8; text-transform: uppercase; font-size: 10px;">Current Balance</small>
                    <h2 style="margin: 5px 0;">${amount} ETB</h2>
                </div>
                <button class="auth-btn" style="background: white; color: #27ae60; border: none; padding: 8px 15px; border-radius: 10px; font-weight: bold;">Deposit</button>
            </div>
        </div>
    `;
}

function renderCategory(icon, label) {
    return `
        <div class="item-box" onclick="handleAction('${label}')">
            <div class="icon-sq">${icon}</div>
            <p style="margin:0; font-size:11px; font-weight:500;">${label}</p>
        </div>
    `;
}

function renderProvider(name, rating) {
    return `
        <div class="item-box provider-card" onclick="handleAction('${name}')">
            <div class="provider-img">👤</div>
            <div style="font-size: 11px; font-weight: bold; white-space: nowrap; overflow: hidden; width: 90%;">${name}</div>
            <div style="font-size: 10px; color: #f39c12; margin-top:2px;">⭐ ${rating}</div>
        </div>
    `;
}

function renderInlineAd(title, desc, color) {
    return `
        <div class="inline-ad" style="background: ${color}; color: white; border-radius: 15px; padding: 15px; margin: 25px 0; display: flex; align-items: center; gap: 15px; position: relative; overflow: hidden;" onclick="handleAction('Ad: ${title}')">
            <span style="position: absolute; top: 0; right: 0; background: rgba(255,255,255,0.2); font-size: 8px; padding: 2px 6px; border-bottom-left-radius: 8px;">SPONSORED</span>
            <div style="font-size: 24px;">🎁</div>
            <div>
                <div style="font-weight: bold; font-size: 14px;">${title}</div>
                <div style="font-size: 11px; opacity: 0.9;">${desc}</div>
            </div>
        </div>
    `;
}

function renderTopProvider(name, category, rating) {
    return `
        <div class="top-card" onclick="handleAction('Top Rated: ${name}')">
            <span class="badge-gold">TOP RATED</span>
            <div class="provider-img" style="border-color: #ffdf00; margin: 0 auto 8px;">👤</div>
            <div style="font-size: 13px; font-weight: bold;">${name}</div>
            <div style="font-size: 10px; color: var(--text-muted); margin-bottom: 5px;">${category}</div>
            <div style="font-size: 11px; color: #f39c12; font-weight: bold;">★ ${rating}</div>
        </div>
    `;
}

/* --- 3. REGISTRATION SCREENS --- */

function renderRoleSelection() {
    const main = document.getElementById('main-content');
    main.innerHTML = `
        <div style="padding: 20px; text-align: center;">
            <h2 style="margin-top: 40px;">Join Habesha Hub</h2>
            <div class="card-base" onclick="setRole('guest')" style="padding:25px; cursor: pointer; margin-bottom: 15px; border: 1px solid #eee;">
                🛍️ <strong>Register as Guest</strong>
            </div>
            <div class="card-base" onclick="setRole('provider')" style="padding:25px; cursor: pointer; border: 1px solid #eee;">
                🛠️ <strong>Register as Provider</strong>
            </div>
        </div>
    `;
}

function renderManualAddressForm() {
    const main = document.getElementById('main-content');
    main.innerHTML = `
        <div style="padding: 20px;">
            <h3>📍 Set Address</h3>
            <input type="text" id="city" placeholder="City" style="width: 100%; padding: 12px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 10px;">
            <input type="text" id="area" placeholder="Area" style="width: 100%; padding: 12px; margin-bottom: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <button class="auth-btn" style="width: 100%;" onclick="saveManualAddress()">Finish</button>
        </div>
    `;
}

/* --- 4. MAIN RENDER (ALWAYS LAST) --- */

function renderDashboard() {
    const main = document.getElementById('main-content');
    if (!main) return;

    const shuffledSlides = shuffleAds([...adsData]);
    const user = window.Telegram.WebApp.initDataUnsafe?.user;

    const authSection = userSession.role ? `
        <div>
            <strong>${user?.first_name || 'User'} (${userSession.role})</strong>
            <p style="margin:0; font-size:12px; color:var(--text-muted)">${userSession.type} verified</p>
        </div>
        <div style="font-size: 24px;">✅</div>
    ` : `
        <div>
            <strong>Habesha Hub Membership</strong>
            <p style="margin:0; font-size:12px; color:var(--text-muted)">Connect Account</p>
        </div>
        <button class="auth-btn" onclick="startRegistration()">Join</button>
    `;

    const cats = [
        {i:'🛠️', l:'Repair'}, {i:'🧹', l:'Cleaning'}, 
        {i:'🚚', l:'Delivery'}, {i:'💇', l:'Beauty'},
        {i:'🚕', l:'Taxi'}, {i:'🍱', l:'Food'}, 
        {i:'⚡', l:'Power'}, {i:'🧺', l:'Laundry'},
        {i:'🎨', l:'Paint'}, {i:'🌿', l:'Plant'}, 
        {i:'🏥', l:'Med'}, {i:'➕', l:'More'}
    ];

    const pros = [
        {n:'Abebe', r:'4.9'}, {n:'Selam', r:'5.0'}, {n:'Marta', r:'4.8'}, {n:'Kebede', r:'4.7'},
        {n:'Desta', r:'4.9'}, {n:'Hanna', r:'5.0'}, {n:'Yonas', r:'4.6'}, {n:'Bekele', r:'4.8'}
    ];

    main.innerHTML = `
        <div class="carousel-container" id="ad-track">
            ${shuffledSlides.map(s => `<div class="ad-slide" style="background:${s.c}"><h2>${s.t}</h2><p>${s.d}</p></div>`).join('')}
        </div>
        
        ${renderPaymentCard('0.00')}
        
        <div class="auth-card">${authSection}</div>

        <section>
            <h3 style="margin-bottom:10px">Services</h3>
            <div class="grid-4">${cats.map(c => renderCategory(c.i, c.l)).join('')}</div>
        </section>

        ${renderInlineAd("Premium Cleaning", "Book today and get 15% off.", "linear-gradient(135deg, #667eea, #764ba2)")}

        <section style="margin-bottom: 80px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <h3 style="margin:0">All Providers</h3>
                <span style="color:var(--primary); font-size:12px; font-weight:bold;">More</span>
            </div>
            <div class="grid-4">${pros.map(p => renderProvider(p.n, p.r)).join('')}</div>
        </section>

        <nav style="position: fixed; bottom: 0; left: 0; width: 100%; height: 65px; background: white; display: flex; justify-content: space-around; align-items: center; border-top: 1px solid #eee; z-index: 100;">
            <div onclick="handleAction('Home')" style="text-align:center; color:var(--primary)"><div style="font-size:20px">🏠</div><div style="font-size:10px">Home</div></div>
            <div onclick="handleAction('Search')" style="text-align:center; color:#888"><div style="font-size:20px">🔍</div><div style="font-size:10px">Search</div></div>
            <div onclick="handleAction('Orders')" style="text-align:center; color:#888"><div style="font-size:20px">📦</div><div style="font-size:10px">Orders</div></div>
            <div onclick="handleAction('Profile')" style="text-align:center; color:#888"><div style="font-size:20px">👤</div><div style="font-size:10px">Profile</div></div>
        </nav>
    `;
}

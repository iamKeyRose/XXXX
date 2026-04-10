/* --- COMPONENT HELPERS --- */

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

function renderPaymentCard(amount) {
    return `
        <div class="card-base" style="background: linear-gradient(135deg, #2ecc71, #27ae60); color: white; padding: 20px; border-radius: 18px; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <small style="opacity: 0.8; text-transform: uppercase; font-size: 10px;">Current Balance</small>
                    <h2 style="margin: 5px 0;">${amount} ETB</h2>
                </div>
                <button class="auth-btn" style="background: white; color: #27ae60; border: none; padding: 8px 15px; border-radius: 10px; font-weight: bold;" onclick="handlePayment()">Deposit</button>
            </div>
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

/* --- REGISTRATION SCREENS --- */

function renderRoleSelection() {
    const main = document.getElementById('main-content');
    main.innerHTML = `
        <div style="padding: 20px; text-align: center; animation: fadeIn 0.3s;">
            <h2 style="margin-top: 40px;">Join Habesha Hub</h2>
            <p style="color: var(--text-muted); margin-bottom: 30px;">Choose your primary goal</p>
            <div class="card-base" onclick="setRole('guest')" style="padding:25px; cursor: pointer; margin-bottom: 15px; border: 1px solid #eee;">
                <div style="font-size: 40px; margin-bottom: 10px;">🛍️</div>
                <strong>Register as Guest</strong>
                <p style="font-size: 11px; color: var(--text-muted);">I am looking for services/talent.</p>
            </div>
            <div class="card-base" onclick="setRole('provider')" style="padding:25px; cursor: pointer; border: 1px solid #eee;">
                <div style="font-size: 40px; margin-bottom: 10px;">🛠️</div>
                <strong>Register as Provider</strong>
                <p style="font-size: 11px; color: var(--text-muted);">I want to sell my services/talent.</p>
            </div>
        </div>
    `;
}

function renderManualAddressForm() {
    const main = document.getElementById('main-content');
    main.innerHTML = `
        <div style="padding: 20px; animation: fadeIn 0.3s;">
            <h3>📍 Set Address</h3>
            <div style="margin-top: 20px;">
                <label style="font-size: 11px; font-weight: bold;">City</label>
                <input type="text" id="city" placeholder="e.g. Addis Ababa" style="width: 100%; padding: 12px; margin: 8px 0 15px 0; border: 1px solid #ddd; border-radius: 10px;">
                <label style="font-size: 11px; font-weight: bold;">Area</label>
                <input type="text" id="area" placeholder="e.g. Bole" style="width: 100%; padding: 12px; margin: 8px 0 25px 0; border: 1px solid #ddd; border-radius: 10px;">
                <button class="auth-btn" style="width: 100%;" onclick="saveManualAddress()">Finish</button>
            </div>
        </div>
    `;
}

/* --- MAIN DASHBOARD --- */

function renderDashboard() {
    const main = document.getElementById('main-content');
    if (!main) return;

    // Logic to show "Join" or "Logged In" state
    const user = window.Telegram.WebApp.initDataUnsafe?.user;
    const authSection = userSession.role ? `
        <div>
            <strong>${user?.first_name || 'User'} (${userSession.role})</strong>
            <p style="margin:4px 0 0 0; font-size:12px; color:var(--text-muted)">${userSession.type} verified</p>
        </div>
        <div style="font-size: 24px;">✅</div>
    ` : `
        <div>
            <strong>Habesha Hub Membership</strong>
            <p style="margin:4px 0 0 0; font-size:12px; color:var(--text-muted)">Connect Account</p>
        </div>
        <button class="auth-btn" onclick="startRegistration()">Join</button>
    `;

    const slides = [{t:"Car Wash", d:"20% Off", c:"#2481cc"}, {t:"Salon", d:"Sale", c:"#f4a261"}, {t:"Repair", d:"Fast", c:"#2a9d8f"}];
    const cats = [{i:'🛠️', l:'Repair'}, {i:'🧹', l:'Cleaning'}, {i:'🚚', l:'Delivery'}, {i:'💇', l:'Beauty'}];
    const tops = [{n: 'Abebe C.', c: 'Repair', r: '5.0'}, {n: 'Selam H.', c: 'Cleaning', r: '4.9'}];
    const pros = [{n:'Abebe', r:'4.9'}, {n:'Selam', r:'5.0'}, {n:'Marta', r:'4.8'}, {n:'Kebede', r:'4.7'}];

    main.innerHTML = `
        <div class="carousel-container">
            ${slides.map(s => `<div class="ad-slide" style="background:${s.c}"><h2>${s.t}</h2><p>${s.d}</p></div>`).join('')}
        </div>
        ${renderPaymentCard('0.00')}
        <div class="auth-card">${authSection}</div>
        <section>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px">
                <h3 style="margin:0">Services</h3><span style="color:var(--primary); font-size:12px; font-weight:bold">View All</span>
            </div>
            <div class="grid-4">${cats.map(c => renderCategory(c.i, c.l)).join('')}</div>
        </section>
        ${renderInlineAd("Premium Cleaning", "Book today and get 15% off.", "linear-gradient(135deg, #667eea, #764ba2)")}
        <section style="margin-bottom: 25px;">
            <h3 style="margin-bottom: 10px;">⭐ Top Rated</h3>
            <div class="top-rated-scroll" style="display: flex; gap: 15px; overflow-x: auto; padding-bottom: 10px; scrollbar-width: none;">
                ${tops.map(t => renderTopProvider(t.n, t.c, t.r)).join('')}
            </div>
        </section>
        <section style="margin-bottom: 80px;">
            <h3 style="margin-bottom: 5px;">All Providers</h3>
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

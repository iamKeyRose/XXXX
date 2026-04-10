// --- COMPONENT HELPERS ---

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

// --- ACTION HANDLERS ---

function handleAction(msg) {
    const tg = window.Telegram.WebApp;
    tg.HapticFeedback.impactOccurred('light');
    tg.showAlert('You selected: ' + msg);
}

// --- MAIN RENDER FUNCTION ---

function renderDashboard() {
    const main = document.getElementById('main-content');
    if (!main) return;

    // Data Arrays
    const slides = [
        {t:"Car Wash", d:"20% Off Today", c:"#2481cc"}, {t:"New Salon", d:"Opening Sale", c:"#f4a261"},
        {t:"Repair", d:"Fast Fix", c:"#2a9d8f"}, {t:"Food", d:"Free Delivery", c:"#e63946"},
        {t:"Cleaning", d:"Deep Clean", c:"#457b9d"}, {t:"Electric", d:"24/7 Service", c:"#ffb703"},
        {t:"Plumbing", d:"Expert Care", c:"#219ebc"}, {t:"Laundry", d:"Express Wash", c:"#6d597a"},
        {t:"Gardening", d:"Full Care", c:"#52b788"}, {t:"Moving", d:"Cheap Rates", c:"#355070"}
    ];

    const tops = [
        {n: 'Abebe C.', c: 'Repair', r: '5.0'},
        {n: 'Selam H.', c: 'Cleaning', r: '4.9'},
        {n: 'Marta L.', c: 'Beauty', r: '5.0'}
    ];

    const cats = [
        {i:'🛠️', l:'Repair'}, {i:'🧹', l:'Cleaning'}, {i:'🚚', l:'Delivery'}, {i:'💇', l:'Beauty'},
        {i:'🚕', l:'Taxi'}, {i:'🍱', l:'Food'}, {i:'⚡', l:'Electric'}, {i:'🧺', l:'Laundry'},
        {i:'👨‍🎨', l:'Painting'}, {i:'🌿', l:'Garden'}, {i:'🏥', l:'Health'}, {i:'➕', l:'More'}
    ];

    const pros = [
        {n:'Abebe', r:'4.9'}, {n:'Selam', r:'5.0'}, {n:'Marta', r:'4.8'}, {n:'Kebede', r:'4.7'},
        {n:'Desta', r:'4.9'}, {n:'Hanna', r:'5.0'}, {n:'Yonas', r:'4.6'}, {n:'Bekele', r:'4.8'}
    ];

    // Assembly
    main.innerHTML = `
        <div class="carousel-container">
            ${slides.map(s => `<div class="ad-slide" style="background:${s.c}"><h2>${s.t}</h2><p>${s.d}</p></div>`).join('')}
        </div>

        ${renderPaymentCard('0.00')}

        <div class="auth-card">
            <div><strong>Habesha Hub Membership</strong><p style="margin:4px 0 0 0; font-size:12px; color:var(--text-muted)">Login to track orders</p></div>
            <button class="auth-btn" onclick="handleTelegramLogin()">Join with Telegram</button>
        </div>

        <section style="margin-bottom: 25px;">
            <h3 style="margin-bottom: 10px;">⭐ Top Rated</h3>
            <div class="top-rated-scroll" style="display: flex; gap: 15px; overflow-x: auto; scrollbar-width: none;">
                ${tops.map(t => renderTopProvider(t.n, t.c, t.r)).join('')}
            </div>
        </section>

        <section style="margin-bottom:25px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px">
                <h3 style="margin:0">Services</h3><span style="color:var(--primary); font-size:12px; font-weight:bold">View All</span>
            </div>
            <div class="grid-4">${cats.map(c => renderCategory(c.i, c.l)).join('')}</div>
        </section>

        <div class="promo-row">
            <div class="promo-box" style="background: #ffebee; color: #c62828;">Flash Sale</div>
            <div class="promo-box" style="background: #e8f5e9; color: #2e7d32;">New Tech</div>
            <div class="promo-box" style="background: #e3f2fd; color: #1565c0;">Hot Deals</div>
        </div>

        <section>
            <h3 style="margin-bottom:10px">All Providers</h3>
            <div class="grid-4">${pros.map(p => renderProvider(p.n, p.r)).join('')}</div>
        </section>
    `;
}

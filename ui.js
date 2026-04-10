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

function handleAction(msg) {
    const tg = window.Telegram.WebApp;
    tg.HapticFeedback.impactOccurred('light');
    tg.showAlert('You selected: ' + msg);
}

function renderDashboard() {
    const main = document.getElementById('main-content');


    
    const slides = [
        {t:"Car Wash", d:"20% Off Today", c:"#2481cc"}, {t:"New Salon", d:"Opening Sale", c:"#f4a261"},
        {t:"Repair", d:"Fast Fix", c:"#2a9d8f"}, {t:"Food", d:"Free Delivery", c:"#e63946"},
        {t:"Cleaning", d:"Deep Clean", c:"#457b9d"}, {t:"Electric", d:"24/7 Service", c:"#ffb703"},
        {t:"Plumbing", d:"Expert Care", c:"#219ebc"}, {t:"Laundry", d:"Express Wash", c:"#6d597a"},
        {t:"Gardening", d:"Full Care", c:"#52b788"}, {t:"Moving", d:"Cheap Rates", c:"#355070"}
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

    main.innerHTML = `
        <div class="carousel-container">
            ${slides.map(s => `<div class="ad-slide" style="background:${s.c}"><h2>${s.t}</h2><p>${s.d}</p></div>`).join('')}
        </div>

        <div class="auth-card">
            <div><strong>Habesha Hub Membership</strong><p style="margin:4px 0 0 0; font-size:12px; color:var(--text-muted)">Login to track orders</p></div>
            <button class="auth-btn" onclick="handleTelegramLogin()">Join with Telegram</button>
        </div>

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
            <h3 style="margin-bottom:10px">Featured Providers</h3>
            <div class="grid-4">${pros.map(p => renderProvider(p.n, p.r)).join('')}</div>
        </section>
    `;
}

// Reusable Component: Category
function renderCategory(icon, label) {
    return `
        <div class="item-vertical" onclick="handleAction('Category: ${label}')">
            <div class="icon-box">${icon}</div>
            <p style="margin:0; font-size:11px; font-weight:500;">${label}</p>
        </div>
    `;
}

// Reusable Component: Provider
function renderProvider(name, rating) {
    return `
        <div class="item-vertical" onclick="handleAction('Provider: ${name}')" style="background:white; padding:10px; border-radius:15px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
            <div class="provider-logo">👤</div>
            <div style="font-size: 11px; font-weight: bold; white-space: nowrap; overflow: hidden; width: 100%;">${name}</div>
            <div style="font-size: 10px; color: #f39c12;">⭐ ${rating}</div>
        </div>
    `;
}

function handleAction(msg) {
    const tg = window.Telegram.WebApp;
    tg.HapticFeedback.impactOccurred('light');
    tg.showAlert(msg);
}

function renderDashboard() {
    const main = document.getElementById('main-content');
    if (!main) return;

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
            <div class="ad-slide" style="background: linear-gradient(135deg, var(--primary), var(--primary-dark));">
                <h2 style="margin:0">Car Wash</h2><p>20% Off Today</p>
            </div>
            <div class="ad-slide" style="background: linear-gradient(135deg, #f4a261, #e76f51);">
                <h2 style="margin:0">New Salon</h2><p>Special Opening Rate</p>
            </div>
        </div>

        <div class="card-base auth-card">
            <div><strong>Habesha Hub</strong><br><small style="color:var(--text-muted)">Login for more</small></div>
            <button class="auth-btn">Join</button>
        </div>

        <section style="margin-bottom:25px;">
            <h3>Our Services</h3>
            <div class="grid-4">
                ${cats.map(c => renderCategory(c.i, c.l)).join('')}
            </div>
        </section>

        <div class="promo-row">
            <div class="promo-box" style="background: #ffebee; color: #c62828;">Flash Sale</div>
            <div class="promo-box" style="background: #e8f5e9; color: #2e7d32;">New Tech</div>
            <div class="promo-box" style="background: #e3f2fd; color: #1565c0;">Hot Deals</div>
        </div>

        <section>
            <h3>Featured Providers</h3>
            <div class="grid-4">
                ${pros.map(p => renderProvider(p.n, p.r)).join('')}
            </div>
        </section>
    `;
}

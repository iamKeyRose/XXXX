function renderCategory(icon, label) {
    return `
        <div class="cat-item" onclick="handleCategoryClick('${label}')">
            <div class="icon-circle">${icon}</div>
            <p>${label}</p>
        </div>
    `;
}

function renderProvider(name, rating) {
    return `
        <div class="provider-item">
            <div class="provider-logo">👤</div>
            <div style="font-size: 12px; font-weight: bold; margin-bottom: 4px;">${name}</div>
            <div style="font-size: 11px; color: #f39c12;">⭐ ${rating}</div>
        </div>
    `;
}

function handleCategoryClick(category) {
    const tg = window.Telegram.WebApp;
    tg.HapticFeedback.impactOccurred('light');
    tg.showAlert('Selected: ' + category);
}

function renderDashboard() {
    const main = document.getElementById('main-content');
    if (!main) return;

    const categories = [
        {i:'🛠️', l:'Repair'}, {i:'🧹', l:'Cleaning'}, {i:'🚚', l:'Delivery'}, {i:'💇', l:'Beauty'},
        {i:'🚕', l:'Taxi'}, {i:'🍱', l:'Food'}, {i:'⚡', l:'Electric'}, {i:'🧺', l:'Laundry'},
        {i:'👨‍🎨', l:'Painting'}, {i:'🌿', l:'Garden'}, {i:'🏥', l:'Health'}, {i:'➕', l:'More'}
    ];

    main.innerHTML = `
        <div class="carousel-container">
            <div class="ad-slide" style="background: linear-gradient(135deg, #2481cc, #1a5f96);">
                <h2 style="margin:0">Car Wash</h2><p>20% Off Today</p>
            </div>
            <div class="ad-slide" style="background: linear-gradient(135deg, #f4a261, #e76f51);">
                <h2 style="margin:0">New Salon</h2><p>Special Opening Rate</p>
            </div>
        </div>

        <div class="auth-card">
            <div><strong>Habesha Hub</strong><br><small style="color:#888">Login to save address</small></div>
            <button class="auth-btn">Join</button>
        </div>

        <section>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <h3 style="margin:0">Our Services</h3>
                <span style="color:var(--primary); font-size:12px; font-weight:bold;">View All</span>
            </div>
            <div class="category-grid">
                ${categories.map(c => renderCategory(c.i, c.l)).join('')}
            </div>
        </section>

        <div class="promo-row">
            <div class="promo-box" style="background: #ffebee; color: #c62828;">Flash Sale</div>
            <div class="promo-box" style="background: #e8f5e9; color: #2e7d32;">New Tech</div>
            <div class="promo-box" style="background: #e3f2fd; color: #1565c0;">Hot Deals</div>
        </div>

        <section>
            <h3 style="margin: 0 0 10px 0">Top Providers</h3>
            <div class="provider-scroll">
                ${renderProvider('Abebe', '4.9')}
                ${renderProvider('Selam', '5.0')}
                ${renderProvider('Marta', '4.8')}
                ${renderProvider('Kebede', '4.7')}
                ${renderProvider('Desta', '4.9')}
            </div>
        </section>
    `;
}

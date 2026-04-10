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
            <div style="font-size: 12px; font-weight: bold;">${name}</div>
            <div style="font-size: 10px; color: #f39c12;">⭐ ${rating}</div>
        </div>
    `;
}

function handleCategoryClick(category) {
    const tg = window.Telegram.WebApp;
    tg.HapticFeedback.impactOccurred('light');
    tg.showAlert('Category: ' + category);
}

function renderDashboard() {
    const main = document.getElementById('main-content');
    if (!main) return;

    const categories = [
        {i:'🛠️', l:'Repair'}, {i:'🧹', l:'Cleaning'}, {i:'🚚', l:'Delivery'}, {i:'💇', l:'Beauty'},
        {i:'🚕', l:'Taxi'}, {i:'🍱', l:'Food'}, {i:'⚡', l:'Electric'}, {i:'➕', l:'More'}
    ];

    main.innerHTML = `
        <div class="carousel-container">
            <div class="ad-slide" style="background: linear-gradient(135deg, #2481cc, #1a5f96);">
                <h2>20% OFF</h2><p>House Cleaning</p>
            </div>
            <div class="ad-slide" style="background: linear-gradient(135deg, #f4a261, #e76f51);">
                <h2>NEW</h2><p>Plumbing Services</p>
            </div>
        </div>

        <div class="auth-card">
            <div><strong>Join Hub</strong><br><small>Unlock rewards</small></div>
            <button class="auth-btn">Join</button>
        </div>

        <section>
            <h3 style="margin-bottom:10px">Services</h3>
            <div class="category-grid">
                ${categories.map(c => renderCategory(c.i, c.l)).join('')}
            </div>
        </section>

        <section>
            <h3>Providers</h3>
            <div class="provider-scroll">
                ${renderProvider('Abebe', '4.9')}
                ${renderProvider('Selam', '5.0')}
                ${renderProvider('Marta', '4.8')}
                ${renderProvider('Kebede', '4.7')}
            </div>
        </section>
    `;
}

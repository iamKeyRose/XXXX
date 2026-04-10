// --- 1. HELPER FUNCTIONS (Must be at the top) ---

function renderCategory(icon, label) {
    return `
        <div class="cat-item" onclick="handleCategoryClick('${label}')">
            <span class="icon-circle">${icon}</span>
            <p>${label}</p>
        </div>
    `;
}

function renderProvider(name, rating) {
    return `
        <div class="provider-item">
            <div class="provider-card">${name}</div>
            <span class="rating">⭐ ${rating}</span>
        </div>
    `;
}

function handleCategoryClick(category) {
    const tg = window.Telegram.WebApp;
    if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
    tg.showAlert('Selected: ' + category);
}

// --- 2. MAIN RENDER FUNCTION ---

function renderDashboard() {
    const main = document.getElementById('main-content');
    if (!main) return;

    main.innerHTML = `
        <div class="carousel-container">
            <div class="carousel-track">
                <div class="ad-slide" style="background: #2481cc;"><h2>Car Wash 20% Off</h2></div>
                <div class="ad-slide" style="background: #f4a261;"><h2>New Beauty Salon</h2></div>
                <div class="ad-slide" style="background: #2a9d8f;"><h2>Home Delivery</h2></div>
            </div>
        </div>

        <div class="auth-card">
            <div>
                <strong>Welcome to Habesha Hub</strong>
                <p style="font-size: 12px; margin: 5px 0 0 0; opacity: 0.8;">Track orders and earn points.</p>
            </div>
            <button class="auth-btn" onclick="tg.showAlert('Login coming soon!')">Join</button>
        </div>

        <section>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h3>Our Services</h3>
                <small style="color: #2481cc;">View All</small>
            </div>
            <div class="category-grid">
                ${renderCategory('🛠️', 'Repair')}
                ${renderCategory('🧹', 'Cleaning')}
                ${renderCategory('🚚', 'Delivery')}
                ${renderCategory('💇', 'Beauty')}
                ${renderCategory('🚕', 'Taxi')}
                ${renderCategory('🍱', 'Food')}
                ${renderCategory('⚡', 'Electric')}
                ${renderCategory('➕', 'More')}
            </div>
        </section>

        <div class="small-ads-container">
            <div class="ad-mini" style="background: #ffebee;">Promo 1</div>
            <div class="ad-mini" style="background: #e8f5e9;">Promo 2</div>
            <div class="ad-mini" style="background: #e3f2fd;">Promo 3</div>
        </div>

        <section>
            <h3>Featured Providers</h3>
            <div class="provider-scroll">
                ${renderProvider('Provider 1', '4.9')}
                ${renderProvider('Provider 2', '4.8')}
                ${renderProvider('Provider 3', '5.0')}
                ${renderProvider('Provider 4', '4.7')}
                ${renderProvider('Provider 5', '4.9')}
            </div>
        </section>
    `;
}

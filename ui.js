// 1. Define the main function that builds the dashboard
function renderDashboard() {
    const main = document.getElementById('main-content');
    if (!main) return;

    main.innerHTML = `
        <div class="ad-box-large">
            <small>NEW ARRIVAL</small>
            <h2>Premium Cleaning</h2>
            <button class="btn-mini">Book Now</button>
        </div>

        <section>
            <h3>Quick Services</h3>
            <div class="category-grid">
                ${renderCategory('🛠️', 'Repair')}
                ${renderCategory('🧹', 'Cleaning')}
                ${renderCategory('🚚', 'Delivery')}
                ${renderCategory('💇', 'Beauty')}
            </div>
        </section>

        <section>
            <h3>Top Rated Providers</h3>
            <div class="provider-scroll">
                <div class="provider-card">Logo 1</div>
                <div class="provider-card">Logo 2</div>
                <div class="provider-card">Logo 3</div>
                <div class="provider-card">Logo 4</div>
            </div>
        </section>
    `;
}

// 2. THIS IS THE MISSING PIECE: The helper function
function renderCategory(icon, label) {
    return `
        <div class="cat-item" onclick="handleCategoryClick('${label}')">
            <span class="icon-circle">${icon}</span>
            <p>${label}</p>
        </div>
    `;
}

// 3. Simple click handler for the icons
function handleCategoryClick(category) {
    const tg = window.Telegram.WebApp;
    tg.HapticFeedback.impactOccurred('light');
    tg.showAlert('Selected Service: ' + category);
}

function renderDashboard() {
    const main = document.getElementById('main-content');
    
    main.innerHTML = `
        <div class="ad-box-large">Promotional Banner</div>

        <section class="section">
            <h3>Categories</h3>
            <div class="category-grid">
                ${renderCategory('🛠️', 'Repair')}
                ${renderCategory('🧹', 'Cleaning')}
                ${renderCategory('🚚', 'Delivery')}
                ${renderCategory('💇', 'Beauty')}
            </div>
        </section>

        <div class="ad-box-small">Special Discount!</div>

        <section class="section">
            <h3>Featured Providers</h3>
            <div class="provider-scroll" id="provider-list">
                <div class="provider-logo">Logo 1</div>
                <div class="provider-logo">Logo 2</div>
                <div class="provider-logo">Logo 3</div>
            </div>
        </section>
    `;
}

function renderCategory(icon, label) {
    return `
        <div class="cat-item">
            <span class="icon-circle">${icon}</span>
            <p>${label}</p>
        </div>
    `;
}

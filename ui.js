function renderDashboard() {
    const main = document.getElementById('main-content');
    
    main.innerHTML = `
        <div class="carousel-container">
            <div class="carousel-track">
                <div class="ad-slide main-blue"><h2>Car Wash 20% Off</h2></div>
                <div class="ad-slide main-gold"><h2>New Beauty Salon</h2></div>
                <div class="ad-slide main-green"><h2>Home Delivery</h2></div>
            </div>
        </div>

        <div class="auth-card">
            <div>
                <strong>Welcome to Habesha Hub</strong>
                <p>Track your orders and earn points.</p>
            </div>
            <button class="auth-btn">Join Now</button>
        </div>

        <section>
            <div class="section-header">
                <h3>Our Services</h3>
                <a href="#" onclick="showAllCategories()">View All</a>
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
            <div class="ad-mini">Promo 1</div>
            <div class="ad-mini">Promo 2</div>
            <div class="ad-mini">Promo 3</div>
        </div>

        <section>
            <h3>Featured Providers</h3>
            <div class="provider-scroll">
                ${renderProvider('Logo 1', '4.9')}
                ${renderProvider('Logo 2', '4.8')}
                ${renderProvider('Logo 3', '5.0')}
                ${renderProvider('Logo 4', '4.7')}
                </div>
        </section>
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

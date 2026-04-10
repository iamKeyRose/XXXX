function renderDashboard() {
    const main = document.getElementById('main-content');
    
    main.innerHTML = `
        <div class="ad-box-large">
            <small style="opacity: 0.8;">NEW ARRIVAL</small>
            <h2 style="margin: 5px 0;">Premium Cleaning</h2>
            <button style="width: fit-content; padding: 6px 12px; border-radius: 20px; border: none; font-weight: bold; color: #2481cc;">Book Now</button>
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
                <div class="provider-card"><span>Logo</span></div>
                <div class="provider-card"><span>Logo</span></div>
                <div class="provider-card"><span>Logo</span></div>
                <div class="provider-card"><span>Logo</span></div>
                <div class="provider-card"><span>Logo</span></div>
            </div>
        </section>
    `;
}

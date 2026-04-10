/* --- HELPER: Multi-Carousel Generator --- */
function renderAdSlider(id, height = "140px") {
    const colors = ['#2481cc', '#f4a261', '#2a9d8f', '#e63946', '#457b9d'];
    let slidesHtml = '';
    for(let i=1; i<=10; i++) {
        slidesHtml += `
            <div class="slide" 
                 onclick="handleAction('Promo Slide ${i}')" 
                 style="background:${colors[i%5]}; cursor:pointer;">
                <h3>Special Offer ${i}</h3>
                <p>Click to View Details</p>
            </div>`;
    }
    return `<div class="track-container" id="${id}" style="height: ${height}">${slidesHtml}</div>`;
}

/* --- COMPONENTS --- */
function renderCategory(icon, label) {
    // We pass the label so handleAction knows which category to fetch
    return `
        <div class="card" onclick="handleAction('category', '${label}')" style="cursor:pointer;">
            <div style="font-size:24px">${icon}</div>
            <div style="font-size:10px;margin-top:5px">${label}</div>
        </div>`;
}


/* --- REGISTRATION SCREENS --- */
function renderRoleSelection() {
    document.getElementById('main-content').innerHTML = `
        <div style="padding: 20px; text-align: center;">
            <h2 style="margin-top: 40px;">Join Habesha Hub</h2>
            <div class="auth-card" onclick="setRole('guest')" style="flex-direction:column; gap:10px; cursor:pointer; padding:25px;">
                <span style="font-size:30px">🛍️</span><strong>Register as Guest</strong>
            </div>
            <div class="auth-card" onclick="setRole('provider')" style="flex-direction:column; gap:10px; cursor:pointer; padding:25px;">
                <span style="font-size:30px">🛠️</span><strong>Register as Provider</strong>
            </div>
        </div>`;
}

function renderPostForm(type) {
    const main = document.getElementById('main-content');
    const label = type.charAt(0).toUpperCase() + type.slice(1);

    main.innerHTML = `
        <div style="padding: 10px;">
            <button onclick="renderDashboard()" style="background:none; border:none; color:var(--primary); font-weight:bold; margin-bottom:15px;">← Back</button>
            <h3>Post new ${label}</h3>
            
            <div class="card" style="text-align:left; padding:20px;">
                <label style="font-size:12px; color:#888;">Title / Specialty</label>
                <input type="text" id="post-title" placeholder="e.g. Expert Electrician" style="width:100%; padding:12px; margin:8px 0 15px 0; border:1px solid #ddd; border-radius:10px;">
                
                <label style="font-size:12px; color:#888;">Description</label>
                <textarea id="post-desc" rows="4" placeholder="Describe your service or needs..." style="width:100%; padding:12px; margin:8px 0 15px 0; border:1px solid #ddd; border-radius:10px; font-family:sans-serif;"></textarea>
                
                <label style="font-size:12px; color:#888;">Price (ETB)</label>
                <input type="number" id="post-price" placeholder="0.00" style="width:100%; padding:12px; margin:8px 0 20px 0; border:1px solid #ddd; border-radius:10px;">
                
                <button class="auth-btn" style="width:100%" onclick="submitPost('${type}')">Publish Post</button>
            </div>
        </div>
    `;
}


async function showCategoryItems(categoryName) {
    const main = document.getElementById('main-content');
    main.innerHTML = `<div style="padding:20px; text-align:center;">Searching for ${categoryName}...</div>`;

    // Fetch only items matching this category
    const { data, error } = await dbClient
        .from('listings')
        .select('*')
        .eq('type', categoryName.toLowerCase()) // Match the category name
        .eq('status', 'active');

    if (error) {
        tg.showAlert("Error: " + error.message);
        return;
    }

    let listHtml = `
        <div style="display:flex; align-items:center; gap:10px; margin-bottom:15px;">
            <button onclick="renderDashboard()" style="background:none; border:none; color:var(--primary); font-size:18px;">←</button>
            <h2 style="margin:0">${categoryName}</h2>
        </div>`;

    if (data.length === 0) {
        listHtml += `<div style="text-align:center; padding:40px; color:#888;">No ${categoryName} listed yet.</div>`;
    } else {
        listHtml += `<div class="grid-2">`;
        data.forEach(item => {
            listHtml += `
                <div class="card" onclick="tg.showAlert('${item.description}')">
                    <div style="font-size:30px">📦</div>
                    <div style="font-weight:bold; margin-top:5px;">${item.title}</div>
                    <div style="color:var(--primary); font-size:12px;">${item.price} ETB</div>
                </div>`;
        });
        listHtml += `</div>`;
    }

    main.innerHTML = `<div style="padding:15px;">${listHtml}</div>`;
}


function renderManualAddressForm() {
    document.getElementById('main-content').innerHTML = `
        <div style="padding: 20px;"><h3>📍 Set Address</h3>
            <input type="text" id="city" placeholder="City" style="width:100%; padding:12px; margin-bottom:10px; border-radius:10px; border:1px solid #ddd;">
            <input type="text" id="area" placeholder="Area" style="width:100%; padding:12px; margin-bottom:20px; border-radius:10px; border:1px solid #ddd;">
            <button class="auth-btn" style="width:100%" onclick="saveManualAddress()">Finish</button>
        </div>`;
}

/* --- MAIN DASHBOARD --- */
function renderDashboard() {
    const main = document.getElementById('main-content');
    const isRegistered = userSession.role !== null;
    const user = window.Telegram.WebApp.initDataUnsafe?.user;

    main.innerHTML = `
        ${renderAdSlider('ad-main-top')}

        ${isRegistered ? `
            <div style="background: linear-gradient(135deg, #2ecc71, #27ae60); color: white; padding: 20px; border-radius: 18px; margin-bottom: 25px; box-shadow: var(--shadow);">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <small style="opacity:0.8">BALANCE</small>
                        <h2 style="margin:0">${userSession.balance.toFixed(2)} ETB</h2>
                    </div>
                    <button class="auth-btn" style="background:white; color:#27ae60" onclick="handleAction('Deposit')">Deposit</button>
                </div>
            </div>
        ` : `
            <div class="auth-card" onclick="startRegistration()" style="cursor:pointer;">
                <div><strong>${user?.first_name || 'Hello'}!</strong><p style="margin:0; font-size:12px; color:var(--text-muted)">Join to access services</p></div>
                <button class="auth-btn">Join</button>
            </div>
        `}

        <div class="section-header"><h3>Services</h3><b onclick="handleAction('All Services')">More</b></div>
        <div class="grid-4">${Array(8).fill(0).map(() => renderCategory('🛠️', 'Repair')).join('')}</div>

        <div class="ad-box rect" onclick="handleAction('Banner Ad 1')" style="cursor:pointer;">Featured Banner Ad</div>

        <h3>⭐ Top Rated</h3>
        <div class="grid-2">
            ${Array(4).fill(0).map((_, i) => `
                <div class="card" onclick="handleAction('Top Pro ${i+1}')" style="border:1px solid gold; cursor:pointer;">
                    👤<br><b>Top Pro</b><br>⭐ 5.0
                </div>`).join('')}
        </div>

        <div class="section-header" style="margin-top:20px"><h3>All Providers</h3><b onclick="handleAction('All Providers')">More</b></div>
        <div class="grid-4">
            ${Array(4).fill(0).map((_, i) => `
                <div class="card paid-gold" onclick="handleAction('Paid Provider ${i+1}')" style="cursor:pointer;">
                    👤<br>PAID
                </div>`).join('')}
        </div>

        <div class="big-sq" style="cursor:pointer;">${renderAdSlider('talent-carousel', '100%')}</div>

        <nav>
    <div onclick="handleAction('Home')" style="text-align:center; color:var(--primary); cursor:pointer;">
        <div style="font-size:20px">🏠</div><div style="font-size:10px">Home</div>
    </div>
    <div onclick="handleAction('Search')" style="text-align:center; color:#888; cursor:pointer;">
        <div style="font-size:20px">🔍</div><div style="font-size:10px">Search</div>
    </div>
    
    <div onclick="openPostMenu()" style="text-align:center; margin-top:-30px;">
        <div style="background:var(--primary); width:50px; height:50px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:white; font-size:30px; box-shadow:0 4px 10px rgba(36,129,204,0.4); border:4px solid white;">+</div>
        <div style="font-size:10px; color:var(--primary); margin-top:5px; font-weight:bold;">Post</div>
    </div>

    <div onclick="handleAction('Orders')" style="text-align:center; color:#888; cursor:pointer;">
        <div style="font-size:20px">📦</div><div style="font-size:10px">Orders</div>
    </div>
    <div onclick="handleAction('Profile')" style="text-align:center; color:#888; cursor:pointer;">
        <div style="font-size:20px">👤</div><div style="font-size:10px">Profile</div>
    </div>
</nav>

    `;
}

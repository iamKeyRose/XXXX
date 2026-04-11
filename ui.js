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
    const main = document.getElementById('main-content');
    main.innerHTML = `
        <div style="padding:30px; text-align:center;">
            <h2>Welcome to Evently</h2>
            <p>How would you like to use the platform?</p>
            
            <div onclick="renderRegistrationForm('planner')" class="card" style="margin-bottom:15px; border:2px solid var(--primary); padding:20px;">
                <div style="font-size:40px;">📅</div>
                <h3 style="margin:10px 0;">I'm Planning an Event</h3>
                <small>Find providers and manage my budget</small>
            </div>

            <div onclick="renderRegistrationForm('provider')" class="card" style="border:2px solid #2ecc71; padding:20px;">
                <div style="font-size:40px;">🏢</div>
                <h3 style="margin:10px 0;">I'm a Service Provider</h3>
                <small>Grow my business and find clients</small>
            </div>
        </div>
    `;
}

function renderRegistrationForm(role) {
    const main = document.getElementById('main-content');
    
    // Customize text based on the choice made in Role Selection
    const title = role === 'provider' ? 'Service Provider Signup' : 'Event Planner Signup';
    const subtext = role === 'provider' ? 'Start growing your event business today.' : 'Plan your perfect event within budget.';
    const buttonColor = role === 'provider' ? '#2ecc71' : 'var(--primary)';

    main.innerHTML = `
        <div style="padding:25px; text-align:center;">
            <button onclick="renderRoleSelection()" style="background:none; border:none; color:#888; float:left;">← Back</button>
            <div style="clear:both;"></div>
            
            <div style="font-size:50px; margin-top:10px;">${role === 'provider' ? '🏢' : '📅'}</div>
            <h2 style="margin-top:10px;">${title}</h2>
            <p style="color:#666; font-size:14px;">${subtext}</p>
            
            <div style="margin-top:20px; text-align:left;">
                <label style="font-size:12px; font-weight:bold; color:#555;">FULL NAME / BUSINESS NAME</label>
                <input type="text" id="reg-name" placeholder="Enter name" style="width:100%; padding:12px; margin:8px 0 20px 0; border-radius:8px; border:1px solid #ddd;">
                
                <label style="font-size:12px; font-weight:bold; color:#555;">WHATSAPP / PHONE</label>
                <input type="tel" id="reg-phone" placeholder="+251..." style="width:100%; padding:12px; margin:8px 0 20px 0; border-radius:8px; border:1px solid #ddd;">
                
                ${role === 'provider' ? `
                    <div style="background:#f9f9f9; padding:10px; border-radius:8px; margin-bottom:20px; border-left:4px solid #2ecc71;">
                        <small style="color:#555;">Note: Providers pay a <b>345 ETB</b> registration fee to access client leads.</small>
                    </div>
                ` : ''}
            </div>

            <button onclick="submitRegistration('${role}')" 
                    style="width:100%; padding:16px; background:${buttonColor}; color:white; border:none; border-radius:12px; font-weight:bold; font-size:16px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                Create My Account
            </button>
        </div>
    `;
}


async function showCategoryItems(categoryName) {
    const main = document.getElementById('main-content');
    main.innerHTML = `<div style="padding:20px; text-align:center;">Searching for ${categoryName}...</div>`;

    const { data, error } = await dbClient
        .from('listings')
        .select('*')
        // FIX 1: Use ilike for case-insensitive search (Repair == repair)
        .ilike('type', categoryName) 
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

    if (!data || data.length === 0) {
        listHtml += `<div style="text-align:center; padding:40px; color:#888;">No ${categoryName} listed yet.</div>`;
    } else {
        listHtml += `<div class="grid-2">`;
        data.forEach(item => {
            // FIX 2: Changed from showAlert to viewListingDetail
            listHtml += `
                <div class="card" onclick="viewListingDetail('${item.id}')" style="cursor:pointer;">
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

function renderProfileDetail(item) {
    const main = document.getElementById('main-content');
    const owner = item.owner || {};

    main.innerHTML = `
        <div style="padding: 15px; padding-bottom: 80px;">
            <button onclick="renderDashboard()" style="background:none; border:none; color:var(--primary); font-weight:bold; margin-bottom:15px;">← Back</button>
            
            <div class="card" style="text-align:center; padding:20px;">
                <div style="font-size:60px;">👤</div>
                <h2 style="margin:10px 0 5px 0;">${item.title}</h2>
                <p style="color:#888; margin:0;">${owner.first_name || 'Anonymous'} • ${owner.city || 'Location N/A'}</p>
                <div style="margin-top:10px; font-weight:bold; color:var(--primary); font-size:20px;">${item.price} ETB</div>
            </div>

            <div style="display:flex; justify-content:space-between; margin:20px 0; gap:10px;">
                <div class="card" style="flex:1; text-align:center; padding:10px;">
                    <div style="font-size:12px; color:#888;">Rating</div>
                    <div style="font-weight:bold;">⭐ 4.9</div>
                </div>
                <div class="card" style="flex:1; text-align:center; padding:10px;">
                    <div style="font-size:12px; color:#888;">Deals</div>
                    <div style="font-weight:bold;">124</div>
                </div>
                <div class="card" style="flex:1; text-align:center; padding:10px;">
                    <div style="font-size:12px; color:#888;">Reviews</div>
                    <div style="font-weight:bold;">89</div>
                </div>
            </div>

            <div class="card" style="padding:15px; text-align:left;">
                <h4 style="margin-top:0;">About this Talent</h4>
                <p style="font-size:14px; color:#444; line-height:1.5;">${item.description}</p>
            </div>

            <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:10px; margin-top:20px;">
                <button class="card" onclick="tg.showAlert('Coming soon: Internal Chat')" style="padding:10px; border:none;">💬 Chat</button>
                <button class="card" onclick="window.open('https://t.me/${owner.username || ''}')" style="padding:10px; border:none;">✈️ Telegram</button>
                <button class="card" onclick="tg.showAlert('WhatsApp click')" style="padding:10px; border:none;">📞 WhatsApp</button>
                <button class="card" onclick="tg.showAlert('Email click')" style="padding:10px; border:none;">📧 Email</button>
                <button class="card" onclick="tg.showAlert('Call click')" style="padding:10px; border:none;">📱 Call</button>
                <button class="card" onclick="tg.showAlert('Added to Favs')" style="padding:10px; border:none;">❤️ Favorite</button>
            </div>
            
            <div style="margin-top:30px; border-top:1px solid #eee; padding-top:20px;">
                <h4 style="color:#888;">Professional History</h4>
                <p style="font-size:12px;">Total Opportunities: 240</p>
                <p style="font-size:12px;">Estimated Revenue: Private</p>
            </div>
        </div>
    `;
}



function renderProfileView(profile, isEditing = false) {
    const main = document.getElementById('main-content');
    
    let content = '';

    if (isEditing) {
        // --- EDIT MODE ---
        content = `
            <div class="card" style="padding:20px; text-align:left;">
                <label style="font-size:12px; color:#888;">Full Name</label>
                <input type="text" id="edit-name" value="${profile.first_name || ''}" style="width:100%; padding:10px; margin-bottom:15px; border:1px solid #ddd; border-radius:8px;">
                
                <label style="font-size:12px; color:#888;">Bio / Skills</label>
                <textarea id="edit-bio" style="width:100%; padding:10px; margin-bottom:15px; border:1px solid #ddd; border-radius:8px;">${profile.bio || ''}</textarea>
                
                <label style="font-size:12px; color:#888;">Phone (WhatsApp)</label>
                <input type="tel" id="edit-phone" value="${profile.phone || ''}" style="width:100%; padding:10px; margin-bottom:15px; border:1px solid #ddd; border-radius:8px;">
                
                <div style="display:flex; gap:10px;">
                    <button class="auth-btn" style="flex:1" onclick="saveProfileUpdates()">Save Changes</button>
                    <button class="auth-btn" style="flex:1; background:#888;" onclick="openMyProfile()">Cancel</button>
                </div>
            </div>
        `;
    } else {
        // --- VIEW MODE ---
        content = `
            <div class="card" style="text-align:center; padding:20px;">
                <div style="font-size:50px;">👤</div>
                <h2 style="margin:10px 0;">${profile.first_name}</h2>
                <p style="color:#888;">${profile.role.toUpperCase()} • ${profile.city}</p>
                <button onclick="renderProfileView(userSession.full_profile, true)" 
        style="background:none; border:1px solid var(--primary); color:var(--primary); padding:5px 15px; border-radius:15px; font-size:12px;">
    Edit Profile
</button>

            </div>

            <div class="grid-2" style="margin-top:20px;">
                <div class="card">
                    <small>Rating</small>
                    <div style="font-weight:bold;">⭐ ${profile.rating}</div>
                </div>
                <div class="card">
                    <small>Revenue</small>
                    <div style="font-weight:bold; color:#2ecc71;">${profile.total_revenue} ETB</div>
                </div>
            </div>

            <div class="card" style="margin-top:20px; text-align:left; padding:15px;">
                <h4 style="margin-top:0;">Professional Bio</h4>
                <p style="font-size:14px; color:#555;">${profile.bio || 'No bio added yet. Click edit to tell people what you do!'}</p>
            </div>

            <button onclick="handleLogout()" style="width:100%; margin-top:30px; background:none; border:none; color:#ff4d4d; font-size:14px;">Log Out</button>
        `;
    }

    main.innerHTML = `
    <div style="padding:15px; padding-bottom:80px;">
        <div style="display:flex; align-items:center; margin-bottom:15px;">
            <button onclick="renderDashboard()" style="background:none; border:none; color:var(--primary); font-size:18px; padding:0; cursor:pointer; display:flex; align-items:center; gap:5px;">
                <span>←</span> <span style="font-size:14px; font-weight:bold;">Back to Home</span>
            </button>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
            <h2 style="margin:0;">My Profile</h2>
            <span style="background:var(--primary); color:white; padding:2px 8px; border-radius:10px; font-size:10px;">${profile.account_type || 'FREE'}</span>
        </div>
        
        ${content}
    </div>
`;

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

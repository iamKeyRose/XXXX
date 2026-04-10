/* --- ui.js --- */

// 1. Define the 10 ads (Keep this at the top)
const adsData = [
    {t:"Car Wash", d:"20% Off Today", c:"#2481cc"}, 
    {t:"New Salon", d:"Opening Sale", c:"#f4a261"},
    {t:"Repair", d:"Fast Fix", c:"#2a9d8f"}, 
    {t:"Food", d:"Free Delivery", c:"#e63946"},
    {t:"Cleaning", d:"Deep Clean", c:"#457b9d"}, 
    {t:"Electric", d:"24/7 Service", c:"#ffb703"},
    {t:"Plumbing", d:"Expert Care", c:"#219ebc"}, 
    {t:"Laundry", d:"Express Wash", c:"#6d597a"},
    {t:"Gardening", d:"Full Care", c:"#52b788"}, 
    {t:"Moving", d:"Cheap Rates", c:"#355070"}
];

// 2. Function to shuffle (This is correct)
function shuffleAds(array) {
    return array.sort(() => Math.random() - 0.5);
}

/* --- MAIN RENDER --- */

function renderDashboard() {
    const main = document.getElementById('main-content');
    if (!main) return;

    // FIX: Use the 10 shuffled ads instead of the hardcoded 'slides' variable
    const shuffledSlides = shuffleAds([...adsData]);

    const user = window.Telegram.WebApp.initDataUnsafe?.user;
    const authSection = userSession.role ? `
        <div>
            <strong>${user?.first_name || 'User'} (${userSession.role})</strong>
            <p style="margin:4px 0 0 0; font-size:12px; color:var(--text-muted)">${userSession.type} verified</p>
        </div>
        <div style="font-size: 24px;">✅</div>
    ` : `
        <div>
            <strong>Habesha Hub Membership</strong>
            <p style="margin:4px 0 0 0; font-size:12px; color:var(--text-muted)">Connect Account</p>
        </div>
        <button class="auth-btn" onclick="startRegistration()">Join</button>
    `;

    // Data for other sections
    const cats = [{i:'🛠️', l:'Repair'}, {i:'🧹', l:'Cleaning'}, {i:'🚚', l:'Delivery'}, {i:'💇', l:'Beauty'}];
    const tops = [{n: 'Abebe C.', c: 'Repair', r: '5.0'}, {n: 'Selam H.', c: 'Cleaning', r: '4.9'}];
    const pros = [{n:'Abebe', r:'4.9'}, {n:'Selam', r:'5.0'}, {n:'Marta', r:'4.8'}, {n:'Kebede', r:'4.7'}];

    main.innerHTML = `
        <div class="carousel-container" id="ad-track">
            ${shuffledSlides.map(s => `
                <div class="ad-slide" style="background:${s.c}">
                    <h2>${s.t}</h2>
                    <p>${s.d}</p>
                </div>
            `).join('')}
        </div>
        
        ${renderPaymentCard('0.00')}
        
        <div class="auth-card">${authSection}</div>

        <section>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px">
                <h3 style="margin:0">Services</h3><span style="color:var(--primary); font-size:12px; font-weight:bold">View All</span>
            </div>
            <div class="grid-4">${cats.map(c => renderCategory(c.i, c.l)).join('')}</div>
        </section>

        ${renderInlineAd("Premium Cleaning", "Book today and get 15% off.", "linear-gradient(135deg, #667eea, #764ba2)")}

        <section style="margin-bottom: 25px;">
            <h3 style="margin-bottom: 10px;">⭐ Top Rated</h3>
            <div class="top-rated-scroll">
                ${tops.map(t => renderTopProvider(t.n, t.c, t.r)).join('')}
            </div>
        </section>

        <section style="margin-bottom: 80px;">
            <h3 style="margin-bottom: 5px;">All Providers</h3>
            <div class="grid-4">${pros.map(p => renderProvider(p.n, p.r)).join('')}</div>
        </section>

        <nav style="position: fixed; bottom: 0; left: 0; width: 100%; height: 65px; background: white; display: flex; justify-content: space-around; align-items: center; border-top: 1px solid #eee; z-index: 100;">
            <div onclick="handleAction('Home')" style="text-align:center; color:var(--primary)"><div style="font-size:20px">🏠</div><div style="font-size:10px">Home</div></div>
            <div onclick="handleAction('Search')" style="text-align:center; color:#888"><div style="font-size:20px">🔍</div><div style="font-size:10px">Search</div></div>
            <div onclick="handleAction('Orders')" style="text-align:center; color:#888"><div style="font-size:20px">📦</div><div style="font-size:10px">Orders</div></div>
            <div onclick="handleAction('Profile')" style="text-align:center; color:#888"><div style="font-size:20px">👤</div><div style="font-size:10px">Profile</div></div>
        </nav>
    `;
}

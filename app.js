// Inside renderDashboard function:
const authSection = userSession.role ? `
    <div>
        <strong>${tg.initDataUnsafe?.user?.first_name || 'User'} (${userSession.role})</strong>
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

// Then in your innerHTML template, use:
<div class="auth-card">${authSection}</div>

function completeRegistration() {
    const tg = window.Telegram.WebApp;
    const user = tg.initDataUnsafe?.user;
    
    // 1. Success Message
    tg.showAlert(`Welcome to Habesha Hub! Registered as a ${userSession.type} ${userSession.role}.`);
    
    // 2. Refresh the UI to show logged-in state
    const authCard = document.querySelector('.auth-card');
    if (authCard && user) {
        authCard.innerHTML = `
            <div>
                <strong>${user.first_name} (${userSession.role})</strong>
                <p style="margin:4px 0 0 0; font-size:12px; color:var(--text-muted)">${userSession.type} account verified</p>
            </div>
            <div style="font-size: 24px;">✅</div>
        `;
    }

    // 3. Go back to main dashboard
    renderDashboard();
}

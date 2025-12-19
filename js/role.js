function selectRole(role) {
    localStorage.setItem('selected_role', role);
    // Redirect based on role
    if (role === 'farmer') {
        window.location.href = 'farmer-reg.html';
    } else if (role === 'donor') {
        window.location.href = 'donor-reg.html';
    } else if (role === 'ngo') {
        window.location.href = 'ngo-reg.html';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Register Form Handling
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('regName').value;
            const email = document.getElementById('regEmail').value;
            const phone = document.getElementById('regPhone').value;
            const password = document.getElementById('regPassword').value;

            try {
                const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, email, phone, password })
                });

                if (response.ok) {
                    const data = await response.json();

                    // Auto-login: Save token
                    localStorage.setItem('token', data.access_token);

                    alert('Registration Successful!');
                    // Redirect to Role Selection
                    window.location.href = 'role.html';
                } else {
                    const data = await response.json();
                    alert(`Error: ${data.detail}`);
                }
            } catch (err) {
                console.error(err);
                alert('Registration failed. Check console.');
            }
        });
    }

    // Login Form Handling
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            try {
                const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                if (response.ok) {
                    const data = await response.json();
                    localStorage.setItem('token', data.access_token);
                    alert('Login Successful!');

                    if (data.role === 'admin') {
                        window.location.href = 'admin.html';
                    } else if (data.has_profile) {
                        if (data.profile_type === 'farmer') window.location.href = 'farmer-dashboard.html';
                        else if (data.profile_type === 'donor') window.location.href = 'donor-dashboard.html';
                        else if (data.profile_type === 'ngo') window.location.href = 'ngo-dashboard.html';
                        else window.location.href = 'role.html'; // Fallback
                    } else {
                        // New user, no profile
                        window.location.href = 'role.html';
                    }
                } else {
                    const data = await response.json();
                    alert(`Error: ${data.detail}`);
                }
            } catch (err) {
                console.error(err);
                alert('Login failed. Check console.');
            }
        });
    }
});

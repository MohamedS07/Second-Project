document.getElementById('signup-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Convert to URLSearchParams for OAuth2PasswordRequestForm
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    try {
        const response = await fetch(`${API_BASE_URL}/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData
        });

        if (response.ok) {
            const data = await response.json();
            const token = data.access_token;

            // Decode token to get role (simple base64 decode for client-side routing)
            const payload = JSON.parse(atob(token.split('.')[1]));
            const role = payload.role;

            localStorage.setItem('token', token);
            localStorage.setItem('role', role);
            localStorage.setItem('user_id', payload.id);

            // Check if profile exists
            await checkProfileAndRedirect(role, token);

        } else {
            alert('Login failed. Please check your credentials.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred during login.');
    }
});

async function checkProfileAndRedirect(role, token) {
    try {
        let endpoint = '';
        if (role === 'farmer') endpoint = '/api/dashboard/farmer/me';
        else if (role === 'donor') endpoint = '/api/dashboard/donor/me';
        else if (role === 'ngo') endpoint = '/api/dashboard/ngo/me';
        else {
            // Admin or other
            alert('Unknown role');
            return;
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            // Profile exists, go to Dashboard
            if (role === 'farmer') window.location.href = 'farmer-dashboard.html';
            if (role === 'donor') window.location.href = 'donor-dashboard.html';
            if (role === 'ngo') window.location.href = 'ngo-dashboard.html';
        } else if (response.status === 404) {
            // Profile does not exist, go to Profile Registration
            if (role === 'farmer') window.location.href = 'farmer-reg.html';
            if (role === 'donor') window.location.href = 'donor-reg.html';
            if (role === 'ngo') window.location.href = 'ngo-reg.html';
        } else {
            console.error('Profile check failed', response);
            alert('Something went wrong checking your profile.');
        }

    } catch (error) {
        console.error('Error checking profile:', error);
    }
}

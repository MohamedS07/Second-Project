document.getElementById('signup-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    try {
        const response = await fetch(`${CONFIG.API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                username: email, // FastAPI OAuth2PasswordRequestForm expects 'username'
                password: password
            })
        });

        if (response.ok) {
            const data = await response.json();
            // Store token and role
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('role', data.role);
            localStorage.setItem('user_id', data.user_id);

            alert('Login Successful!');

            // Smart Redirect based on Role
            if (data.role === 'Farmer') {
                window.location.href = 'farmer-dashboard.html';
            } else if (data.role === 'Donor') {
                window.location.href = 'donor-dashboard.html';
            } else if (data.role === 'NGO') {
                window.location.href = 'ngo-dashboard.html';
            } else if (data.role === 'admin') {
                window.location.href = 'admin.html';
            } else {
                // If role is just 'user', they haven't selected a specific role yet
                window.location.href = 'role.html';
            }
        } else {
            const errorData = await response.json();
            alert(`Login Failed: ${errorData.detail}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
});

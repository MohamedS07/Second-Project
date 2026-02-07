document.addEventListener('DOMContentLoaded', () => {

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = registerForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = 'Registering...';
            submitBtn.disabled = true;

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


                    localStorage.setItem('token', data.access_token);

                    submitBtn.innerText = 'Success! Redirecting...';

                    window.location.href = 'role.html';
                } else {
                    const data = await response.json();
                    alert(`Error: ${data.detail}`);
                    submitBtn.innerText = originalBtnText;
                    submitBtn.disabled = false;
                }
            } catch (err) {
                console.error(err);
                alert(`Registration failed: ${err.message}. (See Console for details)`);
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }


    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = loginForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = 'Signing in...';
            submitBtn.disabled = true;

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
                    submitBtn.innerText = 'Success! Redirecting...';

                    if (data.role === 'admin') {
                        window.location.href = 'admin.html';
                    } else if (data.has_profile) {
                        if (data.profile_type === 'farmer') window.location.href = 'farmer-dashboard.html';
                        else if (data.profile_type === 'donor') window.location.href = 'donor-dashboard.html';
                        else if (data.profile_type === 'ngo') window.location.href = 'ngo-dashboard.html';
                        else window.location.href = 'role.html';
                    } else {

                        window.location.href = 'role.html';
                    }
                } else {
                    let errorMessage = "Unknown Error";
                    const responseText = await response.text();
                    try {
                        const data = JSON.parse(responseText);
                        errorMessage = data.detail || JSON.stringify(data);
                    } catch (e) {

                        errorMessage = responseText || response.statusText;
                    }
                    alert(`Error: ${errorMessage}`);
                    submitBtn.innerText = originalBtnText;
                    submitBtn.disabled = false;
                }
            } catch (err) {
                console.error(err);
                alert(`Login failed: ${err.message}`);
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
});

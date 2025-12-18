document.getElementById('registerForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('Phone').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${CONFIG.API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                email: email,
                phone: phone,
                password: password
            })
        });

        if (response.ok) {
            
            const loginResponse = await fetch(`${CONFIG.API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    username: email,
                    password: password
                })
            });

            if (loginResponse.ok) {
                const loginData = await loginResponse.json();
                localStorage.setItem('token', loginData.access_token);
                alert('Registration Successful! Redirecting to Role Selection...');
                window.location.href = 'role.html';
            } else {
                alert('Registration successful, but auto-login failed. Please login manually.');
                window.location.href = 'sign-up.html';
            }
        } else {
            const errorData = await response.json();
            alert(`Registration Failed: ${errorData.detail}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
});

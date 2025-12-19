document.getElementById('registerForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('Phone').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password,
                role: role
                // Name and Phone are not in User model yet, potentially lost or should be stored in temporary storage
                // For this implementation, we will assume User model only takes email/pass/role
                // and name/phone must be re-entered in profile or we update backend User model.
                // Given the constraints and user request complexity, we'll stick to basic Auth here.
                // Improvement: Store name/phone in localStorage to pre-fill profile form later.
            })
        });

        if (response.ok) {
            alert('Registration successful! Please login.');
            localStorage.setItem('temp_name', name);
            localStorage.setItem('temp_phone', phone);
            window.location.href = 'sign-up.html'; // Redirect to Login page (sign-up.html)
        } else {
            const data = await response.json();
            alert(`Registration failed: ${data.detail}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
});

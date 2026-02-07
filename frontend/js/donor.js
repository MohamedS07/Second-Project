document.addEventListener('DOMContentLoaded', () => {
    const donorForm = document.getElementById('donorform');

    if (donorForm) {
        donorForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const token = localStorage.getItem('token');
            if (!token) {
                alert('You must be logged in to apply.');
                window.location.href = 'sign-up.html';
                return;
            }

            const submitBtn = donorForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn ? submitBtn.innerText : 'Submit';
            if (submitBtn) {
                submitBtn.innerText = 'Registering...';
                submitBtn.disabled = true;
            }

            const formData = new FormData(donorForm);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch(`${API_BASE_URL}/api/donors/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    const result = await response.json();

                    if (result.access_token) {
                        localStorage.setItem('token', result.access_token);
                    }

                    if (submitBtn) submitBtn.innerText = 'Success! Redirecting...';

                    window.location.href = 'donor-dashboard.html';
                } else {
                    let errorMessage = "Unknown Error";
                    try {
                        const error = await response.json();
                        errorMessage = error.detail || JSON.stringify(error);
                    } catch (e) {
                        errorMessage = await response.text();
                    }
                    alert(`Error: ${errorMessage}`);
                    if (submitBtn) {
                        submitBtn.innerText = originalBtnText;
                        submitBtn.disabled = false;
                    }
                }
            } catch (err) {
                console.error(err);
                alert(`Registration failed: ${err.message}`);
                if (submitBtn) {
                    submitBtn.innerText = originalBtnText;
                    submitBtn.disabled = false;
                }
            }
        });
    }
});

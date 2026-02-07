document.addEventListener('DOMContentLoaded', () => {
    const ngoForm = document.getElementById('ngoform');

    if (ngoForm) {
        ngoForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const token = localStorage.getItem('token');
            if (!token) {
                alert('You must be logged in to apply.');
                window.location.href = 'sign-up.html';
                return;
            }

            const submitBtn = ngoForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn ? submitBtn.innerText : 'Submit';
            if (submitBtn) {
                submitBtn.innerText = 'Registering...';
                submitBtn.disabled = true;
            }

            const formData = new FormData(ngoForm);

            try {
                const response = await fetch(`${API_BASE_URL}/api/ngos/register`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });

                if (response.ok) {
                    const result = await response.json();

                    if (result.access_token) {
                        localStorage.setItem('token', result.access_token);
                    }

                    if (submitBtn) submitBtn.innerText = 'Success! Redirecting...';

                    window.location.href = 'ngo-dashboard.html';
                } else {
                    let errorMessage = "Unknown Error";
                    const responseText = await response.text();
                    try {
                        const error = JSON.parse(responseText);
                        errorMessage = error.detail || JSON.stringify(error);
                    } catch (e) {
                        errorMessage = responseText || response.statusText;
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

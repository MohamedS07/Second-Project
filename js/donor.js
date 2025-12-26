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
                    alert('Donor Registration Successful!');
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
                }
            } catch (err) {
                console.error(err);
                alert(`Registration failed: ${err.message}`);
            }
        });
    }
});

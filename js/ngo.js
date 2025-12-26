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
                    alert('NGO Registration Submitted Successfully!');
                    window.location.href = 'ngo-dashboard.html';
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

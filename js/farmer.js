document.addEventListener('DOMContentLoaded', () => {
    const farmerForm = document.getElementById('farmerForm');

    if (farmerForm) {
        farmerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const token = localStorage.getItem('token');
            if (!token) {
                alert('You must be logged in to apply.');
                window.location.href = 'sign-up.html';
                return;
            }

            const formData = new FormData(farmerForm);
            // files are already in formData since inputs have name="..."

            try {
                const response = await fetch(`${API_BASE_URL}/api/farmers/apply`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });

                if (response.ok) {
                    const result = await response.json();
                    alert('Farmer Application Submitted Successfully!');
                    window.location.href = 'farmer-dashboard.html';
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
                alert(`Application failed: ${err.message}`);
            }
        });
    }
});

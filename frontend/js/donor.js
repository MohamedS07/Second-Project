document.addEventListener('DOMContentLoaded', () => {
    // Inject Loader
    if (!document.getElementById('loader-script')) {
        const script = document.createElement('script');
        script.id = 'loader-script';
        script.src = '../js/loader.js';
        document.body.appendChild(script);

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '../style/loader.css';
        document.head.appendChild(link);
    }

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

            if (typeof showLoader === 'function') showLoader('Registering...');

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

                    if (typeof showLoader === 'function') showLoader('Success! Redirecting...');

                    setTimeout(() => {
                        window.location.href = 'donor-dashboard.html';
                    }, 1000);
                } else {
                    let errorMessage = "Unknown Error";
                    try {
                        const error = await response.json();
                        errorMessage = error.detail || JSON.stringify(error);
                    } catch (e) {
                        errorMessage = await response.text();
                    }
                    if (typeof hideLoader === 'function') hideLoader();
                    alert(`Error: ${errorMessage}`);
                }
            } catch (err) {
                console.error(err);
                if (typeof hideLoader === 'function') hideLoader();
                alert(`Registration failed: ${err.message}`);
            }
        });
    }
});

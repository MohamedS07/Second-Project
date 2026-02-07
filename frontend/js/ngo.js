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

            if (typeof showLoader === 'function') showLoader('Registering...');

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

                    if (typeof showLoader === 'function') showLoader('Success! Redirecting...');

                    setTimeout(() => {
                        window.location.href = 'ngo-dashboard.html';
                    }, 1000);
                } else {
                    let errorMessage = "Unknown Error";
                    const responseText = await response.text();
                    try {
                        const error = JSON.parse(responseText);
                        errorMessage = error.detail || JSON.stringify(error);
                    } catch (e) {
                        errorMessage = responseText || response.statusText;
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

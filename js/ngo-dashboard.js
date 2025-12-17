document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = "sign-up.html";
        return;
    }

    try {
        const response = await fetch(`${CONFIG.API_URL}/ngos/dashboard`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const data = await response.json();
            if (document.getElementById('ngoName')) {
                document.getElementById('ngoName').innerText = data.ngo_name;
            }
        } else {
            console.error('Failed to fetch dashboard data');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

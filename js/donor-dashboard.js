document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = "sign-up.html";
        return;
    }

    try {
        const response = await fetch(`${CONFIG.API_URL}/donors/dashboard`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const data = await response.json();
            if (document.getElementById('donorName')) {
                document.getElementById('donorName').innerText = data.name;
            }
        } else {
            console.error('Failed to fetch dashboard data');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

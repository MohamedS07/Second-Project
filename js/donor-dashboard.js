document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'sign-up.html';
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/dashboard/donor/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();

            // Update UI elements - assume IDs based on common pattern or create generic failure safety
            const nameElem = document.getElementById('donorName') || document.querySelector('.welcome-name');
            if (nameElem) nameElem.textContent = data.name || 'Donor';

        } else {
            console.error('Failed to fetch dashboard data');
            // localStorage.removeItem('token'); // Optional: Don't force logout on minor errors
            // window.location.href = 'sign-up.html';
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'sign-up.html';
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/dashboard/ngo/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();

            const nameElem = document.getElementById('ngoName') || document.querySelector('.welcome-name');
            if (nameElem) nameElem.textContent = data.name || 'NGO';

            const statusElem = document.getElementById('status');
            if (statusElem) statusElem.textContent = data.is_approved ? "Approved" : "Pending Approval";

        } else {
            console.error('Failed to fetch dashboard data');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

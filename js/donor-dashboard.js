document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Access Denied. Please Login.');
        window.location.href = 'sign-up.html';
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/donors/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const donor = await response.json();

            const nameEl = document.getElementById('donorName');
            if (nameEl) nameEl.textContent = donor.name;

        } else {
            console.error("Failed to fetch profile");
            alert('Could not fetch profile data. Please make sure you are registered as a Donor.');
        }
    } catch (err) {
        console.error(err);
    }
});

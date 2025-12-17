document.getElementById('farmerForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const token = localStorage.getItem('token');

    if (!token) {
        alert("Please login first!");
        window.location.href = "sign-up.html";
        return;
    }

    try {
        const response = await fetch(`${CONFIG.API_URL}/farmers/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (response.ok) {
            alert('Farmer Profile Created Successfully!');
            localStorage.setItem('role', 'Farmer');
            window.location.href = 'farmer-dashboard.html';
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.detail}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred.');
    }
});

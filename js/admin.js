document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token || role !== 'admin') {
        alert("Access Denied");
        window.location.href = '../index.html'; // Assuming page is in pages/
        return;
    }

    try {
        const response = await fetch(`${CONFIG.API_URL}/admin/pending/farmers`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const farmers = await response.json();
            const listContainer = document.querySelector('.list-container');
            listContainer.innerHTML = '<h2>Pending Farmer Validations</h2>'; // Reset and add title

            if (farmers.length === 0) {
                listContainer.innerHTML += '<p>No pending validations.</p>';
                return;
            }

            farmers.forEach(farmer => {
                const card = document.createElement('div');
                card.className = 'card';
                // Link to validation page with ID
                card.innerHTML = `
                    <a href="validation.html?id=${farmer.id}" style="text-decoration: none; color: inherit; display: block;">
                        <h3>${farmer.name}</h3>
                        <p>ID: ${farmer.id}</p>
                        <p>Village: ${farmer.village}</p>
                    </a>
                `;
                listContainer.appendChild(card);
            });

        } else {
            console.error('Failed to fetch pending farmers');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

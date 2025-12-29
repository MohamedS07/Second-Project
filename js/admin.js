document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Admin access required');
        window.location.href = 'sign-up.html';
        return;

    }


    try {
        const response = await fetch(`${API_BASE_URL}/api/admin/stats`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            const stats = await response.json();



            const ctx = document.getElementById('myPieChart').getContext('2d');
            new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['Farmers Applied', 'People Received Help'],
                    datasets: [{
                        data: [stats.farmers, stats.people_helped],
                        backgroundColor: ['#4CAF50', '#2196F3'],
                    }]
                }
            });
        }
    } catch (err) {
        console.error(err);
    }


    try {
        const response = await fetch(`${API_BASE_URL}/api/farmers/list?limit=100`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            const farmers = await response.json();
            const listContainer = document.querySelector('.list-container');
            listContainer.innerHTML = '<h2>Farmer Validations</h2>';

            farmers.forEach(farmer => {
                const card = document.createElement('div');
                card.className = 'card';
                card.style.cursor = 'pointer';


                card.onclick = () => {
                    window.location.href = `validation.html?id=${farmer.id}`;
                };

                card.innerHTML = `
                    <div style="width:100%">
                        <h3 style="color:#2E7D32;">${farmer.name}</h3>
                        <p><strong>District:</strong> ${farmer.district}</p>
                        <p><strong>Status:</strong> ${farmer.is_approved ? '<span style="color:green">Approved</span>' : '<span style="color:orange">Pending</span>'}</p>
                    </div>
                `;
                listContainer.appendChild(card);
            });
        }
    } catch (err) {
        console.error(err);
    }
});

async function deleteFarmer(id) {
    if (!confirm('Are you sure you want to delete this farmer?')) return;

    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${API_BASE_URL}/api/farmers/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            alert('Deleted successfully');
            window.location.reload();
        } else {
            alert('Failed to delete');
        }
    } catch (err) {
        console.error(err);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
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

    const token = localStorage.getItem('token');
    if (!token) {
        alert('Admin access required');
        window.location.href = 'sign-up.html';
        return;
    }
    // ... (rest of the file content remains mostly the same until deleteFarmer)

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

                const photoUrl = farmer.photo_path ? getFileUrl(farmer.photo_path) : '../assets/farmer (2).jpg';

                card.innerHTML = `
                    <div style="display:flex; align-items:center; width:100%;">
                        <img src="${photoUrl}" style="width:60px; height:60px; border-radius:50%; object-fit:cover; margin-right:15px; border: 1px solid #ccc;">
                        <div style="flex:1;">
                            <h3 style="color:#2E7D32; margin:0;">${farmer.name}</h3>
                            <p style="margin:5px 0;"><strong>District:</strong> ${farmer.district}</p>
                            <p style="margin:0;"><strong>Status:</strong> ${farmer.is_approved ? '<span style="color:green">Approved</span>' : '<span style="color:orange">Pending</span>'}</p>
                        </div>
                    </div>
                `;
                listContainer.appendChild(card);
            });
        }
    } catch (err) {
        console.error(err);
    }
});

function getFileUrl(path) {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('data:')) {
        return path;
    }
    return `${API_BASE_URL}/static/${path}`;
}

async function deleteFarmer(id) {
    if (!confirm('Are you sure you want to delete this farmer?')) return;

    const token = localStorage.getItem('token');

    if (typeof showLoader === 'function') showLoader('Deleting...');

    try {
        const response = await fetch(`${API_BASE_URL}/api/farmers/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (typeof hideLoader === 'function') hideLoader();

        if (response.ok) {
            alert('Deleted successfully');
            window.location.reload();
        } else {
            alert('Failed to delete');
        }
    } catch (err) {
        console.error(err);
        if (typeof hideLoader === 'function') hideLoader();
    }
}

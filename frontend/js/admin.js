

let allFarmers = [];          
let currentTab = 'pending';   

document.addEventListener('DOMContentLoaded', async () => {

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
        if (typeof showLoader === 'function') showLoader('Loading farmers...');
        const response = await fetch(`${API_BASE_URL}/api/farmers/list?limit=500`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (typeof hideLoader === 'function') hideLoader();

        if (response.ok) {
            allFarmers = await response.json();
            updateBadges();
            renderTab('pending');
        }
    } catch (err) {
        console.error(err);
        if (typeof hideLoader === 'function') hideLoader();
    }
});

window.switchTab = function (tab) {
    currentTab = tab;

    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`tab-${tab}`).classList.add('active');

    renderTab(tab);
};

function updateBadges() {
    const pending = allFarmers.filter(f => !f.is_approved && !f.is_declined).length;
    const approved = allFarmers.filter(f => f.is_approved).length;
    const rejected = allFarmers.filter(f => f.is_declined).length;

    document.getElementById('badge-pending').textContent = pending;
    document.getElementById('badge-approved').textContent = approved;
    document.getElementById('badge-rejected').textContent = rejected;
}


function renderTab(tab) {
    const listContainer = document.getElementById('farmerList');

    let filtered;
    let heading;
    let emptyMsg;
    let emptyIcon;

    if (tab === 'pending') {
        filtered = allFarmers.filter(f => !f.is_approved && !f.is_declined);
        heading = 'Pending Applications';
        emptyMsg = 'No pending applications at the moment.';
        emptyIcon = 'fa-clock';
    } else if (tab === 'approved') {
        filtered = allFarmers.filter(f => f.is_approved);
        heading = 'Approved Farmers';
        emptyMsg = 'No approved farmers yet.';
        emptyIcon = 'fa-check-circle';
    } else {
        filtered = allFarmers.filter(f => f.is_declined);
        heading = 'Rejected Applications';
        emptyMsg = 'No rejected applications.';
        emptyIcon = 'fa-times-circle';
    }

    listContainer.innerHTML = `<h2>${heading}</h2>`;

    if (filtered.length === 0) {
        listContainer.innerHTML += `
            <div class="list-empty">
                <i class="fas ${emptyIcon}"></i>
                ${emptyMsg}
            </div>`;
        return;
    }

    filtered.forEach(farmer => {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.cursor = 'pointer';

        card.onclick = () => {
            window.location.href = `validation.html?id=${farmer.id}`;
        };

        const photoUrl = farmer.photo_path
            ? getFileUrl(farmer.photo_path)
            : '../assets/farmer (2).jpg';

        let statusChip;
        if (farmer.is_approved) {
            statusChip = '<span class="status-chip approved">Approved</span>';
        } else if (farmer.is_declined) {
            statusChip = '<span class="status-chip rejected">Rejected</span>';
        } else {
            statusChip = '<span class="status-chip pending">Pending</span>';
        }

        card.innerHTML = `
            <div style="display:flex; align-items:center; width:100%;">
                <img src="${photoUrl}" style="width:60px; height:60px; border-radius:50%; object-fit:cover; margin-right:15px; border: 1px solid #ccc;">
                <div style="flex:1;">
                    <h3 style="color:#2E7D32; margin:0;">${farmer.name}</h3>
                    <p style="margin:5px 0;"><strong>District:</strong> ${farmer.district}</p>
                    <p style="margin:0;"><strong>Status:</strong> ${statusChip}</p>
                </div>
                <i class="fas fa-chevron-right" style="color:#ccc; font-size:18px;"></i>
            </div>
        `;
        listContainer.appendChild(card);
    });
}

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

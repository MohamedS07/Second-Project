document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const farmerId = urlParams.get('id');
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'sign-up.html';
        return;
    }

    if (!farmerId) {
        alert('No farmer specified');
        window.location.href = 'admin.html';
        return;
    }

    // Fetch Farmer Details
    try {
        const response = await fetch(`${API_BASE_URL}/api/farmers/${farmerId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const farmer = await response.json();
            renderFarmerDetails(farmer);
        } else {
            alert('Failed to fetch farmer details');
            window.location.href = 'admin.html';
        }
    } catch (err) {
        console.error(err);
    }

    // Handle Buttons
    document.querySelector('.accept').addEventListener('click', () => handleValidation(farmerId, 'approve'));
    document.querySelector('.decline').addEventListener('click', () => handleValidation(farmerId, 'delete'));
});

function renderFarmerDetails(farmer) {
    document.querySelector('.details').innerHTML = `
        <div style="width:200px; height:200px; background:#eee; display:flex; justify-content:center; align-items:center; color:#888; overflow:hidden;">
             ${farmer.photo_path ? `<img src="${API_BASE_URL}/static/${farmer.photo_path}" style="width:100%; height:100%; object-fit:cover;">` : '<i class="fas fa-file-alt" style="font-size:40px;"></i>'}
        </div>

        <div class="content">
            <h3>Farmer Name: ${farmer.name}</h3>
            <p><strong>Village:</strong> ${farmer.village}, ${farmer.district}</p>
            <p><strong>Phone:</strong> ${farmer.phone}</p>
            <p><strong>Loan Amount:</strong> ₹${farmer.loan_amount}</p>
            <p><strong>Apply Type:</strong> ${farmer.apply_type}</p>
             <p><strong>Status:</strong> ${farmer.is_approved ? '<span style="color:green">Approved</span>' : '<span style="color:orange">Pending</span>'}</p>
            <div style="margin-top:10px;">
                <p><strong>Documents:</strong></p>
                ${farmer.aadhar_photo_path ? `<a href="${API_BASE_URL}/static/${farmer.aadhar_photo_path}" target="_blank">Aadhar</a>` : ''} | 
                ${farmer.pan_photo_path ? `<a href="${API_BASE_URL}/static/${farmer.pan_photo_path}" target="_blank">PAN</a>` : ''} | 
                ${farmer.loan_detail_photo_path ? `<a href="${API_BASE_URL}/static/${farmer.loan_detail_photo_path}" target="_blank">Loan Docs</a>` : ''}
            </div>
        </div>
    `;

    // Hide accept button if already approved
    if (farmer.is_approved) {
        document.querySelector('.accept').style.display = 'none';
        document.querySelector('.valid').innerHTML += '<p style="color:green; font-weight:bold;">Already Approved</p>';
    }
}

async function handleValidation(id, action) {
    const token = localStorage.getItem('token');
    if (!confirm(`Are you sure you want to ${action} this application?`)) return;

    try {
        let url = `${API_BASE_URL}/api/farmers/${id}`;
        let method = 'DELETE'; // Default for decline

        if (action === 'approve') {
            url = `${API_BASE_URL}/api/farmers/${id}/approve`;
            method = 'PUT';
        }

        const response = await fetch(url, {
            method: method,
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            alert(`Application ${action}d successfully!`); // simple plural
            window.location.href = 'admin.html';
        } else {
            const err = await response.json();
            alert(`Failed: ${err.detail}`);
        }
    } catch (e) {
        console.error(e);
        alert('Error processing request');
    }
}

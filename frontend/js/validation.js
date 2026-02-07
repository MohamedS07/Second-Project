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


    try {
        const response = await fetch(`${API_BASE_URL}/api/farmers/${farmerId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        // Verify Admin Role
        try {
            const userResponse = await fetch(`${API_BASE_URL}/api/auth/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (userResponse.ok) {
                const user = await userResponse.json();
                if (user.role !== 'admin') {
                    alert('Access denied: Admins only');
                    window.location.href = '../index.html';
                    return;
                }
            } else {

                console.error("Failed to verify user role");

            }

        } catch (error) {
            console.error("Error verifying user role:", error);
        }


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




    const modalHtml = `
        <div id="imageModal" class="modal-overlay">
            <div class="modal-content">
                <button class="modal-close" onclick="closeModal()">&times;</button>
                <img id="modalImage" src="" alt="Document Preview">
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    document.querySelector('.accept').addEventListener('click', () => handleValidation(farmerId, 'approve'));
    document.querySelector('.decline').addEventListener('click', () => handleValidation(farmerId, 'delete'));
});

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


function getFileUrl(path) {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('data:')) {
        return path;
    }
    return `${API_BASE_URL}/static/${path}`;
}

function openModal(url) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    modalImg.src = url;
    modal.style.display = 'flex';
}

function closeModal() {
    document.getElementById('imageModal').style.display = 'none';
}


window.onclick = function (event) {
    const modal = document.getElementById('imageModal');
    if (event.target == modal) {
        closeModal();
    }
}

function renderFarmerDetails(farmer) {
    document.querySelector('.details').innerHTML = `
        <div style="width:200px; height:200px; background:#eee; display:flex; justify-content:center; align-items:center; color:#888; overflow:hidden;">
             ${farmer.photo_path ? `<img src="${getFileUrl(farmer.photo_path)}" style="width:100%; height:100%; object-fit:cover;">` : '<i class="fas fa-file-alt" style="font-size:40px;"></i>'}
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
                ${farmer.aadhar_photo_path ? `<a href="#" onclick="openModal('${getFileUrl(farmer.aadhar_photo_path)}'); return false;">Aadhar</a>` : ''} 
                ${farmer.pan_photo_path ? `| <a href="#" onclick="openModal('${getFileUrl(farmer.pan_photo_path)}'); return false;">PAN</a>` : ''} 
                ${farmer.loan_detail_photo_path ? `| <a href="#" onclick="openModal('${getFileUrl(farmer.loan_detail_photo_path)}'); return false;">Loan Docs</a>` : ''}
            </div>
        </div>
    `;


    if (farmer.is_approved) {
        document.querySelector('.accept').style.display = 'none';
        document.querySelector('.valid').innerHTML += '<p style="color:green; font-weight:bold;">Already Approved</p>';
    }
}

async function handleValidation(id, action) {
    const token = localStorage.getItem('token');
    if (!confirm(`Are you sure you want to ${action} this application?`)) return;

    if (typeof showLoader === 'function') showLoader('Processing...');

    try {
        let url = `${API_BASE_URL}/api/farmers/${id}`;
        let method = 'DELETE';

        if (action === 'approve') {
            url = `${API_BASE_URL}/api/farmers/${id}/approve`;
            method = 'PUT';
        } else if (action === 'delete') {
            url = `${API_BASE_URL}/api/farmers/${id}/decline`;
            method = 'PUT';
        }

        const response = await fetch(url, {
            method: method,
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (typeof hideLoader === 'function') hideLoader();

        if (response.ok) {
            alert(`Application ${action}d successfully!`);
            window.location.href = 'admin.html';
        } else {
            const err = await response.json();
            alert(`Failed: ${err.detail}`);
        }
    } catch (e) {
        console.error(e);
        if (typeof hideLoader === 'function') hideLoader();
        alert('Error processing request');
    }
}

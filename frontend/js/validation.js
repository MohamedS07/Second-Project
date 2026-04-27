
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


let _farmerId = null;

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    _farmerId = urlParams.get('id');
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'sign-up.html';
        return;
    }

    if (!_farmerId) {
        alert('No farmer specified');
        window.location.href = 'admin.html';
        return;
    }

    
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
            console.error('Failed to verify user role');
        }
    } catch (error) {
        console.error('Error verifying user role:', error);
    }

    
    try {
        const response = await fetch(`${API_BASE_URL}/api/farmers/${_farmerId}`, {
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

    
    const modalHtml = `
        <div id="imageModal" class="modal-overlay">
            <div class="modal-content">
                <button class="modal-close" onclick="closeModal()">&times;</button>
                <img id="modalImage" src="" alt="Document Preview">
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    
    document.querySelector('.accept').addEventListener('click', () => handleValidation(_farmerId, 'approve'));

    
    document.querySelector('.decline').addEventListener('click', () => openDeclineModal());

    
    const textarea = document.getElementById('declineReasonInput');
    if (textarea) {
        textarea.addEventListener('input', () => {
            document.getElementById('charCount').textContent = textarea.value.length;
        });
    }
});


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
    if (event.target == modal) closeModal();
};


function openDeclineModal() {
    const modal = document.getElementById('declineModal');
    modal.style.display = 'flex';
    document.getElementById('declineReasonInput').value = '';
    document.getElementById('charCount').textContent = '0';
}

function closeDeclineModal() {
    document.getElementById('declineModal').style.display = 'none';
}


window.closeDeclineModal = closeDeclineModal;

window.confirmDecline = async function () {
    const reason = document.getElementById('declineReasonInput').value.trim();
    if (!reason) {
        alert('Please enter a reason before declining.');
        return;
    }
    closeDeclineModal();
    await handleValidation(_farmerId, 'delete', reason);
};


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
            <p><strong>Status:</strong> ${farmer.is_declined
            ? '<span style="color:#c0392b; font-weight:bold;">Rejected</span>'
            : farmer.is_approved
                ? '<span style="color:green; font-weight:bold;">Approved</span>'
                : '<span style="color:orange; font-weight:bold;">Pending</span>'
        }</p>
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
        document.querySelector('.decline').style.display = 'none';
        document.querySelector('.valid').innerHTML += '<p style="color:green; font-weight:bold; margin-top:15px;">✅ Already Approved</p>';
    } else if (farmer.is_declined) {
        document.querySelector('.accept').style.display = 'none';
        document.querySelector('.decline').style.display = 'none';
        document.querySelector('.valid').innerHTML += '<p style="color:#c0392b; font-weight:bold; margin-top:15px;">❌ Already Rejected</p>';
    }
}


async function handleValidation(id, action, declineReason = '') {
    const token = localStorage.getItem('token');

    if (typeof showLoader === 'function') showLoader('Processing...');

    try {
        let url;
        let method;
        let body = null;
        let headers = { 'Authorization': `Bearer ${token}` };

        if (action === 'approve') {
            url = `${API_BASE_URL}/api/farmers/${id}/approve`;
            method = 'PUT';
        } else {
            
            url = `${API_BASE_URL}/api/farmers/${id}/decline`;
            method = 'PUT';
            const form = new FormData();
            form.append('decline_reason', declineReason);
            body = form;
        }

        const response = await fetch(url, {
            method,
            headers,
            body
        });

        if (typeof hideLoader === 'function') hideLoader();

        if (response.ok) {
            const label = action === 'approve' ? 'Approved' : 'Declined';
            alert(`Application ${label} successfully!`);
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

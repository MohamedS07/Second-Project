document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const urlParams = new URLSearchParams(window.location.search);
    const farmerId = urlParams.get('id');

    if (!token || !farmerId) {
        alert("Invalid Access");
        window.location.href = 'admin.html';
        return;
    }

    // Fetch Farmer Details
    try {
        const response = await fetch(`${CONFIG.API_URL}/farmers/${farmerId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const farmer = await response.json();
            displayFarmerDetails(farmer);
        } else {
            alert('Failed to fetch farmer details');
        }
    } catch (error) {
        console.error('Error:', error);
    }

    // Handle Approve
    document.getElementById('approveBtn').addEventListener('click', async () => {
        try {
            const response = await fetch(`${CONFIG.API_URL}/admin/approve/farmer/${farmerId}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                alert('Farmer Approved Successfully!');
                window.location.href = 'admin.html';
            } else {
                alert('Approval Failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    // Handle Reject (Mock for now as API might not exist, or strict Delete)
    document.getElementById('rejectBtn').addEventListener('click', () => {
        if (confirm("Are you sure you want to reject? (This feature might need backend implementation)")) {
            alert("Reject logic to be implemented (API required).");
            window.location.href = 'admin.html';
        }
    });
});

function displayFarmerDetails(farmer) {
    const container = document.querySelector('.validation-container'); // Ensure html has this class
    // Populate details logic... simplified for now
    // We need to target specific IDs in validation.html if they exist, or build HTML here.
    // Let's assume validation.html has elements with IDs matching fields.

    // Example:
    // document.getElementById('farmerName').innerText = farmer.name;

    // For now, let's just log it to ensure data flow, HTML structure is unknown without viewing.
    console.log("Farmer Data:", farmer);

    // Update simple fields if IDs match common naming
    setText('name', farmer.name);
    setText('village', farmer.village);
    setText('loan', farmer.loan_amount);
    setText('date', farmer.last_date);

    // Images
    setImage('photo', farmer.photo_url);
    setImage('aadhar', farmer.aadhar_photo_url);
    setImage('pan', farmer.pan_photo_url);
    // ...
}

function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.innerText = value;
}

function setImage(id, url) {
    const el = document.getElementById(id); // Usually an img tag
    if (el && url) {
        el.src = `${CONFIG.API_URL}${url}`;
        el.style.display = 'block'; // Make visible
    }
}

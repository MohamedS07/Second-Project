document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'sign-up.html';
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/farmers/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const farmer = await response.json();

            if (farmer.apply_type === 'NGO') {
                alert('Access restricted. Please contact your NGO.');
                window.location.href = '../index.html';
                return;
            }


            document.getElementById('farmerName').innerText = farmer.name;


            const statusEl = document.getElementById('appStatus');
            statusEl.innerText = farmer.is_approved ? 'Approved' : 'Pending';
            statusEl.style.color = farmer.is_approved ? 'green' : 'orange';


            const loanAmount = parseFloat(farmer.loan_amount) || 0;
            const amountRaised = farmer.amount_raised || 0;
            const pendingAmount = loanAmount - amountRaised;

            document.getElementById('amountReceived').innerText = amountRaised;
            document.getElementById('pendingAmount').innerText = pendingAmount > 0 ? pendingAmount : 0;

        } else {
            console.error('Failed to fetch profile');
        }
    } catch (err) {
        console.error(err);
    }
});

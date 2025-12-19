document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'sign-up.html';
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/dashboard/farmer/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();

            // Update UI
            document.getElementById('farmerName').textContent = data.name || 'Farmer';
            const statusElem = document.getElementById('appStatus');
            if (statusElem) statusElem.textContent = data.verification_status || 'Pending';

            // Dummy amounts for now as backend doesn't track real transactions yet
            const amtRec = document.getElementById('amountReceived');
            if (amtRec) amtRec.textContent = "0";

            const pendAmt = document.getElementById('pendingAmount');
            if (pendAmt) pendAmt.textContent = data.loan_amount || "0";

        } else {
            console.error('Failed to fetch dashboard data');
            localStorage.removeItem('token');
            window.location.href = 'sign-up.html';
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

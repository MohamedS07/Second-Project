document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = "sign-up.html";
        return;
    }

    try {
        const response = await fetch(`${CONFIG.API_URL}/farmers/dashboard`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const data = await response.json();
            document.getElementById('farmerName').innerText = data.name;
            document.getElementById('appStatus').innerText = data.verification_status;

            
            const totalLoan = parseFloat(data.loan_amount) || 0;
            
            const received = 0;

            document.getElementById('amountReceived').innerText = received;
            document.getElementById('pendingAmount').innerText = totalLoan - received;

        } else {
            console.error('Failed to fetch dashboard data');
            alert('Failed to load dashboard.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

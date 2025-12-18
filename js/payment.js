document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const farmerId = urlParams.get('farmer_id');

    if (farmerId) {
        try {
            const response = await fetch(`${CONFIG.API_URL}/farmers/${farmerId}`);
            if (response.ok) {
                const farmer = await response.json();
                document.getElementById('farmerName').value = farmer.name;
                document.getElementById('farmerAccount').value = farmer.bank_account_no;
            }
        } catch (error) {
            console.error(error);
        }
    }
});

document.getElementById('payBtn').addEventListener('click', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert("Please login first!");
        window.location.href = "sign-up.html";
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const farmerId = urlParams.get('farmer_id');
    const amount = document.getElementById('amount').value;
    const method = document.getElementById('method').value;

    if (!amount) { alert("Please enter amount"); return; }

    try {
        const response = await fetch(`${CONFIG.API_URL}/payments/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                farmer_id: parseInt(farmerId),
                amount: parseFloat(amount),
                payment_method: method
            })
        });

        if (response.ok) {
            alert('Payment Successful!');
            window.location.href = 'donor-dashboard.html';
        } else {
            const error = await response.json();
            alert(`Payment Failed: ${error.detail}`);
        }
    } catch (error) {
        console.error(error);
        alert('Error processing payment.');
    }
});

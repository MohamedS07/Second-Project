document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const farmerId = urlParams.get('farmerId');
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'sign-up.html';
        return;
    }

    if (!farmerId) {
        alert('No farmer specified');
        window.location.href = 'donor-dashboard.html';
        return;
    }

    // 1. Fetch Farmer Details
    try {
        const response = await fetch(`${API_BASE_URL}/api/farmers/${farmerId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const farmer = await response.json();
            document.getElementById('farmerName').innerText = farmer.name;
            document.getElementById('farmerDistrict').innerText = farmer.district;
            document.getElementById('farmerAcc').innerText = farmer.bank_account_no;
        } else {
            alert('Failed to load farmer details');
            window.location.href = 'donor-dashboard.html';
        }
    } catch (err) {
        console.error(err);
    }

    // 2. Handle Payment Method Toggles
    const methodRadios = document.querySelectorAll('input[name="paymentMethod"]');
    const sections = {
        'UPI': document.getElementById('upi-fields'),
        'Card': document.getElementById('card-fields'),
        'NetBanking': document.getElementById('netbanking-fields')
    };

    methodRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            // Hide all
            Object.values(sections).forEach(el => el.style.display = 'none');
            // Show selected
            sections[e.target.value].style.display = 'block';
        });
    });

    // 3. Handle Payment Submission
    document.getElementById('payBtn').addEventListener('click', async () => {
        const amount = document.getElementById('amountInput').value;
        const method = document.querySelector('input[name="paymentMethod"]:checked').value;

        if (!amount || amount < 100) {
            alert('Please enter a valid amount (Min ₹100)');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/payments/process`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    farmer_id: farmerId,
                    amount: parseInt(amount),
                    payment_method: method
                })
            });

            if (response.ok) {
                alert('Payment Successful! Thank you for your support.');
                window.location.href = 'donor-dashboard.html';
            } else {
                const err = await response.json();
                alert(`Payment Failed: ${err.detail || 'Unknown error'}`);
            }
        } catch (e) {
            console.error(e);
            alert('Error processing payment');
        }
    });
});

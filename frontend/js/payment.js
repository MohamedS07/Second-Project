document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const farmerId = urlParams.get('farmerId');
    const token = localStorage.getItem('token');

    // Custom Dialog Logic
    const dialog = document.getElementById('customDialog');
    const msgElem = document.getElementById('dialogMessage');
    const okBtn = document.getElementById('dialogOkBtn');
    const closeBtn = document.querySelector('.close-btn');

    function showDialog(message, onOk = null) {
        msgElem.innerText = message;
        dialog.style.display = 'block';

        // Clean up previous event listeners to avoid duplication
        const newOkBtn = okBtn.cloneNode(true);
        okBtn.parentNode.replaceChild(newOkBtn, okBtn);

        const newCloseBtn = closeBtn.cloneNode(true);
        closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);

        // Re-select buttons after replacement
        const currentOkBtn = document.getElementById('dialogOkBtn');
        const currentCloseBtn = document.querySelector('.close-btn');

        const closeDialog = () => {
            dialog.style.display = 'none';
            if (onOk) onOk();
        };

        const justClose = () => {
            dialog.style.display = 'none';
        };

        currentOkBtn.addEventListener('click', closeDialog);
        currentCloseBtn.addEventListener('click', justClose);

        window.onclick = (event) => {
            if (event.target == dialog) {
                dialog.style.display = 'none';
            }
        };
    }

    if (!token) {
        window.location.href = 'sign-up.html';
        return;
    }

    if (!farmerId) {
        showDialog('No farmer specified', () => {
            window.location.href = 'donor-dashboard.html';
        });
        return;
    }


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
            showDialog('Failed to load farmer details', () => {
                window.location.href = 'donor-dashboard.html';
            });
        }
    } catch (err) {
        console.error(err);
    }


    const methodRadios = document.querySelectorAll('input[name="paymentMethod"]');
    const sections = {
        'UPI': document.getElementById('upi-fields'),
        'Card': document.getElementById('card-fields'),
        'NetBanking': document.getElementById('netbanking-fields')
    };

    methodRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            // hide all
            Object.values(sections).forEach(el => el.style.display = 'none');
            // show selected
            sections[e.target.value].style.display = 'block';
        });
    });


    document.getElementById('payBtn').addEventListener('click', async () => {
        const amount = document.getElementById('amountInput').value;
        const method = document.querySelector('input[name="paymentMethod"]:checked').value;

        if (!amount || amount < 50) {
            showDialog('Please enter a valid amount (Min ₹50)');
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
                showDialog('Payment Successful! Thank you for your support.', () => {
                    window.location.href = 'donor-dashboard.html';
                });
            } else {
                const err = await response.json();
                showDialog(`Payment Failed: ${err.detail || 'Unknown error'}`);
            }
        } catch (e) {
            console.error(e);
            showDialog('Error processing payment');
        }
    });
});

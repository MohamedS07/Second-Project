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

            // ── Application status chip ──
            const statusEl = document.getElementById('appStatus');
            if (farmer.is_declined) {
                statusEl.innerText = 'Declined';
                statusEl.style.color = 'red';

                // Show the decline reason box if a reason exists
                const reasonBox = document.getElementById('declineReasonBox');
                const reasonMsg = document.getElementById('declineReasonMsg');
                if (reasonBox && reasonMsg) {
                    reasonBox.style.display = 'block';
                    if (farmer.decline_reason && farmer.decline_reason.trim()) {
                        reasonMsg.innerText = farmer.decline_reason;
                    } else {
                        reasonMsg.innerText = 'No specific reason was provided by the administrator.';
                        reasonMsg.style.fontStyle = 'italic';
                        reasonMsg.style.color = '#888';
                    }
                }

            } else if (farmer.is_approved) {
                statusEl.innerText = 'Approved';
                statusEl.style.color = 'green';
            } else {
                statusEl.innerText = 'Pending';
                statusEl.style.color = 'orange';
            }

            // ── Amounts ──
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

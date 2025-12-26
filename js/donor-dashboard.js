document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Access Denied. Please Login.');
        window.location.href = 'sign-up.html';
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/donors/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const donor = await response.json();

            // Populate Dashboard
            const nameEl = document.getElementById('donorName');
            if (nameEl) nameEl.textContent = donor.name;

            // Fetch Farmers List (Sorted by Urgency, Approved Only)
            const farmersResponse = await fetch(`${API_BASE_URL}/api/farmers/list?approved_only=true`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (farmersResponse.ok) {
                const farmers = await farmersResponse.json();
                const container = document.querySelector('.farmers-container') || document.querySelector('main .container');

                // If specific container doesn't exist, append to main container
                if (!document.querySelector('.farmers-list')) {
                    const listDiv = document.createElement('div');
                    listDiv.className = 'farmers-list';
                    listDiv.innerHTML = '<h2>Farmers Needing Support</h2>';
                    container.appendChild(listDiv);
                }
                const listDiv = document.querySelector('.farmers-list');

                farmers.forEach(farmer => {
                    // Calculate pending amount
                    const loan = parseFloat(farmer.loan_amount) || 0;
                    const raised = farmer.amount_raised || 0;
                    const pending = loan - raised;

                    if (pending <= 0) return; // Skip fully funded farmers if desired, or show as completed

                    const card = document.createElement('div');
                    card.className = 'card';
                    card.style.border = '1px solid #ddd';
                    card.style.padding = '15px';
                    card.style.marginBottom = '10px';
                    card.style.borderRadius = '8px';
                    card.style.background = '#fff';

                    card.innerHTML = `
                        <h3>${farmer.name} (${farmer.district})</h3>
                        <p><strong>Reason:</strong> ${farmer.apply_type}</p>
                        <p><strong>Goal:</strong> ₹${loan} | <strong>Raised:</strong> ₹${raised}</p>
                        <p><strong>Pending:</strong> <span style="color:red">₹${pending}</span></p>
                        <p style="font-size:0.9em; color:gray;">Deadline: ${farmer.last_date}</p>
                        <button onclick="window.location.href='payment.html?farmerId=${farmer.id}'" 
                            style="background:#2e7d32; color:white; border:none; padding:8px 15px; border-radius:5px; cursor:pointer; margin-top:10px;">
                            Donate Now
                        </button>
                    `;
                    listDiv.appendChild(card);
                });
            }

        } else {
            console.error("Failed to fetch profile");
            alert('Could not fetch profile data. Please make sure you are registered as a Donor.');
        }
    } catch (err) {
        console.error(err);
    }
});

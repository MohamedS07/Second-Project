
document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please Login to view farmers.');
        window.location.href = 'sign-up.html';
        return;
    }

    try {
        const farmersResponse = await fetch(`${API_BASE_URL}/api/farmers/list?approved_only=true`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (farmersResponse.ok) {
            const farmers = await farmersResponse.json();
            const container = document.querySelector('.farmer-list');

            if (!container) {
                console.error('Farmer list container not found!');
                return;
            }

            // Clear existing hardcoded content
            container.innerHTML = '<h2>Farmers Needing Support</h2>';

            if (farmers.length === 0) {
                container.innerHTML += '<p>No farmers currently approved and seeking funds.</p>';
                return;
            }

            farmers.forEach(farmer => {
                const loan = parseFloat(farmer.loan_amount) || 0;
                const raised = farmer.amount_raised || 0;
                const pending = loan - raised;

                // Don't show fully funded requests
                if (pending <= 0) return;

                const card = document.createElement('div');
                card.className = 'farmer-card'; // Reusing existing class from farmer-list.html

                // Add some basic styling if css class isn't sufficient or to match previous dynamic style
                // Ideally this should be in CSS, but keeping consistent with previous JS logic for now
                // We will try to rely on style-farmer-list.css classes primarily

                card.innerHTML = `
                  <div class="farmer-img" style="display:flex;justify-content:center;align-items:center;color:#888;">
                    <i class="fas fa-user" style="font-size: 40px;"></i>
                  </div>
            
                  <div class="farmer-info">
                    <h3>${farmer.name}</h3>
                    <p>Village: ${farmer.village}, ${farmer.district}</p>
                     <p><strong>Goal:</strong> ₹${loan} | <strong>Raised:</strong> ₹${raised}</p>
                     <p><strong>Pending:</strong> <span style="color:red">₹${pending}</span></p>
                  </div>
                  <button class="donate-btn" onclick="window.location.href='payment.html?farmerId=${farmer.id}'">Donate</button>
                `;

                container.appendChild(card);
            });

        } else {
            console.error("Failed to fetch farmers");
        }

    } catch (err) {
        console.error(err);
    }
});

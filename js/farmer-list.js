document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('farmerListContainer');

    try {
        const response = await fetch(`${CONFIG.API_URL}/farmers/`); 

        if (response.ok) {
            const farmers = await response.json();

            if (farmers.length === 0) {
                container.innerHTML = '<p style="text-align:center; margin-top: 20px;">No farmers found.</p>';
                return;
            }

            farmers.forEach(farmer => {
                const card = document.createElement('div');
                card.className = 'farmer-card';
                card.innerHTML = `
                    <div>
                        <img class="farmer-img" src="${farmer.photo_url ? CONFIG.API_URL + farmer.photo_url : '../assests/profile.png'}" alt="farmer-img" onerror="this.src='../assests/profile.png'">
                    </div>
                    <div class="farmer-info">
                        <h3>${farmer.name}</h3>
                        <p>${farmer.village}</p>
                        <p>${farmer.district}</p>
                    </div>
                    <button class="donate-btn" onclick="goToPayment(${farmer.id})">Donate</button>
                `;
                container.appendChild(card);
            });
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

function goToPayment(farmerId) {
    window.location.href = `payment.html?farmer_id=${farmerId}`;
}

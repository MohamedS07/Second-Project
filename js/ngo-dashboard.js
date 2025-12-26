document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Access Denied. Please Login.');
        window.location.href = 'sign-up.html';
        return;
    }

    // Fetch Profile
    try {
        const response = await fetch(`${API_BASE_URL}/api/ngos/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const ngo = await response.json();

            // Populate Dashboard
            const nameEl = document.getElementById('ngoName');
            if (nameEl) nameEl.textContent = ngo.name;

        } else {
            console.error("Failed to fetch profile");
            alert('Could not fetch profile data. Please make sure you are registered as an NGO.');
        }
    } catch (err) {
        console.error(err);
    }

    // Fetch Farmers for this NGO
    try {
        const response = await fetch(`${API_BASE_URL}/api/ngos/farmers`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const farmers = await response.json();
            const container = document.querySelector('.container');

            // Create list view
            const listDiv = document.createElement('div');
            listDiv.className = 'ngo-farmers-list';
            listDiv.style.marginTop = '20px';
            listDiv.innerHTML = `<h3>Farmers Registered Under You:</h3>`;

            if (farmers.length === 0) {
                listDiv.innerHTML += `<p>No farmers found.</p>`;
            } else {
                const ul = document.createElement('ul');
                ul.style.listStyle = 'none';
                ul.style.padding = '0';

                farmers.forEach(farmer => {
                    const li = document.createElement('li');
                    li.style.background = '#f9f9f9';
                    li.style.margin = '10px 0';
                    li.style.padding = '10px';
                    li.style.border = '1px solid #ddd';
                    li.style.borderRadius = '5px';
                    li.innerHTML = `
                        <strong>${farmer.name}</strong> (${farmer.district})<br>
                        Loan Amount: ${farmer.loan_amount}<br>
                        Status: <span style="color:${farmer.is_approved ? 'green' : 'orange'}">${farmer.is_approved ? 'Approved' : 'Pending'}</span>
                    `;
                    ul.appendChild(li);
                });
                listDiv.appendChild(ul);
            }
            container.appendChild(listDiv);
        }
    } catch (err) {
        console.error(err);
    }

    // Add Button Confirmation
    const addButton = document.querySelector('#addFarmerBtn');
    if (addButton) {
        addButton.addEventListener('click', () => {
            if (confirm("Are you sure you want to add a new Farmer application?")) {
                window.location.href = 'farmer-reg.html';
            }
        });
    }
});

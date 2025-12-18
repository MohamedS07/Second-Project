document.getElementById('donorform').addEventListener('submit', async function (e) {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
        alert("Please login first!");
        window.location.href = "sign-up.html";
        return;
    }

    
    const inputs = this.querySelectorAll('input');
    const select = this.querySelector('select');

    

    const donorData = {
        name: inputs[0].value,
        email: inputs[1].value, 
        phone_number: inputs[2].value,
        state: select.value,
        apply_type: this.querySelector('input[name="apply_type"]:checked')?.value || "Individual",
        organization_name: inputs[5]?.value
    };

    try {
        const response = await fetch(`${CONFIG.API_URL}/donors/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(donorData)
        });

        if (response.ok) {
            alert('Donor Profile Created Successfully!');
            localStorage.setItem('role', 'Donor');
            window.location.href = 'donor-dashboard.html';
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.detail}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred.');
    }
});

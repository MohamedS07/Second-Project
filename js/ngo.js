document.getElementById('ngoform').addEventListener('submit', async function (e) {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
        alert("Please login first!");
        window.location.href = "sign-up.html";
        return;
    }

    const formData = new FormData();
    const inputs = this.querySelectorAll('input');
    const select = this.querySelector('select');

    // Mapped based on HTML structure
    formData.append('ngo_name', inputs[0].value);
    formData.append('reg_number', inputs[1].value);
    formData.append('district', select.value);
    formData.append('contact_person', inputs[2].value);
    formData.append('contact_number', inputs[3].value);
    // Email is inputs[4] - not in API currently but good to have if added later
    formData.append('proof_document', inputs[5].files[0]);

    try {
        const response = await fetch(`${CONFIG.API_URL}/ngos/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (response.ok) {
            alert('NGO Profile Created Successfully!');
            localStorage.setItem('role', 'NGO');
            window.location.href = 'ngo-dashboard.html';
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.detail}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred.');
    }
});

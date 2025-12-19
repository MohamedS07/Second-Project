document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'sign-up.html';
        return;
    }

    const form = document.getElementById('ngoform');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const data = {};
            // Detailed selector strategy due to missing name attributes in HTML likely

            // Label NGO Name -> input
            const nameInput = form.querySelector('input[placeholder="Enter NGO Name"]');
            data.name = nameInput ? nameInput.value : "";

            // Label Registration Number -> input
            const regInput = form.querySelector('input[placeholder="Enter NGO Registration Number"]');
            data.reg_number = regInput ? regInput.value : "";

            // District -> select
            const districtSelect = form.querySelector('select.district');
            data.district = districtSelect ? districtSelect.value : "";

            // Contact Person -> input
            const contactPersonInput = form.querySelector('input[placeholder="NGO Contact Person"]');
            data.contact_person = contactPersonInput ? contactPersonInput.value : "";

            // Contact Number -> input
            const contactNumInput = form.querySelector('input[placeholder="Enter Contact Number"]');
            data.contact_number = contactNumInput ? contactNumInput.value : "";

            try {
                const response = await fetch(`${API_BASE_URL}/api/register/ngo`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    alert('Details submitted successfully!');
                    window.location.href = 'ngo-dashboard.html';
                } else {
                    const err = await response.json();
                    alert(`Error: ${err.detail}`);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Submission failed.');
            }
        });
    }
});

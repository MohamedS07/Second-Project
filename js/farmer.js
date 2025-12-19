document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'sign-up.html';
        return;
    }

    const form = document.getElementById('farmerForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = {};

        // Manual mapping or loop, ignoring files
        // Backend expects: name, village, district, address, phone, loan_amount, last_date, bank_account_no, bank_ifsc, apply_type, ngo_name_ref

        data.name = formData.get('name');
        data.village = formData.get('village');
        data.district = formData.get('district');
        data.address = formData.get('address');
        data.phone = formData.get('phone');
        data.loan_amount = formData.get('loan_amount');
        data.last_date = formData.get('last_date');
        data.bank_account_no = formData.get('bank_account_no');
        data.bank_ifsc = formData.get('bank_ifsc');
        data.apply_type = formData.get('apply_type');
        data.ngo_name_ref = formData.get('ngo_name_ref') || null;

        try {
            const response = await fetch(`${API_BASE_URL}/api/register/farmer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                alert('Details submitted successfully!');
                window.location.href = 'farmer-dashboard.html';
            } else {
                const err = await response.json();
                alert(`Error: ${err.detail}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Submission failed.');
        }
    });
});

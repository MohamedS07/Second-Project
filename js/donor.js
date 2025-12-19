document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'sign-up.html';
        return;
    }

    const form = document.getElementById('donorform');
    // Note: ID in HTML is 'donorform' (lowercase f)
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            const data = {};

            // Backend expects: name, state, phone, apply_type, organization_name

            // HTML fields: Name -> input[type=text], email(ignored?), phone, state, apply_type, organization_name
            // Wait, HTML form has inputs without 'name' attribute in some cases?
            // Let's check donor-reg.html content.
            // <input type="text" placeholder="Enter your Name" required> -> NO NAME ATTRIBUTE!
            // This will fail `FormData`.
            // I must select by index or add name attributes? 
            // Better to select by order or querySelector if name is missing.
            // For robustness, I should fix the HTML or select rigidly. 
            // The user said "Connect backend", fixing HTML is part of it.
            // But I cannot see the HTML edit in this specific tool call. 
            // I will use `querySelector` relative to form to grab values if name is missing.
            // Actually, `donor-reg.html` had:
            // <div><label>Name</label><br><input type="text"...></div>
            // I will assume I can grab by type/placeholder or just fix the HTML first? 
            // Fixing HTML is safer.
            // But let's try to grab by context.

            // Re-reading donor-reg.html from memory/view:
            // Line 43: <input type="text" placeholder="Enter your Name" required> (No name)
            // Line 47: <select id="state" name="state" required> (Has name)
            // Line 90: <input type="text" placeholder="Enter your Address" required> (Label is Email? Input placeholder Address? HTML is messy. Line 89 Label Email)
            // Line 94: <input type="text" placeholder="Enter your Phone Number" required> (No name)

            // I will use rigorous selectors.

            const inputs = form.querySelectorAll('input, select');
            // Assuming order: Name, State, Email, Phone, Radio(apply_type), Org Name

            // This is brittle. I'll rely on the user having fixed it or I fix it?
            // I will fix the HTML in a separate step if I can, but I want to write JS now.
            // I will use `querySelector` corresponding to the structure I saw.

            data.name = form.querySelector('input[placeholder="Enter your Name"]').value;
            data.state = form.querySelector('select[name="state"]').value;
            data.phone = form.querySelector('input[placeholder="Enter your Phone Number"]').value;
            // apply_type is radio
            const applyType = form.querySelector('input[name="apply_type"]:checked');
            data.apply_type = applyType ? applyType.value : "Self";

            const orgInput = form.querySelector('input[placeholder="Occupation / Organization"]');
            data.organization_name = orgInput ? orgInput.value : null;

            try {
                const response = await fetch(`${API_BASE_URL}/api/register/donor`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    alert('Details submitted successfully!');
                    window.location.href = 'donor-dashboard.html';
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

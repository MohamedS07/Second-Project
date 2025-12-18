document.addEventListener('DOMContentLoaded', () => {
    const farmerBtn = document.getElementById('farmerBtn');
    const donorBtn = document.getElementById('donorBtn');
    const ngoBtn = document.getElementById('ngoBtn');

    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'sign-up.html'; 
    }

    if (farmerBtn) {
        farmerBtn.addEventListener('click', () => {
            window.location.href = 'farmer-reg.html';
        });
    }

    if (donorBtn) {
        donorBtn.addEventListener('click', () => {
            window.location.href = 'donor-reg.html';
        });
    }

    if (ngoBtn) {
        ngoBtn.addEventListener('click', () => {
            window.location.href = 'ngo-reg.html';
        });
    }
});

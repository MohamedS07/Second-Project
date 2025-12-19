document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logoutBtn') || document.querySelector('.logout'); // Adjust selector as needed
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            localStorage.removeItem('user_id');
            window.location.href = '../pages/sign-up.html'; // Redirect to login (sign-up.html)
        });
    }
});

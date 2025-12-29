document.addEventListener('DOMContentLoaded', () => {
    

    const logoutLinks = document.querySelectorAll('a[href="#"], .logout-btn');

    logoutLinks.forEach(link => {
        if (link.textContent.trim().toLowerCase().includes('log out') || link.textContent.trim().toLowerCase().includes('logout')) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('token');
                alert('Logged out successfully.');
                window.location.href = 'sign-up.html'; 
            });
        }
    });
});

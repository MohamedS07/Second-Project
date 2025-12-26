document.addEventListener('DOMContentLoaded', () => {
    // Find logout links/buttons
    // The selector might need adjustment based on all pages, but usually it's "Logout" text or a specific ID if added.
    // Based on checked HTML files, sometimes it's <a href="#">Log Out</a>

    const logoutLinks = document.querySelectorAll('a[href="#"], .logout-btn');

    logoutLinks.forEach(link => {
        if (link.textContent.trim().toLowerCase().includes('log out') || link.textContent.trim().toLowerCase().includes('logout')) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('token');
                alert('Logged out successfully.');
                window.location.href = 'sign-up.html'; // Redirect to login
            });
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // Find logout links
    const logoutLinks = document.querySelectorAll('a[href="#"], a[href="./index.html"]');

    logoutLinks.forEach(link => {
        if (link.innerText.toLowerCase() === 'logout') {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                localStorage.removeItem('user_id');
                window.location.href = '../index.html'; // Go to home.Adjust path if needed (e.g. if in root)
            });
        }
    });

    // Handle "Home" link if user is logged in? 
    // Maybe checking token on every page load to redirect non-logged in users? 
    // Already doing that in dashboard JS files.
});

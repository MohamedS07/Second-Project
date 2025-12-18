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
                window.location.href = '../index.html'; 
            });
        }
    });

    
});

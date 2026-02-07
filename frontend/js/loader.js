

function createLoader() {
    if (document.getElementById('loader-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'loader-overlay';

    const box = document.createElement('div');
    box.id = 'loader-box';

    const spinner = document.createElement('div');
    spinner.className = 'spinner';

    const message = document.createElement('p');
    message.id = 'loader-message';
    message.textContent = 'Processing...';

    box.appendChild(spinner);
    box.appendChild(message);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
}

function showLoader(msg = 'Processing...') {
    createLoader();
    const messageEl = document.getElementById('loader-message');
    if (messageEl) messageEl.textContent = msg;

    const overlay = document.getElementById('loader-overlay');
    if (overlay) overlay.style.display = 'flex';
}

function hideLoader() {
    const overlay = document.getElementById('loader-overlay');
    if (overlay) overlay.style.display = 'none';
}


document.addEventListener('DOMContentLoaded', () => {

});

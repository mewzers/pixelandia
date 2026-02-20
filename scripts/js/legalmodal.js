// --- Modale Politique de confidentialité ---
const modal = document.getElementById('privacy-modal');
const privacyLink = document.getElementById('privacy-link');
const privacyClose = document.getElementById('privacy-close');
if (modal && privacyLink && privacyClose) {
    privacyLink.addEventListener('click', (e) => {
        e.preventDefault();
        document.body.classList.add('modal-open');
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('visible');
        }, 10);
    });
    privacyClose.addEventListener('click', () => {
        modal.classList.remove('visible');
        document.body.classList.remove('modal-open');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 400);
    });
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('visible');
            document.body.classList.remove('modal-open');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 400);
        }
    });
}

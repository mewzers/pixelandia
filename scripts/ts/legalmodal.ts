// --- Modale Politique de confidentialité ---
const modal = document.getElementById('privacy-modal') as HTMLElement | null;
const privacyLink = document.getElementById('privacy-link') as HTMLElement | null;
const privacyClose = document.getElementById('privacy-close') as HTMLElement | null;

if (modal && privacyLink && privacyClose) {

  privacyLink.addEventListener('click', (e: Event): void => {
    e.preventDefault();
    document.body.classList.add('modal-open');
    modal.style.display = 'flex';
    setTimeout((): void => {
      modal.classList.add('visible');
    }, 10);
  });

  privacyClose.addEventListener('click', (): void => {
    modal.classList.remove('visible');
    document.body.classList.remove('modal-open');
    setTimeout((): void => {
      modal.style.display = 'none';
    }, 400);
  });

  modal.addEventListener('click', (e: Event): void => {
    if (e.target === modal) {
      modal.classList.remove('visible');
      document.body.classList.remove('modal-open');
      setTimeout((): void => {
        modal.style.display = 'none';
      }, 400);
    }
  });

}

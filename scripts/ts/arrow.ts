const scrollArrow = document.querySelector('.scroll-arrow') as HTMLElement | null;
const heroTitle = document.querySelector('.hero-title') as HTMLElement | null;

const TITLE_HIDE_DELAY_AFTER_CLICK_MS = 80;

if (scrollArrow) {
  let drilling = false;

  scrollArrow.addEventListener('click', (): void => {
    if (drilling) return;
    drilling = true;

    const computedTransform = window.getComputedStyle(scrollArrow).transform;
    let translateY = 0;
    if (computedTransform && computedTransform !== 'none') {
      const matrixMatch = computedTransform.match(/matrix\(([^)]+)\)/);
      if (matrixMatch) {
        const values = matrixMatch[1].split(',').map((value) => Number(value.trim()));
        if (values.length >= 6 && Number.isFinite(values[5])) {
          translateY = values[5];
        }
      }
    }
    scrollArrow.style.setProperty('--arrow-start-y', `${translateY}px`);

    scrollArrow.classList.add('is-drilling');
    if (heroTitle) {
      window.setTimeout((): void => {
        heroTitle.classList.add('is-drilling-hide');
      }, TITLE_HIDE_DELAY_AFTER_CLICK_MS);
    }
    window.setTimeout((): void => {
      window.scrollBy({
        top: Math.round(window.innerHeight * 0.55),
        behavior: 'smooth'
      });
    }, 40);
  });
}







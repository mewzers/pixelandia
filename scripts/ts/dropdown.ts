  // --- Dropdown ---
  document.querySelectorAll<HTMLElement>('.dropdown-toggle').forEach((toggle: HTMLElement): void => {
    toggle.addEventListener('click', (e: Event): void => {
      e.stopPropagation();
      toggle.parentElement?.classList.toggle('open');
    });
  });

  document.addEventListener('click', (e: Event): void => {
    document.querySelectorAll<HTMLElement>('.dropdown.open').forEach((open: HTMLElement): void => {
      if (!open.contains(e.target as Node)) open.classList.remove('open');
    });
  });
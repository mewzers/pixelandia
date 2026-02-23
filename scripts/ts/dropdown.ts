  // --- Dropdown ---
  const alignDropdownMenuToNavbar = (dropdown: HTMLElement): void => {
    const menu = dropdown.querySelector<HTMLElement>('.dropdown-menu');
    const navbar = dropdown.closest<HTMLElement>('.navbar');
    if (!menu || !navbar) return;
    const dropdownRect = dropdown.getBoundingClientRect();
    const navbarRect = navbar.getBoundingClientRect();
    const offsetToNavbarRight = navbarRect.right - dropdownRect.right;
    menu.style.right = `${-offsetToNavbarRight}px`;
  };

  const alignDropdownThemeHint = (dropdown: HTMLElement): void => {
    const menu = dropdown.querySelector<HTMLElement>('.dropdown-menu');
    const themeButton = dropdown.querySelector<HTMLElement>('.dropdown-theme-toggle');
    const hint = dropdown.querySelector<HTMLElement>('.dropdown-theme-hint');
    if (!menu || !themeButton || !hint) return;
    const menuRect = menu.getBoundingClientRect();
    const themeButtonRect = themeButton.getBoundingClientRect();
    const themeButtonCenterY = themeButtonRect.top - menuRect.top + (themeButtonRect.height / 2);
    hint.style.top = `${themeButtonCenterY}px`;
  };

  const dropdowns = document.querySelectorAll<HTMLElement>('.dropdown');
  dropdowns.forEach((dropdown: HTMLElement): void => {
    alignDropdownMenuToNavbar(dropdown);
    alignDropdownThemeHint(dropdown);
    const toggle = dropdown.querySelector<HTMLElement>('.dropdown-toggle');
    if (!toggle) return;
    toggle.addEventListener('click', (e: Event): void => {
      e.stopPropagation();
      alignDropdownMenuToNavbar(dropdown);
      alignDropdownThemeHint(dropdown);
      dropdown.classList.toggle('open');
    });
  });

  document.addEventListener('click', (e: Event): void => {
    document.querySelectorAll<HTMLElement>('.dropdown.open').forEach((open: HTMLElement): void => {
      if (!open.contains(e.target as Node)) open.classList.remove('open');
    });
  });

  window.addEventListener('resize', (): void => {
    dropdowns.forEach((dropdown: HTMLElement): void => {
      alignDropdownMenuToNavbar(dropdown);
      alignDropdownThemeHint(dropdown);
    });
  });

// --- Dropdown ---
const alignDropdownMenuToNavbar = (dropdown) => {
    const menu = dropdown.querySelector('.dropdown-menu');
    const navbar = dropdown.closest('.navbar');
    if (!menu || !navbar)
        return;
    const dropdownRect = dropdown.getBoundingClientRect();
    const navbarRect = navbar.getBoundingClientRect();
    const offsetToNavbarRight = navbarRect.right - dropdownRect.right;
    menu.style.right = `${-offsetToNavbarRight}px`;
};
const alignDropdownThemeHint = (dropdown) => {
    const menu = dropdown.querySelector('.dropdown-menu');
    const themeButton = dropdown.querySelector('.dropdown-theme-toggle');
    const hint = dropdown.querySelector('.dropdown-theme-hint');
    if (!menu || !themeButton || !hint)
        return;
    const menuRect = menu.getBoundingClientRect();
    const themeButtonRect = themeButton.getBoundingClientRect();
    const themeButtonCenterY = themeButtonRect.top - menuRect.top + (themeButtonRect.height / 2);
    hint.style.top = `${themeButtonCenterY}px`;
};
const dropdowns = document.querySelectorAll('.dropdown');
dropdowns.forEach((dropdown) => {
    const toggle = dropdown.querySelector('.dropdown-toggle');
    alignDropdownMenuToNavbar(dropdown);
    alignDropdownThemeHint(dropdown);
    if (!toggle)
        return;
    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        alignDropdownMenuToNavbar(dropdown);
        alignDropdownThemeHint(dropdown);
        dropdown.classList.toggle('open');
    });
});
document.addEventListener('click', (e) => {
    document.querySelectorAll('.dropdown.open').forEach((open) => {
        if (!open.contains(e.target))
            open.classList.remove('open');
    });
});
window.addEventListener('resize', () => {
    dropdowns.forEach((dropdown) => {
        alignDropdownMenuToNavbar(dropdown);
        alignDropdownThemeHint(dropdown);
    });
});

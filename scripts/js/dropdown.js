// --- Dropdown ---
document.querySelectorAll('.dropdown-toggle').forEach((toggle) => {
    toggle.addEventListener('click', (e) => {
        var _a;
        e.stopPropagation();
        (_a = toggle.parentElement) === null || _a === void 0 ? void 0 : _a.classList.toggle('open');
    });
});
document.addEventListener('click', (e) => {
    document.querySelectorAll('.dropdown.open').forEach((open) => {
        if (!open.contains(e.target))
            open.classList.remove('open');
    });
});

const y = document.getElementById('year') as HTMLElement | null;
if (y) y.textContent = new Date().getFullYear().toString();

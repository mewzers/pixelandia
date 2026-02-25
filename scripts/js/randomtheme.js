import { neonTheme } from './neontheme.js';
import { autumnTheme } from './autumntheme.js';

// Mise à jour de l'année
const yearEl = document.getElementById('year');
if (yearEl) {
    yearEl.textContent = new Date().getFullYear().toString();
}

const THEME_STORAGE_KEY = 'pixelandia-theme';
const STYLE_ELEMENT_ID = 'theme-dynamic-styles';
const RAINBOW_HOLD_MS = 1000;
const TAP_MAX_MS = 220;
const DEFAULT_THEME_HINT_TEXT = 'Clique ici pour changer le theme';
const THEME_HINT_LOADING_TEXTS = ['Chargement .', 'Chargement ..', 'Chargement ...'];
const INITIAL_THEME_HINT_MS = 4000;
const DEFAULT_MENU_THEME_HINT_TEXT = 'Clique ici pour changer le theme';
const MENU_THEME_HINT_LOADING_TEXT = 'Chargement...';
const rainbowTheme = {
    bodyBg: 'linear-gradient(135deg, #f1f5ff, #e7edf8)',
    bodyColor: '#111111',
    h1Color: '#111111',
    h1Shadow: '0 0 6px rgba(255, 255, 255, 0.24),0 0 14px rgba(188, 210, 255, 0.16)',
    h1Anim: 'footerLiseretFlow 5s linear infinite',
    footerBg: 'rgba(255, 255, 255, 0.78)',
    footerColor: '#111111',
    footerShadow: 'none',
    footerBeforeBg: 'linear-gradient(90deg, #ff9db1, #ffd09d, #fff1a6, #9de9d9, #9cc8ff, #d7b0ff)',
    footerBeforeShadow: 'none',
    modalBg: 'rgba(240, 248, 255, 0.94)',
    modalTextColor: '#23466e',
    modalHeadingColor: '#3b6498',
    modalBorderColor: 'rgba(150, 200, 255, 0.3)',
    modalLinkColor: '#4d88c9',
    modalCloseColor: '#3b6498',
    modalScrollbarTrack: 'rgba(192, 218, 245, 0.66)',
    modalScrollbarThumb: 'linear-gradient(180deg, #8cc9ff, #c7a6ff)',
    modalScrollbarThumbHover: '#9bd4ff',
    footerLinkHoverColor: '#4d88c9',
    footerLinkHoverShadow: '0 0 10px rgba(77, 136, 201, 0.55)'
};
const availableThemes = {
    neon: neonTheme,
    autumn: autumnTheme,
    rainbow: rainbowTheme
};

const themeToggle = document.getElementById('theme-toggle');
const themeHint = document.getElementById('theme-toggle-hint');
const themeMenuToggle = document.getElementById('theme-menu-toggle');
const menuThemeHint = document.querySelector('.dropdown-theme-hint');
const navbar = document.querySelector('.navbar');
const navbarContactLink = document.getElementById('navbar-contact');
const menuContactLink = document.getElementById('menu-contact');
const NAVBAR_CONTACT_BREAKPOINT_PX = 830;

let rainbowHoldTimer = null;
let rainbowHoldTriggered = false;
let rainbowHoldAnimationFrame = null;
let rainbowHoldStartedAt = 0;
let themeTogglePointerDownAt = 0;
let activeThemeTogglePointerId = null;
let suppressNextThemeToggleClick = false;
let menuRainbowHoldTimer = null;
let menuRainbowHoldTriggered = false;
let menuRainbowHoldAnimationFrame = null;
let menuRainbowHoldStartedAt = 0;
let menuThemeTogglePointerDownAt = 0;
let menuPreviewRestoreValue = null;
let menuPreviewRestoreLabel = null;
let suppressNextMenuThemeToggleClick = false;
let themeHintLoadingInterval = null;
let themeHintLoadingIndex = 0;
let contactInMenu = false;




const getStoredTheme = () => {
    try {
        const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
        if (storedTheme === 'neon' || storedTheme === 'autumn' || storedTheme === 'rainbow') {
            return storedTheme;
        }
    }
    catch {
        return null;
    }
    return null;
};

const saveTheme = (themeName) => {
    try {
        window.localStorage.setItem(THEME_STORAGE_KEY, themeName);
    }
    catch {
        // Ignore storage errors
    }
};
const syncNavbarPrimaryLinks = () => {
    if (!navbar)
        return;
    const setContactInMenu = (inMenu) => {
        if (contactInMenu === inMenu)
            return;
        contactInMenu = inMenu;
        navbar.classList.toggle('navbar-contact-in-menu', inMenu);
        if (navbarContactLink) {
            navbarContactLink.setAttribute('aria-hidden', inMenu ? 'true' : 'false');
            navbarContactLink.tabIndex = inMenu ? -1 : 0;
        }
        if (menuContactLink) {
            menuContactLink.style.display = inMenu ? 'block' : 'none';
            menuContactLink.setAttribute('aria-hidden', inMenu ? 'false' : 'true');
            menuContactLink.tabIndex = inMenu ? 0 : -1;
        }
    };
    setContactInMenu(window.innerWidth < NAVBAR_CONTACT_BREAKPOINT_PX);
};
const hideThemeHint = () => {
    stopThemeHintLoading(false);
    document.body.classList.remove('theme-hint-visible');
    if (themeHint) {
        themeHint.setAttribute('aria-hidden', 'true');
    }
};
const showThemeHint = () => {
    if (!themeHint)
        return;
    themeHint.setAttribute('aria-hidden', 'false');
    document.body.classList.add('theme-hint-visible');
};
const setThemeHintText = (text) => {
    if (!themeHint)
        return;
    themeHint.textContent = text;
};
const setMenuThemeHintText = (text) => {
    if (!menuThemeHint)
        return;
    menuThemeHint.textContent = text;
};
const getMenuThemeButtonValue = (themeName) => (themeName === 'neon'
    ? 'normal'
    : themeName === 'rainbow'
        ? (Math.random() < 0.5 ? 'neon' : 'normal')
        : 'neon');
const getMenuThemeButtonTextFromValue = (menuValue) => (`Th\u00e8me : ${menuValue}`);
const getMenuThemeButtonText = (themeName, menuValue) => (getMenuThemeButtonTextFromValue(menuValue ?? getMenuThemeButtonValue(themeName)));
const stopThemeHintLoading = (resetText = true) => {
    if (themeHintLoadingInterval !== null) {
        window.clearInterval(themeHintLoadingInterval);
        themeHintLoadingInterval = null;
    }
    if (resetText) {
        setThemeHintText(DEFAULT_THEME_HINT_TEXT);
    }
};
const startThemeHintLoading = () => {
    if (!themeHint)
        return;
    showThemeHint();
    stopThemeHintLoading(false);
    themeHintLoadingIndex = 0;
    setThemeHintText(THEME_HINT_LOADING_TEXTS[themeHintLoadingIndex]);
    themeHintLoadingInterval = window.setInterval(() => {
        themeHintLoadingIndex = (themeHintLoadingIndex + 1) % THEME_HINT_LOADING_TEXTS.length;
        setThemeHintText(THEME_HINT_LOADING_TEXTS[themeHintLoadingIndex]);
    }, 250);
};

const triggerThemeToggleBurst = () => {
    if (!themeToggle)
        return;
    themeToggle.classList.remove('theme-toggle-burst');
    // Force reflow so the burst can replay each time
    void themeToggle.offsetWidth;
    themeToggle.classList.add('theme-toggle-burst');
};

const applyTheme = (themeName) => {
    const theme = availableThemes[themeName];
    document.body.setAttribute('data-theme', themeName);

    // Application au body
    document.body.style.backgroundImage = theme.bodyBg;
    document.body.style.color = theme.bodyColor;
    document.documentElement.style.setProperty('--footer-link-hover-color', theme.footerLinkHoverColor);
    document.documentElement.style.setProperty('--footer-link-hover-shadow', theme.footerLinkHoverShadow);

    // h1
    const h1 = document.querySelector('h1');
    if (h1) {
        h1.style.color = theme.h1Color;
        h1.style.textShadow = theme.h1Shadow;
        h1.style.animation = theme.h1Anim;
    }

    // footer
    const footer = document.querySelector('footer');
    if (footer) {
        footer.style.background = theme.footerBg;
        footer.style.color = theme.footerColor;
        footer.style.textShadow = theme.footerShadow;
    }

    // Liseré du footer (::before)
    let styleSheet = document.getElementById(STYLE_ELEMENT_ID);
    if (!styleSheet) {
        styleSheet = document.createElement('style');
        styleSheet.id = STYLE_ELEMENT_ID;
        document.head.appendChild(styleSheet);
    }

    styleSheet.innerText = `
  footer::before {
    background: ${theme.footerBeforeBg};
    background-size: 220% 100%;
    background-position: 0% 50%;
    animation: footerLiseretFlow 4s linear infinite;
    box-shadow: ${theme.footerBeforeShadow};
    opacity: ${themeName === 'neon' ? '0.9' : themeName === 'rainbow' ? '0.85' : '1'};
  }

  #privacy-content {
    scrollbar-color: ${theme.modalCloseColor} transparent;
  }

  @keyframes privacyScrollGlow {
    0% {
      box-shadow: ${theme.footerBeforeShadow}, 0 0 10px rgba(255, 255, 255, 0.22), inset 0 0 8px rgba(255, 255, 255, 0.2);
      filter: brightness(1);
    }
    50% {
      box-shadow: ${theme.footerBeforeShadow}, 0 0 24px rgba(255, 255, 255, 0.48), inset 0 0 14px rgba(255, 255, 255, 0.32);
      filter: brightness(1.12);
    }
    100% {
      box-shadow: ${theme.footerBeforeShadow}, 0 0 10px rgba(255, 255, 255, 0.22), inset 0 0 8px rgba(255, 255, 255, 0.2);
      filter: brightness(1);
    }
  }

  #privacy-content::-webkit-scrollbar {
    width: 14px !important;
  }

  #privacy-content::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05) !important;
    border-radius: 999px;
    box-shadow: inset 0 0 14px rgba(255, 255, 255, 0.24) !important;
  }

  #privacy-content::-webkit-scrollbar-thumb {
    background: ${theme.footerBeforeBg} !important;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.18) !important;
    background-clip: padding-box;
    box-shadow: ${theme.footerBeforeShadow}, 0 0 18px rgba(255, 255, 255, 0.38), inset 0 0 10px rgba(255, 255, 255, 0.28) !important;
    animation: privacyScrollGlow 1.6s ease-in-out infinite !important;
    min-height: 56px;
  }

  #privacy-content::-webkit-scrollbar-thumb:hover {
    background: ${theme.footerBeforeBg} !important;
    box-shadow: ${theme.footerBeforeShadow}, 0 0 36px rgba(255, 255, 255, 0.72), inset 0 0 18px rgba(255, 255, 255, 0.45) !important;
    filter: brightness(1.2);
  }
`;

    // Modale privacy
    const privacyContent = document.getElementById('privacy-content');
    if (privacyContent) {
        privacyContent.style.background = 'transparent';
        privacyContent.style.color = theme.modalTextColor;
        privacyContent.style.border = 'none';
        privacyContent.style.boxShadow = 'none';
    }

    document.querySelectorAll('#privacy-content h1, #privacy-content h2, #privacy-content h3, #privacy-content h4')
        .forEach((heading) => {
            heading.style.color = theme.modalHeadingColor;
        });

    document.querySelectorAll('#privacy-content a')
        .forEach((link) => {
            link.style.color = theme.modalLinkColor;
        });

    const privacyClose = document.getElementById('privacy-close');
    if (privacyClose) {
        privacyClose.style.color = theme.modalCloseColor;
    }

    if (themeToggle) {
        themeToggle.setAttribute('data-theme', themeName);
        let nextThemeLabel = 'Activer le thème automne';
        if (themeName === 'autumn')
            nextThemeLabel = 'Activer le thème neon';
        if (themeName === 'rainbow')
            nextThemeLabel = 'Activer le thème neon';
        themeToggle.setAttribute('aria-label', nextThemeLabel);
    }
    if (themeMenuToggle) {
        const menuValue = getMenuThemeButtonValue(themeName);
        const menuLabel = getMenuThemeButtonText(themeName, menuValue);
        themeMenuToggle.textContent = menuLabel;
        themeMenuToggle.setAttribute('aria-label', menuLabel);
        themeMenuToggle.setAttribute('data-target-theme', menuValue);
    }
};

let activeThemeName = getStoredTheme() ?? (Math.random() < 0.5 ? 'neon' : 'autumn');
applyTheme(activeThemeName);
saveTheme(activeThemeName);
window.addEventListener('resize', syncNavbarPrimaryLinks);
window.addEventListener('orientationchange', syncNavbarPrimaryLinks);
window.requestAnimationFrame(syncNavbarPrimaryLinks);

if (themeToggle) {
    themeToggle.addEventListener('contextmenu', (event) => {
        event.preventDefault();
    });
    themeToggle.addEventListener('touchstart', (event) => {
        if (event.cancelable)
            event.preventDefault();
    }, { passive: false });
    const HOLD_PROGRESS_PROPERTY = '--theme-toggle-hold-progress';
    const THEME_TOGGLE_HIDE_BREAKPOINT = 675;
    const setHoldProgress = (progress) => {
        const clampedProgress = Math.min(1, Math.max(0, progress));
        themeToggle.style.setProperty(HOLD_PROGRESS_PROPERTY, clampedProgress.toString());
    };
    const stopHoldVisual = (resetProgress) => {
        if (rainbowHoldAnimationFrame !== null) {
            window.cancelAnimationFrame(rainbowHoldAnimationFrame);
            rainbowHoldAnimationFrame = null;
        }
        themeToggle.classList.remove('theme-toggle-holding');
        if (resetProgress) {
            setHoldProgress(0);
        }
    };
    const forceResetThemeToggleState = () => {
        stopHoldVisual(true);
        themeToggle.style.removeProperty(HOLD_PROGRESS_PROPERTY);
        themeToggle.classList.add('theme-toggle-force-reset');
        themeToggle.style.pointerEvents = 'none';
        window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => {
                themeToggle.classList.remove('theme-toggle-force-reset');
                themeToggle.style.pointerEvents = '';
            });
        });
        themeToggle.blur();
        if (activeThemeTogglePointerId !== null && themeToggle.hasPointerCapture(activeThemeTogglePointerId)) {
            themeToggle.releasePointerCapture(activeThemeTogglePointerId);
        }
        activeThemeTogglePointerId = null;
    };
    const updateHoldVisual = (timestamp) => {
        const elapsed = timestamp - rainbowHoldStartedAt;
        const linearProgress = Math.min(1, Math.max(0, elapsed / RAINBOW_HOLD_MS));
        // Courbe plus rapide au debut, tout en restant fluide.
        const easedProgress = 1 - Math.pow(1 - linearProgress, 2.6);
        setHoldProgress(easedProgress);
        if (elapsed < RAINBOW_HOLD_MS) {
            rainbowHoldAnimationFrame = window.requestAnimationFrame(updateHoldVisual);
        }
        else {
            rainbowHoldAnimationFrame = null;
        }
    };
    const startHoldVisual = () => {
        stopHoldVisual(true);
        rainbowHoldStartedAt = window.performance.now();
        themeToggle.classList.add('theme-toggle-holding');
        rainbowHoldAnimationFrame = window.requestAnimationFrame(updateHoldVisual);
    };
    const clearRainbowHold = (forceReset = true) => {
        const hadThemeToggleInteraction = rainbowHoldTimer !== null
            || activeThemeTogglePointerId !== null
            || themeToggle.classList.contains('theme-toggle-holding');
        if (rainbowHoldTimer !== null) {
            window.clearTimeout(rainbowHoldTimer);
            rainbowHoldTimer = null;
        }
        if (forceReset) {
            forceResetThemeToggleState();
        }
        else {
            stopHoldVisual(true);
        }
        if (hadThemeToggleInteraction) {
            hideThemeHint();
        }
    };
    const syncThemeToggleDisabledState = () => {
        const isHidden = window.innerWidth <= THEME_TOGGLE_HIDE_BREAKPOINT;
        if (isHidden) {
            clearRainbowHold();
            rainbowHoldTriggered = false;
            hideThemeHint();
        }
        themeToggle.classList.toggle('theme-toggle-hidden', isHidden);
        themeToggle.setAttribute('aria-hidden', isHidden ? 'true' : 'false');
        if (themeMenuToggle) {
            themeMenuToggle.classList.toggle('is-visible', isHidden);
        }
    };
    themeToggle.addEventListener('pointerdown', (event) => {
        if (themeToggle.classList.contains('theme-toggle-hidden'))
            return;
        themeTogglePointerDownAt = window.performance.now();
        activeThemeTogglePointerId = event.pointerId;
        try {
            themeToggle.setPointerCapture(event.pointerId);
        }
        catch {
            // Ignore capture errors
        }
        clearRainbowHold(false);
        startThemeHintLoading();
        rainbowHoldTriggered = false;
        startHoldVisual();
        rainbowHoldTimer = window.setTimeout(() => {
            rainbowHoldTimer = null;
            rainbowHoldTriggered = true;
            stopHoldVisual(false);
            setHoldProgress(1);
            if (activeThemeName === 'rainbow') {
                activeThemeName = 'neon';
                applyTheme(activeThemeName);
                saveTheme(activeThemeName);
            }
            else {
                triggerThemeToggleBurst();
                activeThemeName = 'rainbow';
                applyTheme(activeThemeName);
                saveTheme(activeThemeName);
            }
            setHoldProgress(0);
            forceResetThemeToggleState();
            hideThemeHint();
        }, RAINBOW_HOLD_MS);
    });
    themeToggle.addEventListener('pointerup', (event) => {
        const hadActiveHold = rainbowHoldTimer !== null;
        const holdDuration = Math.max(0, window.performance.now() - themeTogglePointerDownAt);
        const isQuickTap = holdDuration <= TAP_MAX_MS;
        clearRainbowHold();
        if (!rainbowHoldTriggered && !isQuickTap) {
            suppressNextThemeToggleClick = true;
        }
        if (event.pointerType === 'touch' && hadActiveHold && !rainbowHoldTriggered && isQuickTap) {
            activeThemeName = activeThemeName === 'neon' ? 'autumn' : 'neon';
            applyTheme(activeThemeName);
            saveTheme(activeThemeName);
            hideThemeHint();
            suppressNextThemeToggleClick = true;
        }
    });
    themeToggle.addEventListener('pointercancel', clearRainbowHold);
    themeToggle.addEventListener('pointerleave', clearRainbowHold);
    themeToggle.addEventListener('touchend', clearRainbowHold, { passive: true });
    themeToggle.addEventListener('touchcancel', clearRainbowHold, { passive: true });
    window.addEventListener('pointerup', clearRainbowHold);
    window.addEventListener('pointercancel', clearRainbowHold);
    window.addEventListener('blur', clearRainbowHold);
    window.addEventListener('touchend', clearRainbowHold, { passive: true });
    window.addEventListener('touchcancel', clearRainbowHold, { passive: true });
    themeToggle.addEventListener('click', () => {
        if (suppressNextThemeToggleClick) {
            suppressNextThemeToggleClick = false;
            return;
        }
        if (rainbowHoldTriggered) {
            rainbowHoldTriggered = false;
            return;
        }
        activeThemeName = activeThemeName === 'neon' ? 'autumn' : 'neon';
        applyTheme(activeThemeName);
        saveTheme(activeThemeName);
        hideThemeHint();
    });
    themeToggle.addEventListener('animationend', (event) => {
        if (event.animationName === 'themeToggleBurst') {
            themeToggle.classList.remove('theme-toggle-burst');
        }
    });
    window.addEventListener('resize', syncThemeToggleDisabledState);
    window.addEventListener('orientationchange', syncThemeToggleDisabledState);
    window.requestAnimationFrame(syncThemeToggleDisabledState);
}

if (themeHint) {
    setThemeHintText(DEFAULT_THEME_HINT_TEXT);
    showThemeHint();
    window.setTimeout(() => {
        hideThemeHint();
    }, INITIAL_THEME_HINT_MS);
}
if (menuThemeHint) {
    setMenuThemeHintText(DEFAULT_MENU_THEME_HINT_TEXT);
}
if (themeMenuToggle) {
    themeMenuToggle.addEventListener('contextmenu', (event) => {
        event.preventDefault();
    });
    themeMenuToggle.addEventListener('touchstart', (event) => {
        if (event.cancelable)
            event.preventDefault();
    }, { passive: false });
    const MENU_HOLD_PROGRESS_PROPERTY = '--theme-menu-hold-progress';
    const setMenuHoldProgress = (progress) => {
        const clampedProgress = Math.min(1, Math.max(0, progress));
        themeMenuToggle.style.setProperty(MENU_HOLD_PROGRESS_PROPERTY, clampedProgress.toString());
    };
    const stopMenuHoldVisual = (resetProgress) => {
        if (menuRainbowHoldAnimationFrame !== null) {
            window.cancelAnimationFrame(menuRainbowHoldAnimationFrame);
            menuRainbowHoldAnimationFrame = null;
        }
        themeMenuToggle.classList.remove('theme-menu-holding');
        if (resetProgress) {
            setMenuHoldProgress(0);
        }
    };
    const updateMenuHoldVisual = (timestamp) => {
        const elapsed = timestamp - menuRainbowHoldStartedAt;
        const progress = Math.min(1, Math.max(0, elapsed / RAINBOW_HOLD_MS));
        setMenuHoldProgress(progress);
        if (elapsed < RAINBOW_HOLD_MS) {
            menuRainbowHoldAnimationFrame = window.requestAnimationFrame(updateMenuHoldVisual);
        }
        else {
            menuRainbowHoldAnimationFrame = null;
        }
    };
    const startMenuHoldVisual = () => {
        stopMenuHoldVisual(true);
        menuRainbowHoldStartedAt = window.performance.now();
        themeMenuToggle.classList.add('theme-menu-holding');
        menuRainbowHoldAnimationFrame = window.requestAnimationFrame(updateMenuHoldVisual);
    };
    const clearMenuRainbowHold = (restoreButton = true) => {
        if (menuRainbowHoldTimer !== null) {
            window.clearTimeout(menuRainbowHoldTimer);
            menuRainbowHoldTimer = null;
        }
        stopMenuHoldVisual(true);
        const hadPreview = themeMenuToggle.classList.contains('theme-menu-preview-rainbow');
        themeMenuToggle.classList.remove('theme-menu-preview-rainbow');
        if (restoreButton) {
            const currentButtonValue = themeMenuToggle.getAttribute('data-target-theme');
            const currentMenuValue = currentButtonValue === 'normal' || currentButtonValue === 'neon'
                ? currentButtonValue
                : null;
            const menuValue = hadPreview && menuPreviewRestoreValue
                ? menuPreviewRestoreValue
                : activeThemeName === 'rainbow' && currentMenuValue
                    ? currentMenuValue
                    : getMenuThemeButtonValue(activeThemeName);
            const menuLabel = hadPreview && menuPreviewRestoreLabel
                ? menuPreviewRestoreLabel
                : activeThemeName === 'rainbow' && themeMenuToggle.textContent
                    ? themeMenuToggle.textContent
                    : getMenuThemeButtonTextFromValue(menuValue);
            themeMenuToggle.textContent = menuLabel;
            themeMenuToggle.setAttribute('aria-label', menuLabel);
            themeMenuToggle.setAttribute('data-target-theme', menuValue);
        }
        menuPreviewRestoreValue = null;
        menuPreviewRestoreLabel = null;
        setMenuThemeHintText(DEFAULT_MENU_THEME_HINT_TEXT);
    };
    themeMenuToggle.addEventListener('pointerdown', () => {
        menuThemeTogglePointerDownAt = window.performance.now();
        const currentValue = themeMenuToggle.getAttribute('data-target-theme');
        const currentLabel = themeMenuToggle.textContent;
        clearMenuRainbowHold(false);
        menuPreviewRestoreValue = currentValue === 'normal' || currentValue === 'neon' ? currentValue : null;
        menuPreviewRestoreLabel = currentLabel;
        if (activeThemeName !== 'rainbow') {
            themeMenuToggle.classList.add('theme-menu-preview-rainbow');
            themeMenuToggle.textContent = 'Th\u00e8me : rainbow';
            themeMenuToggle.setAttribute('aria-label', 'Th\u00e8me : rainbow');
            themeMenuToggle.setAttribute('data-target-theme', 'rainbow');
        }
        setMenuThemeHintText(MENU_THEME_HINT_LOADING_TEXT);
        menuRainbowHoldTriggered = false;
        startMenuHoldVisual();
        menuRainbowHoldTimer = window.setTimeout(() => {
            menuRainbowHoldTimer = null;
            menuRainbowHoldTriggered = true;
            stopMenuHoldVisual(false);
            setMenuHoldProgress(1);
            if (activeThemeName === 'rainbow') {
                const buttonValue = menuPreviewRestoreValue
                    ?? (themeMenuToggle.getAttribute('data-target-theme') === 'normal'
                        ? 'normal'
                        : themeMenuToggle.getAttribute('data-target-theme') === 'neon'
                            ? 'neon'
                            : null);
                const targetTheme = buttonValue === 'neon'
                    ? 'neon'
                    : buttonValue === 'normal'
                        ? 'autumn'
                        : null;
                if (targetTheme) {
                    activeThemeName = targetTheme;
                    applyTheme(activeThemeName);
                    saveTheme(activeThemeName);
                }
            }
            else {
                activeThemeName = 'rainbow';
                applyTheme(activeThemeName);
                saveTheme(activeThemeName);
            }
            hideThemeHint();
        }, RAINBOW_HOLD_MS);
    });
    themeMenuToggle.addEventListener('pointerup', (event) => {
        const hadActiveHold = menuRainbowHoldTimer !== null;
        const holdDuration = Math.max(0, window.performance.now() - menuThemeTogglePointerDownAt);
        const isQuickTap = holdDuration <= TAP_MAX_MS;
        clearMenuRainbowHold();
        if (!menuRainbowHoldTriggered && !isQuickTap) {
            suppressNextMenuThemeToggleClick = true;
        }
        if (event.pointerType === 'touch' && hadActiveHold && !menuRainbowHoldTriggered && isQuickTap) {
            activeThemeName = activeThemeName === 'neon' ? 'autumn' : 'neon';
            applyTheme(activeThemeName);
            saveTheme(activeThemeName);
            hideThemeHint();
            suppressNextMenuThemeToggleClick = true;
        }
    });
    themeMenuToggle.addEventListener('pointercancel', clearMenuRainbowHold);
    themeMenuToggle.addEventListener('pointerleave', clearMenuRainbowHold);
    themeMenuToggle.addEventListener('click', () => {
        if (suppressNextMenuThemeToggleClick) {
            suppressNextMenuThemeToggleClick = false;
            return;
        }
        if (menuRainbowHoldTriggered) {
            menuRainbowHoldTriggered = false;
            setMenuHoldProgress(0);
            return;
        }
        activeThemeName = activeThemeName === 'neon' ? 'autumn' : 'neon';
        applyTheme(activeThemeName);
        saveTheme(activeThemeName);
        hideThemeHint();
    });
}












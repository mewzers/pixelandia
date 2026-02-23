import { neonTheme } from './neontheme.js';
import { autumnTheme } from './autumntheme.js';

// Mise à jour de l'année
const yearEl = document.getElementById('year');
if (yearEl) {
    yearEl.textContent = new Date().getFullYear().toString();
}

const THEME_STORAGE_KEY = 'pixelandia-theme';
const STYLE_ELEMENT_ID = 'theme-dynamic-styles';
const RAINBOW_HOLD_MS = 5000;
const rainbowTheme = {
    bodyBg: 'linear-gradient(135deg, #ffffff, #f7f7f7)',
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
let rainbowHoldTimer = null;
let rainbowHoldTriggered = false;

const getStoredTheme = () => {
    try {
        const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
        if (storedTheme === 'neon' || storedTheme === 'autumn') {
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

const hideThemeHint = () => {
    document.body.classList.remove('theme-hint-visible');
    if (themeHint) {
        themeHint.setAttribute('aria-hidden', 'true');
    }
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
};

let activeThemeName = getStoredTheme() ?? (Math.random() < 0.5 ? 'neon' : 'autumn');
applyTheme(activeThemeName);
saveTheme(activeThemeName);

if (themeToggle) {
    const clearRainbowHold = () => {
        if (rainbowHoldTimer !== null) {
            window.clearTimeout(rainbowHoldTimer);
            rainbowHoldTimer = null;
        }
    };
    themeToggle.addEventListener('pointerdown', () => {
        clearRainbowHold();
        rainbowHoldTriggered = false;
        rainbowHoldTimer = window.setTimeout(() => {
            rainbowHoldTriggered = true;
            triggerThemeToggleBurst();
            activeThemeName = 'rainbow';
            applyTheme(activeThemeName);
            hideThemeHint();
        }, RAINBOW_HOLD_MS);
    });
    themeToggle.addEventListener('pointerup', clearRainbowHold);
    themeToggle.addEventListener('pointercancel', clearRainbowHold);
    themeToggle.addEventListener('pointerleave', clearRainbowHold);
    themeToggle.addEventListener('click', () => {
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
}

if (themeHint) {
    themeHint.setAttribute('aria-hidden', 'false');
    document.body.classList.add('theme-hint-visible');
    window.setTimeout(() => {
        hideThemeHint();
    }, 9000);
}



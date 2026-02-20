import { neonTheme } from './neontheme.js';
import { autumnTheme } from './autumntheme.js';
// Mise à jour de l'année
const yearEl = document.getElementById("year");
if (yearEl) {
    yearEl.textContent = new Date().getFullYear().toString();
}
// Choix aléatoire
const availableThemes = [neonTheme, autumnTheme];
const theme = availableThemes[Math.floor(Math.random() * availableThemes.length)];
// Application au body
document.body.style.background = theme.bodyBg;
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
const styleSheet = document.createElement('style');
styleSheet.innerText = `
  footer::before {
    background: ${theme.footerBeforeBg};
    box-shadow: ${theme.footerBeforeShadow};
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
document.head.appendChild(styleSheet);
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

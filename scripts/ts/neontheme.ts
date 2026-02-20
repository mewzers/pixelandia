const isDark: boolean = window.matchMedia('(prefers-color-scheme: dark)').matches;

export interface Theme {
    bodyBg: string;
    bodyColor: string;
    h1Color: string;
    h1Shadow: string;
    h1Anim: string;
    footerBg: string;
    footerColor: string;
    footerShadow: string;
    footerBeforeBg: string;
    footerBeforeShadow: string;
    modalBg: string;
    modalTextColor: string;
    modalHeadingColor: string;
    modalBorderColor: string;
    modalLinkColor: string;
    modalCloseColor: string;
    modalScrollbarTrack: string;
    modalScrollbarThumb: string;
    modalScrollbarThumbHover: string;
    footerLinkHoverColor: string;
    footerLinkHoverShadow: string;
}

export const neonTheme: Theme = {
    bodyBg: isDark
        ? 'linear-gradient(135deg, #0d0f1a, #120d2b)'
        : 'linear-gradient(135deg, #e0f7ff, #b0e0ff)',
    bodyColor: isDark ? '#e0f7ff' : '#0a1f44',
    h1Color: isDark ? '#00fff7' : '#004e92',
    h1Shadow: isDark
        ? '0 0 5px #00fff7,0 0 10px #00fff7,0 0 20px #00fff7,0 0 40px #00fff7,0 0 80px #00fff7'
        : '0 0 5px #4a90e2,0 0 10px #4a90e2,0 0 20px #4a90e2',
    h1Anim: isDark ? 'glitch-dark 2s infinite' : 'glitch-light 2s infinite',
    footerBg: isDark ? 'rgba(0,0,0,0.45)' : 'rgba(200,230,255,0.85)',
    footerColor: isDark ? '#8888ff' : '#1a3d7c',
    footerShadow: isDark ? '0 0 8px #4444ff88' : 'none',
    footerBeforeBg: isDark
        ? 'linear-gradient(90deg, #00f0ff, #0040ff, #00f0ff)'
        : 'linear-gradient(90deg, #0077ff, #00bfff, #0077ff)',
    footerBeforeShadow: isDark
        ? '0 0 8px #00f0ff,0 0 20px #00f0ff,0 0 30px #0040ff'
        : '0 0 6px #0077ff,0 0 15px #00bfff,0 0 25px #0077ff',
    modalBg: isDark ? 'rgba(15, 20, 35, 0.95)' : 'rgba(245, 252, 255, 0.96)',
    modalTextColor: isDark ? '#d4f7ff' : '#12345c',
    modalHeadingColor: isDark ? '#00fff7' : '#005fa3',
    modalBorderColor: isDark ? 'rgba(0, 255, 247, 0.35)' : 'rgba(0, 119, 255, 0.25)',
    modalLinkColor: isDark ? '#79e8ff' : '#006ac2',
    modalCloseColor: isDark ? '#00fff7' : '#005fa3',
    modalScrollbarTrack: isDark ? 'rgba(10, 24, 40, 0.6)' : 'rgba(208, 232, 255, 0.9)',
    modalScrollbarThumb: isDark
        ? 'linear-gradient(180deg, #00fff7, #005eff)'
        : 'linear-gradient(180deg, #0077ff, #00bfff)',
    modalScrollbarThumbHover: isDark ? '#00e2ff' : '#0068d6',
    footerLinkHoverColor: isDark ? '#00fff7' : '#0077ff',
    footerLinkHoverShadow: isDark
        ? '0 0 10px rgba(0, 255, 247, 0.95)'
        : '0 0 10px rgba(0, 119, 255, 0.9)'
};

import { i18n } from '../../services/i18n.js';

export function createSplashScreen() {
  const splash = document.createElement('div');
  splash.className = 'splash-screen fade-in';
  splash.innerHTML = `
    <div class="splash-logo">⚡</div>
    <h1 class="splash-title">VendaMais</h1>
    <div class="splash-loading">
      <div class="splash-loading-bar">
        <div class="splash-loading-progress"></div>
      </div>
    </div>
  `;

  return splash;
}

export function hideSplashScreen() {
  const splash = document.querySelector('.splash-screen');
  if (splash) {
    splash.classList.add('fade-out');
    setTimeout(() => {
      splash.remove();
    }, 300);
  }
}

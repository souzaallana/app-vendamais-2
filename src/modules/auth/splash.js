import { i18n } from '../../services/i18n.js';

export function createSplashScreen() {
  const splash = document.createElement('div');
  splash.className = 'splash-screen';
  splash.innerHTML = `
    <style>
      .splash-screen {
        width: 100%;
        height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: var(--gradient-purple-blue);
        color: white;
      }

      .splash-logo {
        font-size: 48px;
        font-weight: 900;
        margin-bottom: var(--spacing-8);
        letter-spacing: -1px;
        text-align: center;
      }

      .splash-loader {
        width: 200px;
        height: 4px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 2px;
        overflow: hidden;
        position: relative;
      }

      .splash-loader-bar {
        height: 100%;
        background: white;
        border-radius: 2px;
        animation: loading 1.5s ease-in-out;
        transform-origin: left;
      }

      @keyframes loading {
        0% {
          transform: scaleX(0);
        }
        100% {
          transform: scaleX(1);
        }
      }

      .splash-text {
        margin-top: var(--spacing-6);
        font-size: 14px;
        font-weight: 300;
        opacity: 0.9;
      }
    </style>

    <div class="splash-logo">Lojista</div>
    <div class="splash-loader">
      <div class="splash-loader-bar"></div>
    </div>
    <div class="splash-text">${i18n.t('splash_loading')}</div>
  `;

  return splash;
}

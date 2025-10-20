import { i18n } from '../services/i18n.js';
import { router } from '../services/router.js';
import { icons } from './helpers.js';

export function createBottomNav() {
  const navbar = document.createElement('nav');
  navbar.className = 'bottom-nav';
  navbar.innerHTML = `
    <style>
      .bottom-nav {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: white;
        box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 8px 0 calc(8px + env(safe-area-inset-bottom));
        z-index: var(--z-navbar);
      }

      .nav-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        padding: 8px 12px;
        color: var(--text-secondary);
        background: none;
        border: none;
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 12px;
        font-weight: 500;
        min-width: 60px;
      }

      .nav-item svg {
        width: 24px;
        height: 24px;
      }

      .nav-item.active {
        color: var(--primary-purple);
      }

      .nav-item:not(.nav-center):hover {
        color: var(--primary-purple);
        transform: translateY(-2px);
      }

      .nav-center {
        position: relative;
        margin: 0 8px;
      }

      .nav-fab {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: var(--gradient-purple);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        cursor: pointer;
        box-shadow: var(--shadow-lg);
        transition: all 0.2s ease;
        margin-bottom: 20px;
      }

      .nav-fab:hover {
        transform: translateY(-4px) scale(1.05);
        box-shadow: var(--shadow-xl);
      }

      .nav-fab svg {
        width: 28px;
        height: 28px;
      }
    </style>

    <button class="nav-item" data-route="/home">
      ${icons.home}
      <span>${i18n.t('nav_home')}</span>
    </button>

    <button class="nav-item" data-route="/products">
      ${icons.package}
      <span>${i18n.t('nav_products')}</span>
    </button>

    <div class="nav-center">
      <button class="nav-fab" id="nav-register">
        ${icons.plus}
      </button>
    </div>

    <button class="nav-item" data-route="/help">
      ${icons.lightbulb}
      <span>${i18n.t('nav_help')}</span>
    </button>

    <button class="nav-item" data-route="/profile">
      ${icons.user}
      <span>${i18n.t('nav_profile')}</span>
    </button>
  `;

  navbar.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const route = item.dataset.route;
      if (route) {
        router.navigate(route);
        updateActiveNav(route);
      }
    });
  });

  navbar.querySelector('#nav-register').addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('openRegisterModal'));
  });

  function updateActiveNav(currentRoute) {
    navbar.querySelectorAll('.nav-item').forEach(item => {
      if (item.dataset.route === currentRoute) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  const currentRoute = router.getCurrentRoute();
  if (currentRoute) {
    updateActiveNav(currentRoute);
  }

  return navbar;
}

export function updateNavbarLanguage() {
  const navbar = document.querySelector('.bottom-nav');
  if (navbar) {
    const items = navbar.querySelectorAll('.nav-item span');
    items[0].textContent = i18n.t('nav_home');
    items[1].textContent = i18n.t('nav_products');
    items[2].textContent = i18n.t('nav_help');
    items[3].textContent = i18n.t('nav_profile');
  }
}

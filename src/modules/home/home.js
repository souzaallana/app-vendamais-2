import { i18n } from '../../services/i18n.js';
import { authService, productsService } from '../../services/supabase.js';
import { createBottomNav } from '../../utils/navbar.js';
import { icons, showSnackbar } from '../../utils/helpers.js';

export async function createHomeScreen() {
  const user = await authService.getCurrentUser();
  const profile = user ? await authService.getProfile(user.id) : null;
  const stats = await productsService.getStats().catch(() => ({
    total: 0,
    active: 0,
    mercadoLivre: 0,
  }));

  const container = document.createElement('div');
  container.className = 'home-screen';
  container.innerHTML = `
    <style>
      .home-screen {
        width: 100%;
        min-height: 100vh;
        padding-bottom: 80px;
        background: var(--bg-gray-50);
      }

      .home-header {
        background: var(--gradient-purple-blue);
        color: white;
        padding: var(--spacing-6);
        padding-top: calc(var(--spacing-6) + env(safe-area-inset-top));
        border-radius: 0 0 24px 24px;
      }

      .home-header-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--spacing-6);
      }

      .home-welcome {
        font-size: 24px;
        font-weight: 700;
      }

      .language-selector {
        display: flex;
        gap: var(--spacing-2);
        background: rgba(255, 255, 255, 0.2);
        padding: 4px;
        border-radius: 8px;
      }

      .lang-btn {
        padding: 6px 12px;
        background: transparent;
        border: none;
        color: white;
        font-size: 12px;
        font-weight: 500;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .lang-btn.active {
        background: white;
        color: var(--primary-purple);
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--spacing-3);
        margin-top: var(--spacing-4);
      }

      .stat-card {
        background: rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(10px);
        padding: var(--spacing-4);
        border-radius: var(--border-radius);
        text-align: center;
      }

      .stat-value {
        font-size: 28px;
        font-weight: 900;
        margin-bottom: var(--spacing-1);
      }

      .stat-label {
        font-size: 12px;
        opacity: 0.9;
        font-weight: 300;
      }

      .home-content {
        padding: var(--spacing-6);
      }

      .section {
        margin-bottom: var(--spacing-8);
      }

      .section-title {
        font-size: 20px;
        font-weight: 700;
        margin-bottom: var(--spacing-4);
        display: flex;
        align-items: center;
        gap: var(--spacing-2);
      }

      .section-title svg {
        width: 24px;
        height: 24px;
        color: var(--primary-purple);
      }

      .quick-actions {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: var(--spacing-4);
      }

      .action-card {
        background: white;
        padding: var(--spacing-5);
        border-radius: var(--border-radius-lg);
        box-shadow: var(--shadow-md);
        text-align: center;
        transition: all 0.2s;
        cursor: pointer;
        border: 2px solid transparent;
      }

      .action-card:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-lg);
        border-color: var(--primary-purple);
      }

      .action-card.disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .action-card.disabled:hover {
        transform: none;
        border-color: transparent;
      }

      .action-icon {
        width: 48px;
        height: 48px;
        background: var(--gradient-purple);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto var(--spacing-3);
      }

      .action-icon svg {
        width: 24px;
        height: 24px;
      }

      .action-title {
        font-weight: 600;
        margin-bottom: var(--spacing-1);
      }

      .action-subtitle {
        font-size: 13px;
        color: var(--text-secondary);
      }

      .marketplace-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: var(--spacing-3);
      }

      .marketplace-card {
        background: white;
        padding: var(--spacing-4);
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-sm);
        display: flex;
        align-items: center;
        gap: var(--spacing-3);
      }

      .marketplace-logo {
        width: 40px;
        height: 40px;
        background: var(--bg-gray-100);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 12px;
      }

      .marketplace-info h4 {
        font-size: 14px;
        font-weight: 600;
        margin-bottom: 2px;
      }

      .marketplace-status {
        font-size: 12px;
        color: #10B981;
        font-weight: 500;
      }

      .marketplace-status.coming-soon {
        color: var(--text-secondary);
      }
    </style>

    <div class="home-header">
      <div class="home-header-top">
        <div class="home-welcome">${i18n.t('home_welcome', { name: profile?.full_name || 'Lili' })}</div>
        <div class="language-selector">
          <button class="lang-btn ${i18n.getLanguage() === 'pt' ? 'active' : ''}" data-lang="pt">PT</button>
          <button class="lang-btn ${i18n.getLanguage() === 'en' ? 'active' : ''}" data-lang="en">EN</button>
          <button class="lang-btn ${i18n.getLanguage() === 'es' ? 'active' : ''}" data-lang="es">ES</button>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">${stats.total}</div>
          <div class="stat-label">${i18n.t('home_stats_total')}</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.active}</div>
          <div class="stat-label">${i18n.t('home_stats_active')}</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.mercadoLivre}</div>
          <div class="stat-label">${i18n.t('home_stats_ml')}</div>
        </div>
      </div>
    </div>

    <div class="home-content">
      <section class="section">
        <h2 class="section-title">
          ${icons.sparkles}
          ${i18n.t('home_quick_register')}
        </h2>
        <div class="quick-actions">
          <div class="action-card" data-action="photo">
            <div class="action-icon">${icons.camera}</div>
            <div class="action-title">${i18n.t('register_photo')}</div>
            <div class="action-subtitle">Modo IA</div>
          </div>
          <div class="action-card disabled" data-action="voice">
            <div class="action-icon">${icons.mic}</div>
            <div class="action-title">${i18n.t('register_voice')}</div>
            <div class="action-subtitle">${i18n.t('register_coming_soon')}</div>
          </div>
        </div>
      </section>

      <section class="section">
        <h2 class="section-title">
          ${icons.share}
          ${i18n.t('home_marketplaces')}
        </h2>
        <div class="marketplace-grid">
          <div class="marketplace-card">
            <div class="marketplace-logo" style="background: #FFE600; color: #000;">ML</div>
            <div class="marketplace-info">
              <h4>Mercado Livre</h4>
              <div class="marketplace-status">Conectado</div>
            </div>
          </div>
          <div class="marketplace-card">
            <div class="marketplace-logo" style="background: #EE4D2D; color: #fff;">S</div>
            <div class="marketplace-info">
              <h4>Shopee</h4>
              <div class="marketplace-status coming-soon">${i18n.t('register_coming_soon')}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `;

  container.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      i18n.setLanguage(lang);
      showSnackbar(`Idioma alterado para ${lang.toUpperCase()}`, 'success');
    });
  });

  container.querySelectorAll('.action-card:not(.disabled)').forEach(card => {
    card.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('openRegisterModal'));
    });
  });

  container.querySelectorAll('.action-card.disabled').forEach(card => {
    card.addEventListener('click', () => {
      showSnackbar(i18n.t('common_coming_soon'), 'warning');
    });
  });

  container.appendChild(createBottomNav());
  return container;
}

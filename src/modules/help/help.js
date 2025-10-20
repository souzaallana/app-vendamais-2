import { i18n } from '../../services/i18n.js';
import { createBottomNav } from '../../utils/navbar.js';
import { icons, showSnackbar } from '../../utils/helpers.js';

export function createHelpScreen() {
  const container = document.createElement('div');
  container.className = 'help-screen';
  container.innerHTML = `
    <style>
      .help-screen {
        width: 100%;
        min-height: 100vh;
        padding-bottom: 80px;
        background: var(--bg-gray-50);
      }

      .help-header {
        background: var(--gradient-purple-blue);
        color: white;
        padding: var(--spacing-6);
        padding-top: calc(var(--spacing-6) + env(safe-area-inset-top));
      }

      .help-header h1 {
        color: white;
        font-size: 28px;
        margin-bottom: var(--spacing-4);
      }

      .help-search {
        position: relative;
      }

      .help-search input {
        width: 100%;
        padding: var(--spacing-3) var(--spacing-4) var(--spacing-3) 44px;
        border: none;
        border-radius: var(--border-radius);
        font-size: 16px;
      }

      .help-search svg {
        position: absolute;
        left: 12px;
        top: 50%;
        transform: translateY(-50%);
        width: 20px;
        height: 20px;
        color: var(--text-secondary);
      }

      .help-content {
        padding: var(--spacing-6);
      }

      .help-section {
        margin-bottom: var(--spacing-8);
      }

      .help-section-title {
        font-size: 18px;
        font-weight: 700;
        margin-bottom: var(--spacing-4);
      }

      .quick-help-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--spacing-3);
      }

      .quick-help-card {
        background: white;
        padding: var(--spacing-4);
        border-radius: var(--border-radius-lg);
        box-shadow: var(--shadow-md);
        text-align: center;
        cursor: pointer;
        transition: all 0.2s;
        opacity: 0.5;
      }

      .quick-help-card:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-lg);
      }

      .quick-help-icon {
        width: 48px;
        height: 48px;
        margin: 0 auto var(--spacing-2);
        color: var(--primary-purple);
      }

      .quick-help-icon svg {
        width: 100%;
        height: 100%;
      }

      .quick-help-title {
        font-size: 14px;
        font-weight: 600;
      }

      .faq-list {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-3);
      }

      .faq-item {
        background: white;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-sm);
        overflow: hidden;
      }

      .faq-question {
        padding: var(--spacing-4);
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        font-weight: 600;
        transition: background 0.2s;
      }

      .faq-question:hover {
        background: var(--bg-gray-50);
      }

      .faq-answer {
        padding: 0 var(--spacing-4) var(--spacing-4);
        color: var(--text-secondary);
        display: none;
      }

      .faq-item.open .faq-answer {
        display: block;
      }
    </style>

    <div class="help-header">
      <h1>${i18n.t('help_title')}</h1>
      <div class="help-search">
        ${icons.search}
        <input
          type="text"
          placeholder="${i18n.t('help_search')}"
          disabled
        />
      </div>
    </div>

    <div class="help-content">
      <section class="help-section">
        <h2 class="help-section-title">${i18n.t('help_quick_title')}</h2>
        <div class="quick-help-grid">
          <div class="quick-help-card">
            <div class="quick-help-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </div>
            <div class="quick-help-title">${i18n.t('help_whatsapp')}</div>
          </div>

          <div class="quick-help-card">
            <div class="quick-help-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
              </svg>
            </div>
            <div class="quick-help-title">${i18n.t('help_email')}</div>
          </div>

          <div class="quick-help-card">
            <div class="quick-help-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="23 7 16 12 23 17 23 7"></polygon>
                <rect width="15" height="14" x="1" y="5" rx="2" ry="2"></rect>
              </svg>
            </div>
            <div class="quick-help-title">${i18n.t('help_videos')}</div>
          </div>
        </div>
      </section>

      <section class="help-section">
        <h2 class="help-section-title">${i18n.t('help_faq_title')}</h2>
        <div class="faq-list">
          <div class="faq-item">
            <div class="faq-question">
              <span>Como cadastrar um produto?</span>
              ${icons.arrowRight}
            </div>
            <div class="faq-answer">
              Use o botão + na navegação inferior e escolha "Tirar Foto". Nossa IA irá analisar as imagens e criar automaticamente o cadastro.
            </div>
          </div>

          <div class="faq-item">
            <div class="faq-question">
              <span>Como conectar marketplaces?</span>
              ${icons.arrowRight}
            </div>
            <div class="faq-answer">
              Funcionalidade em desenvolvimento. Em breve você poderá conectar Mercado Livre, Shopee e outros marketplaces.
            </div>
          </div>

          <div class="faq-item">
            <div class="faq-question">
              <span>Quantas fotos posso adicionar?</span>
              ${icons.arrowRight}
            </div>
            <div class="faq-answer">
              Você pode adicionar até 3 fotos por produto para melhor visualização.
            </div>
          </div>
        </div>
      </section>
    </div>
  `;

  container.querySelectorAll('.quick-help-card').forEach(card => {
    card.addEventListener('click', () => {
      showSnackbar(i18n.t('common_coming_soon'), 'warning');
    });
  });

  container.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
      const item = question.parentElement;
      item.classList.toggle('open');
    });
  });

  container.appendChild(createBottomNav());
  return container;
}

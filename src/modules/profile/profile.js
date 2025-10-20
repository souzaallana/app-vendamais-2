import { i18n } from '../../services/i18n.js';
import { authService } from '../../services/supabase.js';
import { router } from '../../services/router.js';
import { createBottomNav } from '../../utils/navbar.js';
import { icons, showSnackbar } from '../../utils/helpers.js';

export async function createProfileScreen() {
  const user = await authService.getCurrentUser();
  const profile = user ? await authService.getProfile(user.id) : null;

  const container = document.createElement('div');
  container.className = 'profile-screen';
  container.innerHTML = `
    <style>
      .profile-screen {
        width: 100%;
        min-height: 100vh;
        padding-bottom: 80px;
        background: var(--bg-gray-50);
      }

      .profile-header {
        background: var(--gradient-purple-blue);
        color: white;
        padding: var(--spacing-8) var(--spacing-6);
        padding-top: calc(var(--spacing-8) + env(safe-area-inset-top));
        text-align: center;
      }

      .profile-avatar {
        width: 80px;
        height: 80px;
        background: white;
        color: var(--primary-purple);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto var(--spacing-4);
        font-size: 32px;
        font-weight: 700;
      }

      .profile-name {
        font-size: 24px;
        font-weight: 700;
        margin-bottom: var(--spacing-1);
      }

      .profile-email {
        font-size: 14px;
        opacity: 0.9;
      }

      .profile-content {
        padding: var(--spacing-6);
      }

      .profile-menu {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-2);
      }

      .profile-menu-item {
        background: white;
        padding: var(--spacing-4);
        border-radius: var(--border-radius);
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
        transition: all 0.2s;
        box-shadow: var(--shadow-sm);
      }

      .profile-menu-item:hover {
        transform: translateX(4px);
        box-shadow: var(--shadow-md);
      }

      .profile-menu-item.disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .profile-menu-item.disabled:hover {
        transform: none;
      }

      .profile-menu-left {
        display: flex;
        align-items: center;
        gap: var(--spacing-3);
      }

      .profile-menu-icon {
        width: 40px;
        height: 40px;
        background: var(--bg-gray-50);
        color: var(--primary-purple);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .profile-menu-icon svg {
        width: 20px;
        height: 20px;
      }

      .profile-menu-info {
        display: flex;
        flex-direction: column;
      }

      .profile-menu-title {
        font-weight: 600;
        margin-bottom: 2px;
      }

      .profile-menu-subtitle {
        font-size: 12px;
        color: var(--text-secondary);
      }

      .profile-menu-right svg {
        width: 20px;
        height: 20px;
        color: var(--text-secondary);
      }

      .profile-menu-item.danger {
        border: 2px solid #FEE2E2;
      }

      .profile-menu-item.danger .profile-menu-icon {
        background: #FEE2E2;
        color: #EF4444;
      }

      .profile-menu-item.danger .profile-menu-title {
        color: #EF4444;
      }
    </style>

    <div class="profile-header">
      <div class="profile-avatar">
        ${profile?.full_name?.charAt(0).toUpperCase() || 'L'}
      </div>
      <div class="profile-name">${profile?.full_name || 'Lili Cliente'}</div>
      <div class="profile-email">${profile?.email || 'demo@lojista.app'}</div>
    </div>

    <div class="profile-content">
      <div class="profile-menu">
        <div class="profile-menu-item disabled">
          <div class="profile-menu-left">
            <div class="profile-menu-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="8" cy="21" r="1"></circle>
                <circle cx="19" cy="21" r="1"></circle>
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
              </svg>
            </div>
            <div class="profile-menu-info">
              <div class="profile-menu-title">${i18n.t('profile_marketplaces')}</div>
              <div class="profile-menu-subtitle">${i18n.t('register_coming_soon')}</div>
            </div>
          </div>
          <div class="profile-menu-right">${icons.arrowRight}</div>
        </div>

        <div class="profile-menu-item disabled">
          <div class="profile-menu-left">
            <div class="profile-menu-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect width="20" height="14" x="2" y="5" rx="2"></rect>
                <line x1="2" x2="22" y1="10" y2="10"></line>
              </svg>
            </div>
            <div class="profile-menu-info">
              <div class="profile-menu-title">${i18n.t('profile_limit')}</div>
              <div class="profile-menu-subtitle">${i18n.t('register_coming_soon')}</div>
            </div>
          </div>
          <div class="profile-menu-right">${icons.arrowRight}</div>
        </div>

        <div class="profile-menu-item disabled">
          <div class="profile-menu-left">
            <div class="profile-menu-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" x2="8" y1="13" y2="13"></line>
                <line x1="16" x2="8" y1="17" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <div class="profile-menu-info">
              <div class="profile-menu-title">${i18n.t('profile_invoices')}</div>
              <div class="profile-menu-subtitle">${i18n.t('register_coming_soon')}</div>
            </div>
          </div>
          <div class="profile-menu-right">${icons.arrowRight}</div>
        </div>

        <div class="profile-menu-item disabled">
          <div class="profile-menu-left">
            <div class="profile-menu-icon">${icons.globe}</div>
            <div class="profile-menu-info">
              <div class="profile-menu-title">${i18n.t('profile_language')}</div>
              <div class="profile-menu-subtitle">${i18n.getLanguage().toUpperCase()}</div>
            </div>
          </div>
          <div class="profile-menu-right">${icons.arrowRight}</div>
        </div>

        <div class="profile-menu-item disabled">
          <div class="profile-menu-left">
            <div class="profile-menu-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" x2="12.01" y1="17" y2="17"></line>
              </svg>
            </div>
            <div class="profile-menu-info">
              <div class="profile-menu-title">${i18n.t('profile_tour')}</div>
              <div class="profile-menu-subtitle">${i18n.t('register_coming_soon')}</div>
            </div>
          </div>
          <div class="profile-menu-right">${icons.arrowRight}</div>
        </div>

        <div class="profile-menu-item disabled">
          <div class="profile-menu-left">
            <div class="profile-menu-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </div>
            <div class="profile-menu-info">
              <div class="profile-menu-title">${i18n.t('profile_settings')}</div>
              <div class="profile-menu-subtitle">${i18n.t('register_coming_soon')}</div>
            </div>
          </div>
          <div class="profile-menu-right">${icons.arrowRight}</div>
        </div>

        <div class="profile-menu-item danger" id="logoutBtn" style="margin-top: var(--spacing-6);">
          <div class="profile-menu-left">
            <div class="profile-menu-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" x2="9" y1="12" y2="12"></line>
              </svg>
            </div>
            <div class="profile-menu-info">
              <div class="profile-menu-title">${i18n.t('profile_logout')}</div>
            </div>
          </div>
          <div class="profile-menu-right">${icons.arrowRight}</div>
        </div>
      </div>
    </div>
  `;

  container.querySelectorAll('.profile-menu-item.disabled').forEach(item => {
    item.addEventListener('click', () => {
      showSnackbar(i18n.t('common_coming_soon'), 'warning');
    });
  });

  container.querySelector('#logoutBtn').addEventListener('click', async () => {
    try {
      await authService.signOut();
      showSnackbar('Logout realizado com sucesso', 'success');
      router.navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      showSnackbar(i18n.t('common_error'), 'error');
    }
  });

  container.appendChild(createBottomNav());
  return container;
}

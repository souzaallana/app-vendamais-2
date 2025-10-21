import { i18n } from '../../services/i18n.js';
import { router } from '../../services/router.js';

export function renderOnboardingScreen() {
  return `
    <div class="onboarding-container">
      <div class="onboarding-header">
        <button id="closeOnboarding" class="camera-button" style="background: rgba(255,255,255,0.2); width: 40px; height: 40px; font-size: 18px;">
          ✕
        </button>
        <h1 class="onboarding-title">${i18n.t('onboarding_title')}</h1>
      </div>

      <div class="onboarding-content">
        <p style="color: var(--text-secondary); margin-bottom: var(--spacing-6); font-size: 15px;">
          ${i18n.t('onboarding_subtitle')}
        </p>

        <div class="onboarding-section">
          <div class="onboarding-section-title">
            <div class="onboarding-icon success">✓</div>
            <span>${i18n.t('onboarding_what_works')}</span>
          </div>
          <div class="onboarding-examples">
            <div class="onboarding-example">
              <img src="https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=400" alt="Example 1">
            </div>
            <div class="onboarding-example">
              <img src="https://images.pexels.com/photos/16170/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400" alt="Example 2">
            </div>
            <div class="onboarding-example">
              <img src="https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=400" alt="Example 3">
            </div>
          </div>
          <p class="onboarding-description">
            ${i18n.t('onboarding_good_description')}
          </p>
        </div>

        <div class="onboarding-section">
          <div class="onboarding-section-title">
            <div class="onboarding-icon error">✕</div>
            <span>${i18n.t('onboarding_what_avoid')}</span>
          </div>
          <div class="onboarding-examples">
            <div class="onboarding-example">
              <img src="https://images.pexels.com/photos/3965545/pexels-photo-3965545.jpeg?auto=compress&cs=tinysrgb&w=400" alt="Avoid 1">
            </div>
            <div class="onboarding-example">
              <img src="https://images.pexels.com/photos/5698851/pexels-photo-5698851.jpeg?auto=compress&cs=tinysrgb&w=400" alt="Avoid 2">
            </div>
            <div class="onboarding-example">
              <img src="https://images.pexels.com/photos/4210830/pexels-photo-4210830.jpeg?auto=compress&cs=tinysrgb&w=400" alt="Avoid 3">
            </div>
          </div>
          <p class="onboarding-description">
            ${i18n.t('onboarding_bad_description')}
          </p>
        </div>

        <div style="height: 20px;"></div>
      </div>

      <div class="onboarding-footer">
        <button id="startPhotoCapture" class="btn btn-primary btn-lg" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;">
          <span style="font-size: 20px;">📸</span>
          ${i18n.t('onboarding_start_button')}
        </button>
      </div>
    </div>
  `;
}

export function setupOnboardingListeners() {
  console.log('Setting up onboarding listeners');

  setTimeout(() => {
    const closeBtn = document.getElementById('closeOnboarding');
    const startBtn = document.getElementById('startPhotoCapture');

    console.log('Close button:', closeBtn);
    console.log('Start button:', startBtn);

    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        console.log('Close button clicked');
        e.preventDefault();
        e.stopPropagation();
        router.navigate('/products');
      });
    }

    if (startBtn) {
      startBtn.addEventListener('click', (e) => {
        console.log('Start button clicked, navigating to /products/capture');
        e.preventDefault();
        e.stopPropagation();
        router.navigate('/products/capture');
      });
    } else {
      console.error('Start button not found!');
    }
  }, 100);
}

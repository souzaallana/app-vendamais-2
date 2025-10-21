import { icons } from '../../utils/helpers.js';

export function createOnboardingScreen(onComplete) {
  const container = document.createElement('div');
  container.className = 'onboarding-screen';
  container.innerHTML = `
    <style>
      .onboarding-screen {
        width: 100%;
        height: 100vh;
        display: flex;
        flex-direction: column;
        background: white;
        padding: var(--spacing-4) var(--spacing-6);
        overflow: hidden;
      }

      .onboarding-skip {
        align-self: flex-end;
        color: var(--text-secondary);
        font-size: 16px;
        background: none;
        border: none;
        cursor: pointer;
        padding: var(--spacing-2);
      }

      .onboarding-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: var(--spacing-2) 0;
        overflow-y: auto;
      }

      .onboarding-video {
        width: 100%;
        max-width: 400px;
        aspect-ratio: 16/9;
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        border-radius: var(--border-radius-xl);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: var(--spacing-4);
        box-shadow: 0 20px 40px rgba(0,0,0,0.1);
      }

      .onboarding-video-icon {
        width: 60px;
        height: 60px;
        color: rgba(255,255,255,0.5);
      }

      .onboarding-title {
        font-size: 26px;
        font-weight: 700;
        color: var(--text-primary);
        margin-bottom: var(--spacing-3);
        line-height: 1.2;
      }

      .onboarding-features {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-3);
        margin: var(--spacing-4) 0;
        text-align: left;
        width: 100%;
        max-width: 400px;
      }

      .onboarding-feature {
        display: flex;
        align-items: center;
        gap: var(--spacing-3);
        font-size: 16px;
        color: var(--text-secondary);
      }

      .onboarding-feature-icon {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #2563EB 0%, #A9208D 100%);
        border-radius: 12px;
        flex-shrink: 0;
      }

      .onboarding-feature-icon svg {
        width: 20px;
        height: 20px;
        color: white;
      }

      .onboarding-actions {
        width: 100%;
        max-width: 400px;
        padding: var(--spacing-3) 0 var(--spacing-2) 0;
      }

      .onboarding-cta {
        width: 100%;
        padding: var(--spacing-4);
        background: linear-gradient(135deg, #2563EB 0%, #A9208D 100%);
        color: white;
        border: none;
        border-radius: var(--border-radius-lg);
        font-size: 18px;
        font-weight: 600;
        cursor: pointer;
        transition: transform 0.2s;
      }

      .onboarding-cta:hover {
        transform: translateY(-2px);
      }

      .onboarding-cta:active {
        transform: translateY(0);
      }
    </style>

    <button class="onboarding-skip" id="skipBtn">Pular</button>

    <div class="onboarding-content">
      <div class="onboarding-video">
        <div class="onboarding-video-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="2" width="20" height="20" rx="2" ry="2"/>
            <polygon points="10 8 16 12 10 16 10 8" fill="currentColor"/>
          </svg>
        </div>
      </div>

      <h1 class="onboarding-title">Cadastro de produtos em<br>segundos</h1>

      <div class="onboarding-features">
        <div class="onboarding-feature">
          <div class="onboarding-feature-icon">
            ${icons.camera}
          </div>
          <div>Tire foto, fale ou descreva</div>
        </div>

        <div class="onboarding-feature">
          <div class="onboarding-feature-icon">
            ${icons.sparkles}
          </div>
          <div>Deixe a IA fazer o resto</div>
        </div>

        <div class="onboarding-feature">
          <div class="onboarding-feature-icon">
            ${icons.share}
          </div>
          <div>Compartilhe em redes sociais e nos maiores marketplaces</div>
        </div>
      </div>
    </div>

    <div class="onboarding-actions">
      <button class="onboarding-cta" id="startBtn">Iniciar Jornada</button>
    </div>
  `;

  const skipBtn = container.querySelector('#skipBtn');
  const startBtn = container.querySelector('#startBtn');

  skipBtn.addEventListener('click', onComplete);
  startBtn.addEventListener('click', onComplete);

  return container;
}

import { i18n } from '../../services/i18n.js';
import { authService } from '../../services/supabase.js';
import { router } from '../../services/router.js';
import { showSnackbar, validateEmail, validatePassword } from '../../utils/helpers.js';

export async function createLoginScreen() {
  return createActualLoginScreen();
}

function createActualLoginScreen() {
  const container = document.createElement('div');
  container.className = 'login-screen';
  container.innerHTML = `
    <style>
      .login-screen {
        width: 100%;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
      }

      .login-header {
        background: var(--gradient-purple-blue);
        color: white;
        padding: var(--spacing-12) var(--spacing-6) var(--spacing-8);
        text-align: center;
        border-radius: 0 0 32px 32px;
      }

      .login-header h1 {
        color: white;
        font-size: 32px;
        font-weight: 900;
        margin-bottom: var(--spacing-2);
      }

      .login-header p {
        color: rgba(255, 255, 255, 0.9);
        font-size: 16px;
        font-weight: 300;
      }

      .login-content {
        flex: 1;
        padding: var(--spacing-8) var(--spacing-6);
        display: flex;
        flex-direction: column;
        gap: var(--spacing-6);
      }

      .login-demo-info {
        background: #EFF6FF;
        border: 2px solid #DBEAFE;
        border-radius: var(--border-radius);
        padding: var(--spacing-4);
        text-align: center;
        color: #1E40AF;
        font-size: 14px;
      }

      .login-demo-info strong {
        display: block;
        margin-bottom: var(--spacing-2);
      }

      .login-form {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-5);
      }

      .login-actions {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-4);
        margin-top: var(--spacing-4);
      }

      .login-forgot {
        text-align: center;
        font-size: 14px;
        color: var(--primary-purple);
        margin-top: var(--spacing-2);
        opacity: 0.5;
        cursor: not-allowed;
      }
    </style>

    <div class="login-header">
      <h1>${i18n.t('login_title')}</h1>
      <p>${i18n.t('login_subtitle')}</p>
    </div>

    <div class="login-content">
      <div class="login-demo-info">
        <strong>Demo Account</strong>
        <div>Email: demo@lojista.app</div>
        <div>Password: demo123</div>
      </div>

      <form class="login-form" id="loginForm">
        <div class="input-group">
          <label class="input-label" for="email">${i18n.t('login_email')}</label>
          <input
            type="email"
            id="email"
            class="input-field"
            placeholder="seu@email.com"
            value="demo@lojista.app"
            required
          />
          <span class="error-message" id="emailError"></span>
        </div>

        <div class="input-group">
          <label class="input-label" for="password">${i18n.t('login_password')}</label>
          <input
            type="password"
            id="password"
            class="input-field"
            placeholder="••••••"
            value="demo123"
            required
          />
          <span class="error-message" id="passwordError"></span>
        </div>

        <div class="login-actions">
          <button type="submit" class="btn btn-primary btn-lg">
            ${i18n.t('login_button')}
          </button>
          <div class="login-forgot">${i18n.t('login_forgot')}</div>
        </div>
      </form>
    </div>
  `;

  const form = container.querySelector('#loginForm');
  const emailInput = container.querySelector('#email');
  const passwordInput = container.querySelector('#password');
  const emailError = container.querySelector('#emailError');
  const passwordError = container.querySelector('#passwordError');
  const submitButton = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    emailError.textContent = '';
    passwordError.textContent = '';
    emailInput.classList.remove('input-error');
    passwordInput.classList.remove('input-error');

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    let hasError = false;

    if (!validateEmail(email)) {
      emailError.textContent = 'Email inválido';
      emailInput.classList.add('input-error');
      hasError = true;
    }

    if (!validatePassword(password)) {
      passwordError.textContent = 'Senha deve ter no mínimo 6 caracteres';
      passwordInput.classList.add('input-error');
      hasError = true;
    }

    if (hasError) return;

    submitButton.disabled = true;
    submitButton.textContent = i18n.t('common_loading');

    console.log('Attempting login with:', email);

    try {
      let result;

      try {
        console.log('Trying signIn...');
        result = await authService.signIn(email, password);
        console.log('SignIn successful:', result);
      } catch (signInError) {
        console.log('SignIn failed, trying signUp...', signInError.message);
        result = await authService.signUp(email, password, 'Lili Cliente');
        console.log('SignUp result:', result);
      }

      if (result && (result.user || result.session)) {
        console.log('Authentication successful, navigating to home');
        showSnackbar(i18n.t('common_success'), 'success');
        setTimeout(() => {
          router.navigate('/home');
        }, 500);
      } else {
        console.error('No user or session in result:', result);
        throw new Error('Authentication failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      showSnackbar(error.message || i18n.t('login_error'), 'error');
      submitButton.disabled = false;
      submitButton.textContent = i18n.t('login_button');
    }
  });

  return container;
}

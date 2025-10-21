import './style.css';
import { router } from './services/router.js';
import { authService } from './services/supabase.js';
import { i18n } from './services/i18n.js';
import { createSplashScreen, hideSplashScreen } from './modules/auth/splash.js';
import { createLoginScreen } from './modules/auth/login.js';
import { createHomeScreen } from './modules/home/home.js';
import { createProductsListScreen } from './modules/products/products-list.js';
import { createHelpScreen } from './modules/help/help.js';
import { createProfileScreen } from './modules/profile/profile.js';
import './modules/registration/registration-flow.js';
import { updateNavbarLanguage } from './utils/navbar.js';
import { renderOnboardingScreen, setupOnboardingListeners } from './modules/products/onboarding.js';
import { renderPhotoCapture, setupPhotoCaptureListeners } from './modules/products/photo-capture.js';
import { renderProcessingScreen, startProcessing } from './modules/products/processing.js';
import { renderImageSelection, setupImageSelectionListeners } from './modules/products/image-selection.js';
import { renderImageEdit, setupImageEditListeners } from './modules/products/image-edit.js';
import { renderReview, setupReviewListeners } from './modules/products/review.js';
import { renderSuccess, setupSuccessListeners } from './modules/products/success.js';

async function init() {
  const app = document.getElementById('app');

  app.innerHTML = '';
  app.appendChild(createSplashScreen());

  authService.onAuthStateChange((event, session) => {
    console.log('Auth state changed:', event, session?.user?.email);
  });

  router.use(async (path) => {
    const publicRoutes = ['/login', '/'];

    if (!publicRoutes.includes(path)) {
      try {
        const user = await authService.getCurrentUser();
        if (!user) {
          console.log('No user found, redirecting to login');
          router.navigate('/login');
          return false;
        }
      } catch (error) {
        console.error('Auth error:', error);
        router.navigate('/login');
        return false;
      }
    }

    return true;
  });

  router.register('/', createLoginScreen);
  router.register('/login', createLoginScreen);
  router.register('/home', createHomeScreen);
  router.register('/products', createProductsListScreen);
  router.register('/help', createHelpScreen);
  router.register('/profile', createProfileScreen);

  router.register('/products/onboarding', async () => {
    const html = renderOnboardingScreen();
    setTimeout(() => setupOnboardingListeners(), 0);
    return html;
  });

  router.register('/products/capture', async () => {
    const html = renderPhotoCapture();
    setTimeout(() => setupPhotoCaptureListeners(), 0);
    return html;
  });

  router.register('/products/processing', async () => {
    const html = renderProcessingScreen();
    setTimeout(() => startProcessing(), 0);
    return html;
  });

  router.register('/products/image-selection', async () => {
    const html = renderImageSelection();
    setTimeout(() => setupImageSelectionListeners(), 0);
    return html;
  });

  router.register('/products/image-edit', async () => {
    const html = renderImageEdit();
    setTimeout(() => setupImageEditListeners(), 0);
    return html;
  });

  router.register('/products/review', async () => {
    const html = renderReview();
    setTimeout(() => setupReviewListeners(), 0);
    return html;
  });

  router.register('/products/success', async () => {
    const html = renderSuccess();
    setTimeout(() => setupSuccessListeners(), 0);
    return html;
  });

  window.addEventListener('languageChange', () => {
    updateNavbarLanguage();
    const currentRoute = router.getCurrentRoute();
    if (currentRoute) {
      router.navigate(currentRoute);
    }
  });

  try {
    const user = await authService.getCurrentUser();

    setTimeout(() => {
      if (user) {
        router.navigate('/home');
      } else {
        router.navigate('/login');
      }
    }, 1500);
  } catch (error) {
    setTimeout(() => {
      router.navigate('/login');
    }, 1500);
  }
}

init();

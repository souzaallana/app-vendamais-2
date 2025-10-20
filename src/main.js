import './style.css';
import { router } from './services/router.js';
import { authService } from './services/supabase.js';
import { i18n } from './services/i18n.js';
import { createSplashScreen } from './modules/auth/splash.js';
import { createLoginScreen } from './modules/auth/login.js';
import { createHomeScreen } from './modules/home/home.js';
import { createProductsListScreen } from './modules/products/products-list.js';
import { createHelpScreen } from './modules/help/help.js';
import { createProfileScreen } from './modules/profile/profile.js';
import './modules/registration/registration-flow.js';
import { updateNavbarLanguage } from './utils/navbar.js';

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

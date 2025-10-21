class Router {
  constructor() {
    this.routes = new Map();
    this.currentRoute = null;
    this.middlewares = [];
    this.params = {};
  }

  register(path, component) {
    this.routes.set(path, component);
  }

  use(middleware) {
    this.middlewares.push(middleware);
  }

  async navigate(path, params = {}) {
    this.params = params;

    for (const middleware of this.middlewares) {
      const result = await middleware(path);
      if (result === false) {
        return;
      }
    }

    const component = this.routes.get(path);
    if (!component) {
      console.error(`Route not found: ${path}`);
      return;
    }

    this.currentRoute = path;
    window.history.pushState({ path, params }, '', path);

    const appElement = document.getElementById('app');
    if (appElement) {
      appElement.innerHTML = '';
      const view = await component(params);
      if (view instanceof HTMLElement) {
        appElement.appendChild(view);
      } else if (typeof view === 'string') {
        appElement.innerHTML = view;
      }
    }
  }

  back() {
    window.history.back();
  }

  getCurrentRoute() {
    return this.currentRoute;
  }

  getParams() {
    return this.params;
  }
}

export const router = new Router();

export function navigateTo(path, params = {}) {
  return router.navigate(path, params);
}

window.addEventListener('popstate', (event) => {
  if (event.state && event.state.path) {
    router.navigate(event.state.path, event.state.params || {});
  }
});

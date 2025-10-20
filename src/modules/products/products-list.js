import { i18n } from '../../services/i18n.js';
import { productsService } from '../../services/supabase.js';
import { createBottomNav } from '../../utils/navbar.js';
import { icons, debounce, formatCurrency } from '../../utils/helpers.js';

export async function createProductsListScreen() {
  let products = [];
  let currentFilter = 'all';
  let searchQuery = '';

  const container = document.createElement('div');
  container.className = 'products-screen';
  container.innerHTML = `
    <style>
      .products-screen {
        width: 100%;
        min-height: 100vh;
        padding-bottom: 80px;
        background: var(--bg-gray-50);
      }

      .products-header {
        background: white;
        padding: var(--spacing-6);
        padding-top: calc(var(--spacing-6) + env(safe-area-inset-top));
        box-shadow: var(--shadow-sm);
        position: sticky;
        top: 0;
        z-index: 100;
      }

      .products-header h1 {
        font-size: 28px;
        margin-bottom: var(--spacing-4);
      }

      .search-box {
        position: relative;
        margin-bottom: var(--spacing-4);
      }

      .search-box input {
        width: 100%;
        padding: var(--spacing-3) var(--spacing-4) var(--spacing-3) 44px;
        border: 2px solid var(--border-gray);
        border-radius: var(--border-radius);
        font-size: 16px;
      }

      .search-box svg {
        position: absolute;
        left: 12px;
        top: 50%;
        transform: translateY(-50%);
        width: 20px;
        height: 20px;
        color: var(--text-secondary);
      }

      .filter-tabs {
        display: flex;
        gap: var(--spacing-2);
        overflow-x: auto;
        padding-bottom: var(--spacing-2);
      }

      .filter-tabs::-webkit-scrollbar {
        display: none;
      }

      .filter-tab {
        padding: var(--spacing-2) var(--spacing-4);
        background: var(--bg-gray-100);
        border: 2px solid transparent;
        border-radius: 20px;
        font-size: 14px;
        font-weight: 500;
        color: var(--text-secondary);
        cursor: pointer;
        white-space: nowrap;
        transition: all 0.2s;
      }

      .filter-tab.active {
        background: var(--primary-purple);
        color: white;
      }

      .products-content {
        padding: var(--spacing-4);
      }

      .products-grid {
        display: grid;
        gap: var(--spacing-4);
      }

      .product-card {
        background: white;
        border-radius: var(--border-radius-lg);
        overflow: hidden;
        box-shadow: var(--shadow-md);
        transition: all 0.2s;
      }

      .product-card:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-lg);
      }

      .product-image {
        width: 100%;
        height: 200px;
        background: var(--bg-gray-100);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text-secondary);
        position: relative;
        overflow: hidden;
      }

      .product-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .product-badge {
        position: absolute;
        top: var(--spacing-2);
        right: var(--spacing-2);
        padding: 4px 8px;
        background: var(--primary-purple);
        color: white;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
      }

      .product-info {
        padding: var(--spacing-4);
      }

      .product-title {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: var(--spacing-2);
        color: var(--text-primary);
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .product-description {
        font-size: 14px;
        color: var(--text-secondary);
        margin-bottom: var(--spacing-3);
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .product-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .product-price {
        font-size: 20px;
        font-weight: 700;
        color: var(--primary-purple);
      }

      .product-marketplace {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 12px;
        color: var(--text-secondary);
      }

      .empty-state {
        text-align: center;
        padding: var(--spacing-12) var(--spacing-6);
      }

      .empty-icon {
        width: 80px;
        height: 80px;
        margin: 0 auto var(--spacing-4);
        color: var(--text-secondary);
        opacity: 0.3;
      }

      .empty-icon svg {
        width: 100%;
        height: 100%;
      }

      .empty-title {
        font-size: 20px;
        font-weight: 600;
        margin-bottom: var(--spacing-2);
      }

      .empty-description {
        color: var(--text-secondary);
        margin-bottom: var(--spacing-6);
      }
    </style>

    <div class="products-header">
      <h1>${i18n.t('products_title')}</h1>

      <div class="search-box">
        ${icons.search}
        <input
          type="text"
          id="searchInput"
          placeholder="${i18n.t('products_search')}"
        />
      </div>

      <div class="filter-tabs">
        <button class="filter-tab active" data-filter="all">${i18n.t('products_all')}</button>
        <button class="filter-tab" data-filter="ml">${i18n.t('products_ml')}</button>
        <button class="filter-tab" data-filter="shopee">${i18n.t('products_shopee')}</button>
        <button class="filter-tab" data-filter="paused">${i18n.t('products_paused')}</button>
      </div>
    </div>

    <div class="products-content">
      <div class="products-grid" id="productsGrid"></div>
    </div>
  `;

  const grid = container.querySelector('#productsGrid');
  const searchInput = container.querySelector('#searchInput');
  const filterTabs = container.querySelectorAll('.filter-tab');

  async function loadProducts() {
    try {
      const filters = {};

      if (currentFilter !== 'all') {
        if (currentFilter === 'paused') {
          filters.status = 'paused';
        } else {
          filters.marketplace = currentFilter;
        }
      }

      if (searchQuery) {
        filters.search = searchQuery;
      }

      products = await productsService.getProducts(filters);
      renderProducts();
    } catch (error) {
      console.error('Error loading products:', error);
      renderEmpty();
    }
  }

  function renderProducts() {
    if (products.length === 0) {
      renderEmpty();
      return;
    }

    grid.innerHTML = products.map(product => {
      const firstImage = product.product_images?.[0]?.image_url;
      const price = product.price ? formatCurrency(product.price) : '-';
      const marketplaceLabel = product.marketplace === 'ml' ? 'ML' : product.marketplace?.toUpperCase() || '';

      return `
        <div class="product-card">
          <div class="product-image">
            ${firstImage ? `<img src="${firstImage}" alt="${product.title}">` : icons.image}
            ${product.is_ai_generated ? '<div class="product-badge">IA</div>' : ''}
          </div>
          <div class="product-info">
            <h3 class="product-title">${product.title}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-footer">
              <div class="product-price">${price}</div>
              ${marketplaceLabel ? `<div class="product-marketplace">${marketplaceLabel}</div>` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderEmpty() {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">${icons.package}</div>
        <h2 class="empty-title">${i18n.t('products_empty')}</h2>
        <p class="empty-description">${i18n.t('products_add_first')}</p>
        <button class="btn btn-primary" onclick="window.dispatchEvent(new CustomEvent('openRegisterModal'))">
          ${icons.camera}
          ${i18n.t('register_photo')}
        </button>
      </div>
    `;
  }

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentFilter = tab.dataset.filter;
      loadProducts();
    });
  });

  searchInput.addEventListener('input', debounce((e) => {
    searchQuery = e.target.value.trim();
    loadProducts();
  }, 500));

  await loadProducts();
  container.appendChild(createBottomNav());
  return container;
}

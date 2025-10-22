import { i18n } from '../../services/i18n.js';
import { navigateTo } from '../../services/router.js';
import { getSelectionState } from './image-selection.js';
import { supabase } from '../../services/supabase.js';

export function renderReview() {
  const selectionState = getSelectionState();
  const data = selectionState.extractedData || {};
  const mainImage = Object.values(selectionState.selectedImages).flat()[0];

  return `
    <div class="photo-capture-container">
      <div class="app-header-curved">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <button id="backFromReview" class="camera-button" style="background: rgba(255,255,255,0.2); width: 40px; height: 40px; font-size: 18px;">
            ←
          </button>
          <h2 class="app-header-title">${i18n.t('review_title')}</h2>
          <button id="closeReview" class="camera-button" style="background: rgba(255,255,255,0.2); width: 40px; height: 40px; font-size: 18px;">
            ✕
          </button>
        </div>
      </div>

      <div style="flex: 1; overflow-y: auto; padding: var(--spacing-4);">
        <div style="background: var(--bg-gray-50); border-radius: var(--border-radius-lg); padding: var(--spacing-6); margin-bottom: var(--spacing-4); text-align: center; color: var(--text-secondary);">
          ${i18n.t('review_main_photo')}
          <div style="margin-top: var(--spacing-3); display: flex; gap: var(--spacing-2); overflow-x: auto;">
            ${Object.values(selectionState.selectedImages).flat().slice(0, 4).map(url => `
              <img src="${url}" style="width: 80px; height: 80px; object-fit: cover; border-radius: var(--border-radius); flex-shrink: 0;">
            `).join('')}
          </div>
        </div>

        <div style="margin-bottom: var(--spacing-6);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--spacing-3);">
            <h3 style="font-size: 16px; font-weight: 600; margin: 0;">
              ${i18n.t('review_ai_title')}
            </h3>
            <button id="editTitle" class="btn btn-sm" style="background: rgba(169, 32, 141, 0.1); color: var(--primary-purple); padding: 4px 12px;">
              <span style="font-size: 14px;">✏️</span> ${i18n.t('review_edit')}
            </button>
          </div>
          <p id="productTitle" style="font-size: 15px; line-height: 1.5; color: var(--text-primary);">
            ${data.title || i18n.t('review_no_title')}
          </p>
        </div>

        <div style="margin-bottom: var(--spacing-6);">
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: var(--spacing-3);">
            ${i18n.t('review_ai_description')}
          </h3>
          <p id="productDescription" style="font-size: 14px; line-height: 1.6; color: var(--text-secondary);">
            ${data.description || i18n.t('review_no_description')}
          </p>
          <a href="#" id="viewFullDescription" style="color: var(--primary-purple); font-size: 14px; margin-top: var(--spacing-2); display: inline-block;">
            ${i18n.t('review_view_full')} / ${i18n.t('review_edit')}
          </a>
        </div>

        <div style="background: var(--bg-gray-50); border-radius: var(--border-radius-lg); padding: var(--spacing-4); margin-bottom: var(--spacing-6);">
          <div style="margin-bottom: var(--spacing-3);">
            <span style="font-weight: 600; color: var(--text-primary);">${i18n.t('review_category')}:</span>
            <span style="color: var(--text-secondary); margin-left: 8px;">${data.category || '-'}</span>
          </div>
          <div style="margin-bottom: var(--spacing-3);">
            <span style="font-weight: 600; color: var(--text-primary);">${i18n.t('review_colors')}:</span>
            <span style="color: var(--text-secondary); margin-left: 8px;">
              ${data.colors?.join(', ') || '-'}
            </span>
          </div>
          <div>
            <span style="font-weight: 600; color: var(--text-primary);">${i18n.t('review_material')}:</span>
            <span style="color: var(--text-secondary); margin-left: 8px;">${data.material || '-'}</span>
          </div>
        </div>

        <div style="margin-top: var(--spacing-6);">
          <button id="finishRegistration" class="btn btn-primary btn-lg" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;">
            <span style="font-size: 20px;">✅</span>
            ${i18n.t('review_finish')}
          </button>
        </div>

        <div style="height: 20px;"></div>
      </div>
    </div>
  `;
}

export function setupReviewListeners() {
  console.log('Setting up review listeners');

  const app = document.getElementById('app');

  if (!app) {
    console.error('App element not found');
    return;
  }

  const handleClick = async (e) => {
    if (e.target.closest('#backFromReview')) {
      console.log('Back button clicked');
      e.preventDefault();
      navigateTo('/products/image-selection');
      return;
    }

    if (e.target.closest('#closeReview')) {
      console.log('Close button clicked');
      e.preventDefault();
      if (confirm(i18n.t('review_confirm_cancel') || 'Descartar cadastro?')) {
        navigateTo('/products');
      }
      return;
    }

    if (e.target.closest('#editTitle')) {
      console.log('Edit title clicked');
      e.preventDefault();
      const titleEl = document.getElementById('productTitle');
      const currentTitle = titleEl.textContent;
      const newTitle = prompt(i18n.t('review_edit_title_prompt') || 'Editar título:', currentTitle);
      if (newTitle && newTitle.trim()) {
        titleEl.textContent = newTitle.trim();
      }
      return;
    }

    if (e.target.closest('#viewFullDescription')) {
      console.log('Edit description clicked');
      e.preventDefault();
      const descEl = document.getElementById('productDescription');
      const currentDesc = descEl.textContent;
      const newDesc = prompt(i18n.t('review_edit_desc_prompt') || 'Editar descrição:', currentDesc);
      if (newDesc && newDesc.trim()) {
        descEl.textContent = newDesc.trim();
      }
      return;
    }

    if (e.target.closest('#finishRegistration')) {
      console.log('Finish registration clicked');
      e.preventDefault();
      const finishBtn = document.getElementById('finishRegistration');
      finishBtn.disabled = true;
      finishBtn.innerHTML = '<span class="loading-spinner" style="width: 20px; height: 20px; border-width: 2px;"></span>';

      try {
        const selectionState = getSelectionState();
        const titleEl = document.getElementById('productTitle');
        const descEl = document.getElementById('productDescription');

        const productData = {
          title: titleEl.textContent,
          description: descEl.textContent,
          ai_generated_title: selectionState.extractedData?.title,
          ai_generated_description: selectionState.extractedData?.description,
          ai_suggested_category: selectionState.extractedData?.category,
          ai_suggested_colors: selectionState.extractedData?.colors,
          ai_suggested_material: selectionState.extractedData?.material,
          used_ai_processing: true,
          status: 'draft',
          user_id: (await supabase.auth.getUser()).data.user.id
        };

        const { data: product, error } = await supabase
          .from('products')
          .insert([productData])
          .select()
          .maybeSingle();

        if (error) throw error;

        const allImages = Object.values(selectionState.selectedImages).flat();
        const photoInserts = allImages.map((url, index) => ({
          product_id: product.id,
          photo_url: url,
          photo_type: index === 0 ? 'frente' : 'outros',
          is_original: false,
          order: index
        }));

        await supabase.from('product_photos').insert(photoInserts);

        navigateTo('/products/success');

      } catch (error) {
        console.error('Error saving product:', error);
        alert(i18n.t('review_save_error') || 'Erro ao salvar produto');
        finishBtn.disabled = false;
        finishBtn.innerHTML = `<span style="font-size: 20px;">✅</span> ${i18n.t('review_finish')}`;
      }
      return;
    }
  };

  app.addEventListener('click', handleClick);
  console.log('Review listeners set up');
}

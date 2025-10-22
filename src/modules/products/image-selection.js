import { i18n } from '../../services/i18n.js';
import { navigateTo } from '../../services/router.js';
import { getProcessingState } from './processing.js';
import { getPhotoState } from './photo-capture.js';

const selectionState = {
  selectedImages: {
    background_removed: [],
    mannequin: [],
    details: []
  },
  extractedData: null
};

export function getSelectionState() {
  return selectionState;
}

export function renderImageSelection() {
  const processingState = getProcessingState();
  const photoState = getPhotoState();

  const backgroundResults = processingState.results?.results?.find(r => r.type === 'background_removed');
  const mannequinResults = processingState.results?.results?.find(r => r.type === 'mannequin');
  const extractedData = processingState.results?.results?.find(r => r.type === 'extracted_data')?.data;

  selectionState.extractedData = extractedData;

  const backgroundImages = backgroundResults?.urls || photoState.photos.slice(0, 3).map(p => p.url);
  const mannequinImages = mannequinResults?.urls || photoState.photos.slice(0, 3).map(p => p.url);
  const detailImages = photoState.photos.filter(p => p.type === 'detalhe').map(p => p.url);

  if (selectionState.selectedImages.background_removed.length === 0 && backgroundImages.length > 0) {
    selectionState.selectedImages.background_removed = [backgroundImages[0]];
  }

  return `
    <div class="photo-capture-container">
      <div class="app-header-curved">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <button id="backFromSelection" class="camera-button" style="background: rgba(255,255,255,0.2); width: 40px; height: 40px; font-size: 18px;">
            ←
          </button>
          <h2 class="app-header-title">${i18n.t('selection_title')}</h2>
          <button id="closeSelection" class="camera-button" style="background: rgba(255,255,255,0.2); width: 40px; height: 40px; font-size: 18px;">
            ✕
          </button>
        </div>
      </div>

      <div style="flex: 1; overflow-y: auto;">
        <div style="padding: var(--spacing-4); background: var(--bg-gray-50); border-bottom: 1px solid var(--border-gray);">
          <p style="color: var(--text-secondary); font-size: 14px;">
            ${i18n.t('selection_instruction')}
          </p>
        </div>

        <div class="image-selection-container">
          ${renderImageSection('background_removed', i18n.t('selection_background'), backgroundImages)}
          ${renderImageSection('mannequin', i18n.t('selection_mannequin'), mannequinImages)}
          ${detailImages.length > 0 ? renderImageSection('details', i18n.t('selection_details'), detailImages) : ''}
        </div>

        <div style="padding: var(--spacing-4); display: flex; flex-direction: column; gap: var(--spacing-3);">
          <button id="proceedWithSelection" class="btn btn-primary btn-lg" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;">
            <span style="font-size: 20px;">✨</span>
            ${i18n.t('selection_proceed')}
          </button>
          <button id="needAdjustment" class="btn btn-outline btn-lg" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;">
            <span style="font-size: 20px;">✏️</span>
            ${i18n.t('selection_adjust')}
          </button>
        </div>

        <div style="height: 20px;"></div>
      </div>
    </div>
  `;
}

function renderImageSection(type, title, images) {
  return `
    <div class="image-selection-section">
      <h3 class="image-selection-title">${title}</h3>
      <div class="image-selection-grid">
        ${images.map((url, index) => {
          const isSelected = selectionState.selectedImages[type]?.includes(url);
          return `
            <div class="image-selection-item ${isSelected ? 'selected' : ''}" data-type="${type}" data-url="${url}">
              <img src="${url}" alt="${title} ${index + 1}">
              <div class="image-selection-checkbox">${isSelected ? '✓' : ''}</div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

export function setupImageSelectionListeners() {
  console.log('Setting up image selection listeners');

  const app = document.getElementById('app');

  if (!app) {
    console.error('App element not found');
    return;
  }

  const handleClick = (e) => {
    if (e.target.closest('#backFromSelection')) {
      console.log('Back button clicked');
      e.preventDefault();
      navigateTo('/products/capture');
      return;
    }

    if (e.target.closest('#closeSelection')) {
      console.log('Close button clicked');
      e.preventDefault();
      navigateTo('/products');
      return;
    }

    if (e.target.closest('#proceedWithSelection')) {
      console.log('Proceed button clicked');
      e.preventDefault();
      const hasSelection = Object.values(selectionState.selectedImages).some(arr => arr.length > 0);
      if (hasSelection) {
        navigateTo('/products/review');
      } else {
        alert(i18n.t('selection_no_images') || 'Selecione ao menos uma imagem');
      }
      return;
    }

    if (e.target.closest('#needAdjustment')) {
      console.log('Adjust button clicked');
      e.preventDefault();
      navigateTo('/products/image-edit');
      return;
    }

    const imageItem = e.target.closest('.image-selection-item');
    if (imageItem) {
      console.log('Image item clicked');
      e.preventDefault();
      const type = imageItem.dataset.type;
      const url = imageItem.dataset.url;

      if (!selectionState.selectedImages[type]) {
        selectionState.selectedImages[type] = [];
      }

      const index = selectionState.selectedImages[type].indexOf(url);
      if (index >= 0) {
        selectionState.selectedImages[type].splice(index, 1);
      } else {
        selectionState.selectedImages[type].push(url);
      }

      navigateTo('/products/image-selection');
      return;
    }
  };

  app.addEventListener('click', handleClick);
  console.log('Image selection listeners set up');
}

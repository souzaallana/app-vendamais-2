import { i18n } from '../../services/i18n.js';
import { navigateTo } from '../../services/router.js';

const photoState = {
  photos: [],
  maxPhotos: 8,
  mannequinDescription: ''
};

export function getPhotoState() {
  return photoState;
}

export function renderPhotoCapture() {
  return `
    <div class="photo-capture-container">
      <div class="app-header-curved">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <button id="backFromCapture" class="camera-button" style="background: rgba(255,255,255,0.2); width: 40px; height: 40px; font-size: 18px;">
            ←
          </button>
          <h2 class="app-header-title">${i18n.t('photo_capture_title')} (${photoState.photos.length})</h2>
          <button id="closeCapture" class="camera-button" style="background: rgba(255,255,255,0.2); width: 40px; height: 40px; font-size: 18px;">
            ✕
          </button>
        </div>
      </div>

      <div style="padding: var(--spacing-4); flex: 1; overflow-y: auto;">
        <p style="color: var(--text-secondary); margin-bottom: var(--spacing-4); font-size: 14px;">
          ${i18n.t('photo_capture_instruction')}
        </p>

        <div class="photo-grid">
          ${renderPhotoSlot('frente', 0)}
          ${renderPhotoSlot('verso', 1)}
          ${renderPhotoSlot('detalhe', 2)}
          ${renderPhotoSlot('outros', 3)}
        </div>

        <div style="margin-top: var(--spacing-6);">
          <div style="margin-bottom: var(--spacing-3);">
            <a href="#" id="showExamples" style="color: var(--primary-purple); font-size: 14px; display: inline-flex; align-items: center; gap: 4px;">
              <span style="font-size: 18px;">✨</span>
              ${i18n.t('photo_capture_examples')}
            </a>
          </div>

          <div class="input-group">
            <label class="input-label">${i18n.t('photo_capture_description_label')}</label>
            <div style="position: relative;">
              <input
                type="text"
                id="mannequinDescription"
                class="input-field"
                placeholder="${i18n.t('photo_capture_description_placeholder')}"
                value="${photoState.mannequinDescription}"
                style="padding-right: 48px;"
              >
              <button
                id="uploadBtn"
                style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: none; border: none; font-size: 20px; cursor: pointer;"
                title="${i18n.t('photo_capture_upload')}"
              >
                ⬆️
              </button>
            </div>
          </div>
        </div>

        <div style="margin-top: var(--spacing-6); display: flex; flex-direction: column; gap: var(--spacing-3);">
          <button id="processWithAI" class="btn btn-primary btn-lg" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;" ${photoState.photos.length === 0 ? 'disabled' : ''}>
            <span style="font-size: 20px;">✨</span>
            ${i18n.t('photo_capture_process_ai')}
          </button>
          <button id="processManual" class="btn btn-outline btn-lg" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;" ${photoState.photos.length === 0 ? 'disabled' : ''}>
            <span style="font-size: 20px;">✏️</span>
            ${i18n.t('photo_capture_manual')}
          </button>
        </div>

        <div style="height: 20px;"></div>
      </div>
    </div>

    <input type="file" id="fileInput" accept="image/*" multiple style="display: none;">
  `;
}

function renderPhotoSlot(type, index) {
  const photo = photoState.photos.find(p => p.type === type);
  const labelMap = {
    frente: i18n.t('photo_type_front'),
    verso: i18n.t('photo_type_back'),
    detalhe: i18n.t('photo_type_detail'),
    outros: i18n.t('photo_type_more')
  };

  if (photo) {
    return `
      <div class="photo-slot" data-type="${type}">
        <img src="${photo.url}" alt="${type}">
        <div class="photo-slot-delete" data-photo-id="${photo.id}">🗑️</div>
      </div>
    `;
  }

  return `
    <div class="photo-slot" data-type="${type}">
      <div class="photo-slot-icon">+</div>
      <div class="photo-slot-label">${labelMap[type]}</div>
    </div>
  `;
}

export function setupPhotoCaptureListeners() {
  const backBtn = document.getElementById('backFromCapture');
  const closeBtn = document.getElementById('closeCapture');
  const processAIBtn = document.getElementById('processWithAI');
  const processManualBtn = document.getElementById('processManual');
  const fileInput = document.getElementById('fileInput');
  const uploadBtn = document.getElementById('uploadBtn');
  const descInput = document.getElementById('mannequinDescription');
  const showExamplesLink = document.getElementById('showExamples');

  if (backBtn) {
    backBtn.addEventListener('click', () => {
      navigateTo('/products/onboarding');
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      photoState.photos = [];
      photoState.mannequinDescription = '';
      navigateTo('/products');
    });
  }

  if (showExamplesLink) {
    showExamplesLink.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo('/products/onboarding');
    });
  }

  if (descInput) {
    descInput.addEventListener('input', (e) => {
      photoState.mannequinDescription = e.target.value;
    });
  }

  if (uploadBtn) {
    uploadBtn.addEventListener('click', () => {
      fileInput.click();
    });
  }

  document.querySelectorAll('.photo-slot').forEach(slot => {
    const type = slot.dataset.type;
    const existingPhoto = photoState.photos.find(p => p.type === type);

    if (!existingPhoto) {
      slot.addEventListener('click', () => {
        currentSlotType = type;
        fileInput.click();
      });
    }
  });

  document.querySelectorAll('.photo-slot-delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const photoId = btn.dataset.photoId;
      photoState.photos = photoState.photos.filter(p => p.id !== photoId);
      navigateTo('/products/capture');
    });
  });

  let currentSlotType = 'outros';

  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const files = Array.from(e.target.files);

      files.forEach(file => {
        if (photoState.photos.length >= photoState.maxPhotos) {
          return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
          const photo = {
            id: Date.now() + Math.random(),
            type: currentSlotType,
            url: event.target.result,
            file: file
          };

          const existingIndex = photoState.photos.findIndex(p => p.type === currentSlotType);
          if (existingIndex >= 0) {
            photoState.photos[existingIndex] = photo;
          } else {
            photoState.photos.push(photo);
          }

          navigateTo('/products/capture');
        };
        reader.readAsDataURL(file);
      });

      fileInput.value = '';
    });
  }

  if (processAIBtn) {
    processAIBtn.addEventListener('click', () => {
      if (photoState.photos.length > 0) {
        navigateTo('/products/processing');
      }
    });
  }

  if (processManualBtn) {
    processManualBtn.addEventListener('click', () => {
      if (photoState.photos.length > 0) {
        navigateTo('/products/review-manual');
      }
    });
  }
}

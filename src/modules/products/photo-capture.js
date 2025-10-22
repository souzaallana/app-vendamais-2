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

        <div style="display: flex; gap: var(--spacing-3); margin-bottom: var(--spacing-4);">
          <button id="openCamera" class="btn btn-primary" style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px;">
            <span style="font-size: 20px;">📸</span>
            ${i18n.t('photo_capture_camera') || 'Câmera'}
          </button>
          <button id="openGallery" class="btn btn-outline" style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px;">
            <span style="font-size: 20px;">🖼️</span>
            ${i18n.t('photo_capture_gallery') || 'Galeria'}
          </button>
        </div>

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

    <input type="file" id="fileInputCamera" accept="image/*" capture="environment" style="display: none;">
    <input type="file" id="fileInputGallery" accept="image/*" multiple style="display: none;">
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

let currentSlotType = 'outros';

export function setupPhotoCaptureListeners() {
  console.log('Setting up photo capture listeners');

  const app = document.getElementById('app');

  if (!app) {
    console.error('App element not found');
    return;
  }

  const handleClick = (e) => {
    if (e.target.closest('#backFromCapture')) {
      console.log('Back button clicked');
      e.preventDefault();
      navigateTo('/products/onboarding');
      return;
    }

    if (e.target.closest('#closeCapture')) {
      console.log('Close button clicked');
      e.preventDefault();
      photoState.photos = [];
      photoState.mannequinDescription = '';
      navigateTo('/products');
      return;
    }

    if (e.target.closest('#showExamples')) {
      console.log('Show examples clicked');
      e.preventDefault();
      navigateTo('/products/onboarding');
      return;
    }

    if (e.target.closest('#openCamera')) {
      console.log('Open camera clicked');
      e.preventDefault();
      currentSlotType = 'outros';
      const fileInputCamera = document.getElementById('fileInputCamera');
      console.log('Camera input element:', fileInputCamera);
      if (fileInputCamera) {
        fileInputCamera.click();
      } else {
        console.error('Camera input not found!');
      }
      return;
    }

    if (e.target.closest('#openGallery')) {
      console.log('Open gallery clicked');
      e.preventDefault();
      currentSlotType = 'outros';
      const fileInputGallery = document.getElementById('fileInputGallery');
      console.log('Gallery input element:', fileInputGallery);
      if (fileInputGallery) {
        fileInputGallery.click();
      } else {
        console.error('Gallery input not found!');
      }
      return;
    }

    if (e.target.closest('#uploadBtn')) {
      console.log('Upload button clicked');
      e.preventDefault();
      const fileInputGallery = document.getElementById('fileInputGallery');
      if (fileInputGallery) {
        fileInputGallery.click();
      }
      return;
    }

    const deleteBtn = e.target.closest('.photo-slot-delete');
    if (deleteBtn) {
      console.log('Delete button clicked');
      e.preventDefault();
      e.stopPropagation();
      const photoId = deleteBtn.dataset.photoId;
      photoState.photos = photoState.photos.filter(p => p.id !== photoId);
      navigateTo('/products/capture');
      return;
    }

    const photoSlot = e.target.closest('.photo-slot');
    if (photoSlot) {
      const type = photoSlot.dataset.type;
      const existingPhoto = photoState.photos.find(p => p.type === type);

      if (!existingPhoto) {
        console.log('Photo slot clicked:', type);
        currentSlotType = type;
        const fileInputCamera = document.getElementById('fileInputCamera');
        if (fileInputCamera) {
          fileInputCamera.click();
        }
      }
      return;
    }

    if (e.target.closest('#processWithAI')) {
      console.log('Process with AI clicked');
      e.preventDefault();
      if (photoState.photos.length > 0) {
        navigateTo('/products/processing');
      }
      return;
    }

    if (e.target.closest('#processManual')) {
      console.log('Process manual clicked');
      e.preventDefault();
      if (photoState.photos.length > 0) {
        navigateTo('/products/review');
      }
      return;
    }
  };

  const handleInput = (e) => {
    if (e.target.id === 'mannequinDescription') {
      photoState.mannequinDescription = e.target.value;
    }
  };

  const handleFileChange = (e) => {
    console.log('File input changed, files:', e.target.files.length);
    const files = Array.from(e.target.files);

    files.forEach(file => {
      if (photoState.photos.length >= photoState.maxPhotos) {
        alert(i18n.t('photo_capture_max_photos') || 'Máximo de 8 fotos atingido');
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

    e.target.value = '';
  };

  app.addEventListener('click', handleClick);
  app.addEventListener('input', handleInput);

  // Attach file input listeners directly
  const fileInputCamera = document.getElementById('fileInputCamera');
  const fileInputGallery = document.getElementById('fileInputGallery');

  if (fileInputCamera) {
    console.log('Attaching camera input listener');
    fileInputCamera.addEventListener('change', handleFileChange);
  } else {
    console.warn('Camera input not found during setup');
  }

  if (fileInputGallery) {
    console.log('Attaching gallery input listener');
    fileInputGallery.addEventListener('change', handleFileChange);
  } else {
    console.warn('Gallery input not found during setup');
  }

  console.log('Photo capture listeners set up');
}

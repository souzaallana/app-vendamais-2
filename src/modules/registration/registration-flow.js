import { i18n } from '../../services/i18n.js';
import { productsService } from '../../services/supabase.js';
import { router } from '../../services/router.js';
import { icons, showSnackbar, createModal, compressImage } from '../../utils/helpers.js';
import { analyzeProductImages } from '../../services/ai.js';

export function openRegisterModal() {
  const content = document.createElement('div');
  content.innerHTML = `
    <style>
      .register-modal-header {
        padding: var(--spacing-6);
        text-align: center;
        border-bottom: 1px solid var(--border-gray);
      }

      .register-modal-title {
        font-size: 24px;
        font-weight: 700;
        margin-bottom: var(--spacing-2);
      }

      .register-options {
        padding: var(--spacing-6);
        display: grid;
        gap: var(--spacing-4);
      }

      .register-option {
        padding: var(--spacing-5);
        border: 2px solid var(--border-gray);
        border-radius: var(--border-radius-lg);
        display: flex;
        align-items: center;
        gap: var(--spacing-4);
        cursor: pointer;
        transition: all 0.2s;
        background: white;
      }

      .register-option:hover:not(.disabled) {
        border-color: var(--primary-purple);
        transform: translateX(4px);
      }

      .register-option.disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .register-option-icon {
        width: 56px;
        height: 56px;
        background: var(--gradient-purple);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .register-option.disabled .register-option-icon {
        background: var(--bg-gray-200);
        color: var(--text-secondary);
      }

      .register-option-icon svg {
        width: 28px;
        height: 28px;
      }

      .register-option-info {
        flex: 1;
      }

      .register-option-title {
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 4px;
      }

      .register-option-subtitle {
        font-size: 14px;
        color: var(--text-secondary);
      }
    </style>

    <div class="register-modal-header">
      <h2 class="register-modal-title">${i18n.t('register_title')}</h2>
    </div>

    <div class="register-options">
      <div class="register-option" data-option="photo">
        <div class="register-option-icon">${icons.camera}</div>
        <div class="register-option-info">
          <div class="register-option-title">${i18n.t('register_photo')}</div>
          <div class="register-option-subtitle">Modo IA - Rápido e fácil</div>
        </div>
      </div>

      <div class="register-option disabled" data-option="voice">
        <div class="register-option-icon">${icons.mic}</div>
        <div class="register-option-info">
          <div class="register-option-title">${i18n.t('register_voice')}</div>
          <div class="register-option-subtitle">${i18n.t('register_coming_soon')}</div>
        </div>
      </div>

      <div class="register-option disabled" data-option="gallery">
        <div class="register-option-icon">${icons.image}</div>
        <div class="register-option-info">
          <div class="register-option-title">${i18n.t('register_gallery')}</div>
          <div class="register-option-subtitle">${i18n.t('register_coming_soon')}</div>
        </div>
      </div>

      <div class="register-option disabled" data-option="manual">
        <div class="register-option-icon">${icons.edit}</div>
        <div class="register-option-info">
          <div class="register-option-title">${i18n.t('register_manual')}</div>
          <div class="register-option-subtitle">${i18n.t('register_coming_soon')}</div>
        </div>
      </div>
    </div>
  `;

  const modal = createModal(content);

  content.querySelectorAll('.register-option:not(.disabled)').forEach(option => {
    option.addEventListener('click', () => {
      modal.close();
      startPhotoFlow();
    });
  });

  content.querySelectorAll('.register-option.disabled').forEach(option => {
    option.addEventListener('click', () => {
      showSnackbar(i18n.t('common_coming_soon'), 'warning');
    });
  });
}

let capturedPhotos = [];

function startPhotoFlow() {
  showPhotoTips();
}

function showPhotoTips() {
  const content = document.createElement('div');
  content.innerHTML = `
    <style>
      .tips-container {
        padding: var(--spacing-6);
      }

      .tips-header {
        text-align: center;
        margin-bottom: var(--spacing-6);
      }

      .tips-title {
        font-size: 24px;
        font-weight: 700;
        margin-bottom: var(--spacing-2);
      }

      .tips-subtitle {
        color: var(--text-secondary);
      }

      .tips-list {
        display: grid;
        gap: var(--spacing-4);
        margin-bottom: var(--spacing-8);
      }

      .tip-item {
        display: flex;
        align-items: start;
        gap: var(--spacing-3);
        padding: var(--spacing-4);
        background: var(--bg-gray-50);
        border-radius: var(--border-radius);
      }

      .tip-icon {
        width: 40px;
        height: 40px;
        background: var(--gradient-purple);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .tip-text {
        flex: 1;
        padding-top: 8px;
        font-weight: 500;
      }
    </style>

    <div class="tips-container">
      <div class="tips-header">
        <h2 class="tips-title">${i18n.t('photo_tips_title')}</h2>
        <p class="tips-subtitle">${i18n.t('photo_tips_subtitle')}</p>
      </div>

      <div class="tips-list">
        <div class="tip-item">
          <div class="tip-icon">${icons.sparkles}</div>
          <div class="tip-text">${i18n.t('photo_tips_lighting')}</div>
        </div>
        <div class="tip-item">
          <div class="tip-icon">${icons.check}</div>
          <div class="tip-text">${i18n.t('photo_tips_background')}</div>
        </div>
        <div class="tip-item">
          <div class="tip-icon">${icons.camera}</div>
          <div class="tip-text">${i18n.t('photo_tips_angles')}</div>
        </div>
        <div class="tip-item">
          <div class="tip-icon">${icons.search}</div>
          <div class="tip-text">${i18n.t('photo_tips_details')}</div>
        </div>
      </div>

      <button class="btn btn-primary btn-lg" style="width: 100%;" id="startCapture">
        ${i18n.t('photo_tips_start')}
      </button>
    </div>
  `;

  const modal = createModal(content);
  content.querySelector('#startCapture').addEventListener('click', () => {
    modal.close();
    showPhotoCapture();
  });
}

function showPhotoCapture() {
  capturedPhotos = [];
  const content = document.createElement('div');
  content.innerHTML = `
    <style>
      .capture-container {
        padding: var(--spacing-6);
      }

      .capture-header {
        text-align: center;
        margin-bottom: var(--spacing-6);
      }

      .photo-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--spacing-3);
        margin-bottom: var(--spacing-6);
      }

      .photo-slot {
        aspect-ratio: 1;
        background: var(--bg-gray-100);
        border: 2px dashed var(--border-gray);
        border-radius: var(--border-radius);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
      }

      .photo-slot img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .photo-slot-empty {
        color: var(--text-secondary);
      }

      .capture-actions {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-3);
      }

      input[type="file"] {
        display: none;
      }
    </style>

    <div class="capture-container">
      <div class="capture-header">
        <h2>${i18n.t('photo_capture_title')}</h2>
        <p class="text-muted">${i18n.t('photo_capture_subtitle')}</p>
      </div>

      <div class="photo-grid" id="photoGrid">
        <div class="photo-slot"><div class="photo-slot-empty">${icons.camera}</div></div>
        <div class="photo-slot"><div class="photo-slot-empty">${icons.camera}</div></div>
        <div class="photo-slot"><div class="photo-slot-empty">${icons.camera}</div></div>
      </div>

      <div class="capture-actions">
        <button class="btn btn-primary btn-lg" id="captureBtn">
          ${icons.camera}
          ${i18n.t('photo_capture_button')}
        </button>
        <button class="btn btn-secondary" id="continueBtn" disabled>
          ${i18n.t('photo_capture_continue')}
        </button>
      </div>

      <input type="file" id="fileInput" accept="image/*" capture="environment" multiple />
    </div>
  `;

  const modal = createModal(content, { preventClose: true });
  const fileInput = content.querySelector('#fileInput');
  const captureBtn = content.querySelector('#captureBtn');
  const continueBtn = content.querySelector('#continueBtn');
  const photoGrid = content.querySelector('#photoGrid');

  captureBtn.addEventListener('click', () => {
    if (capturedPhotos.length < 3) {
      fileInput.click();
    } else {
      showSnackbar('Máximo de 3 fotos', 'warning');
    }
  });

  fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const compressed = await compressImage(file);
        const reader = new FileReader();
        reader.onload = (event) => {
          capturedPhotos.push({ file: compressed, preview: event.target.result });
          updatePhotoGrid();
        };
        reader.readAsDataURL(compressed);
      } catch (error) {
        showSnackbar('Erro ao processar imagem', 'error');
      }
    }
    fileInput.value = '';
  });

  function updatePhotoGrid() {
    const slots = photoGrid.querySelectorAll('.photo-slot');
    slots.forEach((slot, index) => {
      if (capturedPhotos[index]) {
        slot.innerHTML = `<img src="${capturedPhotos[index].preview}" alt="Foto ${index + 1}">`;
      }
    });

    continueBtn.disabled = capturedPhotos.length === 0;
    if (capturedPhotos.length > 0) {
      continueBtn.classList.remove('btn-secondary');
      continueBtn.classList.add('btn-primary');
    }
  }

  continueBtn.addEventListener('click', () => {
    modal.close();
    showPhotoReview();
  });
}

function showPhotoReview() {
  const content = document.createElement('div');
  content.innerHTML = `
    <style>
      .photo-review-container {
        padding: var(--spacing-6);
      }

      .photo-review-header {
        text-align: center;
        margin-bottom: var(--spacing-6);
      }

      .photo-review-title {
        font-size: 24px;
        font-weight: 700;
        margin-bottom: var(--spacing-2);
      }

      .photo-review-subtitle {
        color: var(--text-secondary);
      }

      .photos-review-grid {
        display: grid;
        gap: var(--spacing-4);
        margin-bottom: var(--spacing-6);
      }

      .photo-review-item {
        position: relative;
        border-radius: var(--border-radius-lg);
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }

      .photo-review-item img {
        width: 100%;
        height: auto;
        display: block;
      }

      .photo-review-item-actions {
        position: absolute;
        top: var(--spacing-3);
        right: var(--spacing-3);
        display: flex;
        gap: var(--spacing-2);
      }

      .photo-review-item-btn {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.9);
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s;
      }

      .photo-review-item-btn:hover {
        background: white;
        transform: scale(1.1);
      }

      .photo-review-item-btn svg {
        width: 20px;
        height: 20px;
      }

      .photo-review-item-btn.delete svg {
        color: var(--error-red);
      }

      .photo-review-actions {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-3);
      }
    </style>

    <div class="photo-review-container">
      <div class="photo-review-header">
        <h2 class="photo-review-title">Revisar Fotos</h2>
        <p class="photo-review-subtitle">Confira as fotos antes de continuar</p>
      </div>

      <div class="photos-review-grid" id="photosReviewGrid"></div>

      <div class="photo-review-actions">
        <button class="btn btn-primary btn-lg" id="confirmPhotos">
          ${icons.check}
          Confirmar Fotos
        </button>
        <button class="btn btn-outline" id="retakePhotos">
          ${icons.camera}
          Tirar Novas Fotos
        </button>
      </div>
    </div>
  `;

  const modal = createModal(content, { preventClose: true });
  const grid = content.querySelector('#photosReviewGrid');

  capturedPhotos.forEach((photo, index) => {
    const photoItem = document.createElement('div');
    photoItem.className = 'photo-review-item';
    photoItem.innerHTML = `
      <img src="${photo.preview}" alt="Foto ${index + 1}">
      <div class="photo-review-item-actions">
        <button class="photo-review-item-btn delete" data-index="${index}">
          ${icons.trash}
        </button>
      </div>
    `;
    grid.appendChild(photoItem);
  });

  content.querySelectorAll('.photo-review-item-btn.delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.currentTarget.dataset.index);
      capturedPhotos.splice(index, 1);
      modal.close();
      if (capturedPhotos.length === 0) {
        showPhotoCapture();
      } else {
        showPhotoReview();
      }
    });
  });

  content.querySelector('#confirmPhotos').addEventListener('click', () => {
    modal.close();
    showAIProcessing();
  });

  content.querySelector('#retakePhotos').addEventListener('click', () => {
    modal.close();
    showPhotoCapture();
  });
}

async function showAIProcessing() {
  const content = document.createElement('div');
  content.innerHTML = `
    <style>
      .ai-container {
        padding: var(--spacing-8);
        text-align: center;
      }

      .ai-animation {
        width: 120px;
        height: 120px;
        margin: 0 auto var(--spacing-6);
        position: relative;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .ai-animation svg {
        width: 60px;
        height: 60px;
        color: white;
        animation: pulse 2s ease-in-out infinite;
      }

      @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.1); opacity: 0.8; }
      }

      .ai-circle {
        position: absolute;
        width: 140px;
        height: 140px;
        border: 3px solid transparent;
        border-top-color: #667eea;
        border-radius: 50%;
        animation: spin 1.5s linear infinite;
        top: -10px;
        left: -10px;
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }

      .ai-steps {
        display: grid;
        gap: var(--spacing-3);
        margin-top: var(--spacing-8);
        text-align: left;
      }

      .ai-step {
        display: flex;
        align-items: center;
        gap: var(--spacing-3);
        padding: var(--spacing-4);
        background: var(--bg-gray-50);
        border-radius: var(--border-radius-lg);
        transition: all 0.3s;
      }

      .ai-step.active {
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
        border-left: 3px solid #667eea;
      }

      .ai-step.completed {
        background: rgba(16, 185, 129, 0.1);
        border-left: 3px solid #10b981;
      }

      .ai-step-icon {
        width: 28px;
        height: 28px;
        color: var(--text-secondary);
      }

      .ai-step.active .ai-step-icon {
        color: #667eea;
      }

      .ai-step.completed .ai-step-icon {
        color: #10b981;
      }

      .ai-step-text {
        flex: 1;
        font-weight: 500;
      }
    </style>

    <div class="ai-container">
      <div class="ai-animation">
        ${icons.sparkles}
        <div class="ai-circle"></div>
      </div>

      <h2>IA Analisando Produto</h2>
      <p class="text-muted">Aguarde enquanto processamos as imagens</p>

      <div class="ai-steps">
        <div class="ai-step" data-step="analyzing">
          <div class="ai-step-icon">${icons.search}</div>
          <div class="ai-step-text">Analisando imagens...</div>
        </div>
        <div class="ai-step" data-step="category">
          <div class="ai-step-icon">${icons.tag}</div>
          <div class="ai-step-text">Identificando categoria...</div>
        </div>
        <div class="ai-step" data-step="description">
          <div class="ai-step-icon">${icons.edit}</div>
          <div class="ai-step-text">Gerando descrição...</div>
        </div>
        <div class="ai-step" data-step="tags">
          <div class="ai-step-icon">${icons.sparkles}</div>
          <div class="ai-step-text">Criando tags...</div>
        </div>
      </div>
    </div>
  `;

  const modal = createModal(content, { preventClose: true });

  const steps = ['analyzing', 'category', 'description', 'tags'];
  let currentStep = 0;

  const animateSteps = () => {
    const stepElements = content.querySelectorAll('.ai-step');

    const interval = setInterval(() => {
      if (currentStep > 0) {
        stepElements[currentStep - 1].classList.remove('active');
        stepElements[currentStep - 1].classList.add('completed');
      }

      if (currentStep < steps.length) {
        stepElements[currentStep].classList.add('active');
        currentStep++;
      } else {
        clearInterval(interval);
      }
    }, 1000);
  };

  animateSteps();

  try {
    const generatedData = await generateProductDataFromAI(capturedPhotos);
    aiGeneratedData = generatedData;

    setTimeout(() => {
      modal.close();
      showProductReview();
    }, 4500);
  } catch (error) {
    console.error('AI processing error:', error);
    aiGeneratedData = {
      title: 'Produto',
      description: 'Descreva seu produto aqui',
      category: 'Sem categoria',
      tags: ''
    };

    setTimeout(() => {
      modal.close();
      showProductReview();
    }, 4500);
  }
}

async function generateProductDataFromAI(photos) {
  console.log('Generating product data from AI with', photos.length, 'photos');

  try {
    const productData = await analyzeProductImages(photos);
    return productData;
  } catch (error) {
    console.error('Error generating product data:', error);
    return {
      title: 'Produto Cadastrado',
      description: 'Descreva seu produto aqui',
      category: 'Geral',
      tags: 'novo'
    };
  }
}

let aiGeneratedData = {};

function showProductReview() {
  const content = document.createElement('div');
  content.innerHTML = `
    <style>
      .review-container {
        padding: var(--spacing-6);
        max-height: 80vh;
        overflow-y: auto;
      }

      .review-header {
        text-align: center;
        margin-bottom: var(--spacing-6);
      }

      .review-header h2 {
        font-size: 24px;
        font-weight: 700;
        margin-bottom: var(--spacing-2);
      }

      .review-photos {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--spacing-2);
        margin-bottom: var(--spacing-6);
        padding: var(--spacing-4);
        background: var(--bg-gray-50);
        border-radius: var(--border-radius-lg);
      }

      .review-photo {
        aspect-ratio: 1;
        border-radius: var(--border-radius);
        overflow: hidden;
      }

      .review-photo img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .review-form {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-5);
      }

      textarea {
        min-height: 120px;
        resize: vertical;
      }

      .ai-badge {
        display: inline-flex;
        align-items: center;
        gap: var(--spacing-2);
        padding: 4px 12px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
      }

      .ai-badge svg {
        width: 14px;
        height: 14px;
      }
    </style>

    <div class="review-container">
      <div class="review-header">
        <h2>Revisar Produto</h2>
        <p class="text-muted">Confira e edite as informações geradas pela IA</p>
        <div style="margin-top: var(--spacing-3);">
          <span class="ai-badge">${icons.sparkles} Gerado por IA</span>
        </div>
      </div>

      <div class="review-photos" id="reviewPhotos"></div>

      <form class="review-form" id="reviewForm">
        <div class="input-group">
          <label class="input-label">Nome do Produto</label>
          <input type="text" class="input-field" id="productTitle" value="${aiGeneratedData.title || ''}" required />
        </div>

        <div class="input-group">
          <label class="input-label">Descrição</label>
          <textarea class="input-field" id="productDescription" required>${aiGeneratedData.description || ''}</textarea>
        </div>

        <div class="input-group">
          <label class="input-label">Categoria</label>
          <input type="text" class="input-field" id="productCategory" value="${aiGeneratedData.category || ''}" required />
        </div>

        <div class="input-group">
          <label class="input-label">Tags (separadas por vírgula)</label>
          <input type="text" class="input-field" id="productTags" value="${aiGeneratedData.tags || ''}" placeholder="ex: casual, verão, conforto" />
        </div>

        <button type="submit" class="btn btn-primary btn-lg">
          ${icons.check}
          Salvar Produto
        </button>
      </form>
    </div>
  `;

  const modal = createModal(content, { preventClose: true });
  const reviewPhotos = content.querySelector('#reviewPhotos');

  capturedPhotos.forEach((photo, index) => {
    const photoDiv = document.createElement('div');
    photoDiv.className = 'review-photo';
    photoDiv.innerHTML = `<img src="${photo.preview}" alt="Foto ${index + 1}">`;
    reviewPhotos.appendChild(photoDiv);
  });

  const form = content.querySelector('#reviewForm');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = `${icons.spinner} Salvando...`;

    try {
      const productData = {
        title: content.querySelector('#productTitle').value,
        description: content.querySelector('#productDescription').value,
        category: content.querySelector('#productCategory').value,
        tags: content.querySelector('#productTags').value,
        price: 0,
        status: 'active',
        is_ai_generated: true,
      };

      const product = await productsService.createProduct(productData);

      for (let i = 0; i < capturedPhotos.length; i++) {
        await productsService.uploadProductImage(product.id, capturedPhotos[i].file, i);
      }

      modal.close();
      showSuccess(product);
    } catch (error) {
      console.error('Error saving product:', error);
      showSnackbar('Erro ao salvar produto', 'error');
      submitBtn.disabled = false;
      submitBtn.innerHTML = `${icons.check} Salvar Produto`;
    }
  });
}

function showSuccess(product) {
  const content = document.createElement('div');
  content.innerHTML = `
    <style>
      .success-container {
        padding: var(--spacing-8);
        text-align: center;
      }

      .success-animation {
        width: 120px;
        height: 120px;
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto var(--spacing-6);
        animation: successPop 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        position: relative;
      }

      @keyframes successPop {
        0% { transform: scale(0); opacity: 0; }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); opacity: 1; }
      }

      .success-animation svg {
        width: 64px;
        height: 64px;
        color: white;
      }

      .success-animation::before {
        content: '';
        position: absolute;
        width: 140px;
        height: 140px;
        border: 3px solid #10b981;
        border-radius: 50%;
        opacity: 0.3;
        animation: ripple 1.5s ease-out infinite;
      }

      @keyframes ripple {
        0% { transform: scale(1); opacity: 0.3; }
        100% { transform: scale(1.3); opacity: 0; }
      }

      .success-title {
        font-size: 28px;
        font-weight: 700;
        margin-bottom: var(--spacing-2);
        color: #10b981;
      }

      .success-subtitle {
        font-size: 16px;
        color: var(--text-secondary);
        margin-bottom: var(--spacing-8);
      }

      .share-section {
        background: var(--bg-gray-50);
        border-radius: var(--border-radius-lg);
        padding: var(--spacing-5);
        margin-bottom: var(--spacing-4);
      }

      .share-title {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: var(--spacing-3);
        display: flex;
        align-items: center;
        gap: var(--spacing-2);
      }

      .share-title svg {
        width: 20px;
        height: 20px;
      }

      .marketplace-section {
        background: var(--bg-gray-50);
        border-radius: var(--border-radius-lg);
        padding: var(--spacing-5);
        margin-bottom: var(--spacing-6);
      }

      .marketplace-title {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: var(--spacing-3);
        display: flex;
        align-items: center;
        gap: var(--spacing-2);
      }

      .marketplace-title svg {
        width: 20px;
        height: 20px;
      }

      .marketplace-buttons {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-3);
      }

      .marketplace-btn {
        padding: var(--spacing-4);
        border: 2px solid var(--border-gray);
        border-radius: var(--border-radius-lg);
        background: white;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 16px;
        font-weight: 500;
      }

      .marketplace-btn.active {
        border-color: #667eea;
        background: rgba(102, 126, 234, 0.05);
      }

      .marketplace-btn.disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .marketplace-badge {
        font-size: 12px;
        color: var(--text-secondary);
        background: var(--bg-gray-200);
        padding: 2px 8px;
        border-radius: 12px;
      }

      .share-buttons {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--spacing-3);
        margin-bottom: var(--spacing-4);
      }

      .share-btn {
        padding: var(--spacing-4);
        border: 2px solid var(--border-gray);
        border-radius: var(--border-radius-lg);
        background: white;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--spacing-2);
      }

      .share-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      }

      .share-btn.whatsapp:hover {
        border-color: #25D366;
        background: rgba(37, 211, 102, 0.05);
      }

      .share-btn.instagram:hover {
        border-color: #E4405F;
        background: rgba(228, 64, 95, 0.05);
      }

      .share-btn.tiktok:hover {
        border-color: #000000;
        background: rgba(0, 0, 0, 0.05);
      }

      .share-icon {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .share-btn.whatsapp .share-icon {
        color: #25D366;
      }

      .share-btn.instagram .share-icon {
        color: #E4405F;
      }

      .share-btn.tiktok .share-icon {
        color: #000000;
      }

      .share-label {
        font-size: 14px;
        font-weight: 600;
      }

      .success-actions {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-3);
      }
    </style>

    <div class="success-container">
      <div class="success-animation">
        ${icons.check}
      </div>

      <h2 class="success-title">Produto Cadastrado!</h2>
      <p class="success-subtitle">Seu produto foi cadastrado com sucesso</p>

      <div class="share-section">
        <h3 class="share-title">${icons.share} Compartilhe:</h3>
        <div class="share-buttons">
          <button class="share-btn instagram" id="shareInstagram">
            <div class="share-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </div>
            <span class="share-label">IG</span>
          </button>

          <button class="share-btn whatsapp" id="shareWhatsapp">
            <div class="share-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
            </div>
            <span class="share-label">WA</span>
          </button>

          <button class="share-btn tiktok" id="shareTiktok">
            <div class="share-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
              </svg>
            </div>
            <span class="share-label">TT</span>
          </button>
        </div>
      </div>

      <div class="marketplace-section">
        <h3 class="marketplace-title">${icons.package} Publique:</h3>
        <div class="marketplace-buttons">
          <button class="marketplace-btn active" id="publishMercadoLivre">
            <span class="marketplace-label">Mercado Livre</span>
          </button>

          <button class="marketplace-btn disabled" id="publishShopee">
            <span class="marketplace-label">Shopee</span>
            <span class="marketplace-badge">Em breve</span>
          </button>

          <button class="marketplace-btn disabled" id="publishShein">
            <span class="marketplace-label">Shein</span>
            <span class="marketplace-badge">Em breve</span>
          </button>
        </div>
      </div>

      <div class="success-actions">
        <button class="btn btn-primary btn-lg" id="newProduct">
          Cadastrar Outro Produto
        </button>
        <button class="btn btn-outline" id="viewProducts">
          Ver Meus Produtos
        </button>
        <button class="btn btn-outline" id="goHome" style="background: transparent; border: none; color: var(--text-secondary);">
          Voltar ao Início
        </button>
      </div>
    </div>
  `;

  const modal = createModal(content);

  const productTitle = product?.title || 'Produto';
  const productUrl = `${window.location.origin}/products/${product?.id || ''}`;

  content.querySelector('#shareInstagram').addEventListener('click', () => {
    showSnackbar('Abra o Instagram e compartilhe manualmente', 'info');
  });

  content.querySelector('#shareWhatsapp').addEventListener('click', () => {
    const text = `Olha esse produto que acabei de cadastrar: ${productTitle}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + productUrl)}`;
    window.open(whatsappUrl, '_blank');
  });

  content.querySelector('#shareTiktok').addEventListener('click', () => {
    showSnackbar('Abra o TikTok e compartilhe manualmente', 'info');
  });

  content.querySelector('#publishMercadoLivre').addEventListener('click', () => {
    showSnackbar('Publicação no Mercado Livre em breve', 'info');
  });

  content.querySelectorAll('.marketplace-btn.disabled').forEach(btn => {
    btn.addEventListener('click', () => {
      showSnackbar('Marketplace em breve', 'info');
    });
  });

  content.querySelector('#newProduct').addEventListener('click', () => {
    modal.close();
    capturedPhotos = [];
    startPhotoFlow();
  });

  content.querySelector('#viewProducts').addEventListener('click', () => {
    modal.close();
    router.navigate('/products');
  });

  content.querySelector('#goHome').addEventListener('click', () => {
    modal.close();
    router.navigate('/home');
  });
}

window.addEventListener('openRegisterModal', openRegisterModal);

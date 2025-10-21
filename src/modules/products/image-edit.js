import { i18n } from '../../services/i18n.js';
import { navigateTo } from '../../services/router.js';
import { getSelectionState } from './image-selection.js';

export function renderImageEdit() {
  const selectionState = getSelectionState();
  const firstImage = Object.values(selectionState.selectedImages)
    .flat()
    .find(url => url);

  return `
    <div class="photo-capture-container">
      <div class="app-header-curved">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <button id="backFromEdit" class="camera-button" style="background: rgba(255,255,255,0.2); width: 40px; height: 40px; font-size: 18px;">
            ←
          </button>
          <h2 class="app-header-title">${i18n.t('edit_title')}</h2>
          <button id="deleteImage" class="camera-button" style="background: rgba(255,255,255,0.2); width: 40px; height: 40px; font-size: 18px;">
            🗑️
          </button>
        </div>
      </div>

      <div style="flex: 1; overflow-y: auto; padding: var(--spacing-4);">
        <p style="color: var(--text-secondary); margin-bottom: var(--spacing-4); font-size: 14px;">
          ${i18n.t('edit_instruction')}
        </p>

        <div style="background: var(--bg-white); border-radius: var(--border-radius-lg); padding: var(--spacing-4); margin-bottom: var(--spacing-6);">
          <img src="${firstImage || ''}" alt="Product" style="width: 100%; border-radius: var(--border-radius);">
          <div style="display: flex; justify-content: center; gap: var(--spacing-4); margin-top: var(--spacing-4);">
            <button class="camera-button" style="background: var(--bg-gray-100); color: var(--text-primary); font-size: 20px;">
              ↶
            </button>
            <button class="camera-button" style="background: var(--bg-gray-100); color: var(--text-primary); font-size: 20px;">
              ↷
            </button>
          </div>
        </div>

        <div style="margin-bottom: var(--spacing-4);">
          <div style="display: flex; align-items: center; gap: var(--spacing-2); margin-bottom: var(--spacing-3);">
            <span style="font-size: 20px;">✨</span>
            <span style="font-size: 14px; font-weight: 600; color: var(--text-primary);">
              ${i18n.t('edit_quick_commands')}
            </span>
          </div>
          <div class="quick-commands">
            <button class="quick-command-btn">${i18n.t('edit_cmd_change_color')}</button>
            <button class="quick-command-btn">${i18n.t('edit_cmd_remove_background')}</button>
          </div>
        </div>

        <div class="input-group">
          <label class="input-label">${i18n.t('edit_describe_change')}</label>
          <div style="position: relative;">
            <input
              type="text"
              id="editDescription"
              class="input-field"
              placeholder="${i18n.t('edit_describe_placeholder')}"
              style="padding-right: 48px;"
            >
            <button
              id="submitEdit"
              style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: none; border: none; font-size: 20px; cursor: pointer;"
            >
              ⬆️
            </button>
          </div>
        </div>

        <div style="margin-top: var(--spacing-6);">
          <button id="reprocessChanges" class="btn btn-primary btn-lg" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;">
            <span style="font-size: 20px;">✨</span>
            ${i18n.t('edit_reprocess')}
          </button>
        </div>

        <div style="height: 20px;"></div>
      </div>
    </div>
  `;
}

export function setupImageEditListeners() {
  const backBtn = document.getElementById('backFromEdit');
  const deleteBtn = document.getElementById('deleteImage');
  const reprocessBtn = document.getElementById('reprocessChanges');

  if (backBtn) {
    backBtn.addEventListener('click', () => {
      navigateTo('/products/image-selection');
    });
  }

  if (deleteBtn) {
    deleteBtn.addEventListener('click', () => {
      if (confirm(i18n.t('edit_confirm_delete'))) {
        navigateTo('/products/image-selection');
      }
    });
  }

  if (reprocessBtn) {
    reprocessBtn.addEventListener('click', () => {
      navigateTo('/products/image-selection');
    });
  }

  document.querySelectorAll('.quick-command-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const editInput = document.getElementById('editDescription');
      if (editInput) {
        editInput.value = btn.textContent;
      }
    });
  });
}

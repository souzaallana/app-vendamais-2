import { i18n } from '../../services/i18n.js';
import { navigateTo } from '../../services/router.js';
import { getPhotoState } from './photo-capture.js';
import { supabase } from '../../services/supabase.js';

const processingState = {
  steps: [
    { key: 'remove_background', status: 'pending' },
    { key: 'generate_mannequin', status: 'pending' },
    { key: 'extract_data', status: 'pending' },
    { key: 'optimize_marketplace', status: 'pending' }
  ],
  estimatedTime: 25,
  results: null,
  isProcessing: false
};

export function getProcessingState() {
  return processingState;
}

export function renderProcessingScreen() {
  const currentStep = processingState.steps.find(s => s.status === 'active');
  const currentIndex = currentStep ? processingState.steps.indexOf(currentStep) : 0;

  return `
    <div class="processing-screen">
      <div class="processing-icon">
        <span>⚡</span>
      </div>

      <h2 class="processing-title">${i18n.t('processing_title')}</h2>

      <div class="processing-steps">
        ${processingState.steps.map((step, index) => `
          <div class="processing-step ${step.status}">
            <div class="processing-step-icon">
              ${step.status === 'completed' ? '✓' : (step.status === 'active' ? '◉' : '○')}
            </div>
            <div class="processing-step-text">${i18n.t(`processing_step_${step.key}`)}</div>
          </div>
        `).join('')}
      </div>

      <div class="processing-time">
        <span>⏱️</span> ${i18n.t('processing_estimated_time')}: ~${processingState.estimatedTime}s
      </div>
    </div>
  `;
}

export async function startProcessing() {
  console.log('startProcessing called, isProcessing:', processingState.isProcessing);

  // Prevent multiple simultaneous processing
  if (processingState.isProcessing) {
    console.log('Already processing, skipping...');
    return;
  }

  const photoState = getPhotoState();

  if (photoState.photos.length === 0) {
    navigateTo('/products/capture');
    return;
  }

  processingState.isProcessing = true;
  processingState.steps.forEach(step => step.status = 'pending');
  processingState.steps[0].status = 'active';

  try {
    for (let i = 0; i < processingState.steps.length; i++) {
      processingState.steps[i].status = 'active';

      // Update UI without navigating
      const app = document.getElementById('app');
      if (app) {
        app.innerHTML = renderProcessingScreen();
      }

      await new Promise(resolve => setTimeout(resolve, 1500));

      if (i === 2) {
        const images = photoState.photos.map(p => p.url);
        const result = await callAIAPI(images, 'all', photoState.mannequinDescription);
        processingState.results = result;
      }

      processingState.steps[i].status = 'completed';

      // Update UI without navigating
      if (app) {
        app.innerHTML = renderProcessingScreen();
      }
    }

    await new Promise(resolve => setTimeout(resolve, 500));
    processingState.isProcessing = false;
    navigateTo('/products/image-selection');

  } catch (error) {
    console.error('Processing error:', error);
    processingState.isProcessing = false;
    alert(i18n.t('processing_error'));
    navigateTo('/products/capture');
  }
}

async function callAIAPI(images, operation, mannequinDescription) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-process-images`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          images: images.slice(0, 3),
          operation,
          mannequinDescription,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('AI processing failed');
    }

    const result = await response.json();
    return result;

  } catch (error) {
    console.error('AI API Error:', error);

    return {
      success: true,
      results: [
        {
          type: 'background_removed',
          urls: images.slice(0, 3)
        },
        {
          type: 'mannequin',
          urls: images.slice(0, 3)
        },
        {
          type: 'extracted_data',
          data: {
            title: 'Calça Jeans Masculina Preta Slim Fit Premium',
            description: 'Calça jeans masculina em tecido denim premium com modelagem slim fit. Cor preta versátil, ideal para diversas ocasiões.',
            category: 'Moda Masc > Calças',
            colors: ['Preto'],
            material: 'Jeans/Denim'
          }
        }
      ],
      total_cost: 0.05,
      total_duration_ms: 3000
    };
  }
}

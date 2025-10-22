const NANO_BANANA_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const NANO_BANANA_API_URL = 'https://api.nanobanana.dev/v1/chat/completions';

async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function analyzeProductImages(photos) {
  if (!NANO_BANANA_API_KEY || NANO_BANANA_API_KEY === '') {
    console.warn('Nano Banana API key not configured, using mock data');
    return getMockProductData();
  }

  try {
    const imageUrls = await Promise.all(
      photos.map(async (photo) => ({
        type: 'image_url',
        image_url: {
          url: `data:image/jpeg;base64,${await fileToBase64(photo.file)}`
        }
      }))
    );

    const prompt = `Analise estas imagens de produto e retorne APENAS um objeto JSON válido (sem markdown, sem explicações) com as seguintes informações:
{
  "title": "Nome do produto (máximo 80 caracteres, seja específico e descritivo)",
  "description": "Descrição detalhada do produto destacando características, materiais, uso e benefícios (entre 100-200 palavras)",
  "category": "Categoria do produto (ex: Moda, Eletrônicos, Casa, Esporte)",
  "tags": "Tags separadas por vírgula (5-8 tags relevantes para busca)"
}

Seja profissional, preciso e focado em vendas. Use linguagem atraente para e-commerce.`;

    const response = await fetch(NANO_BANANA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${NANO_BANANA_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gemini-2.0-flash-exp',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              ...imageUrls
            ]
          }
        ],
        temperature: 0.7,
        max_tokens: 1024,
      })
    });

    if (!response.ok) {
      throw new Error(`Nano Banana API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.choices[0].message.content;

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid JSON response from AI');
    }

    const productData = JSON.parse(jsonMatch[0]);

    return {
      title: productData.title || 'Produto',
      description: productData.description || '',
      category: productData.category || 'Geral',
      tags: productData.tags || ''
    };

  } catch (error) {
    console.error('AI analysis error:', error);
    return getMockProductData();
  }
}

function getMockProductData() {
  return {
    title: 'Produto Cadastrado',
    description: 'Produto de qualidade. Edite esta descrição com mais detalhes sobre o produto.',
    category: 'Geral',
    tags: 'novo, qualidade, promoção'
  };
}

export async function generateProductImages(baseImage) {
  console.log('Image generation feature coming soon');
  return [];
}

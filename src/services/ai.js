const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

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
  if (!GEMINI_API_KEY || GEMINI_API_KEY === '') {
    console.warn('Gemini API key not configured, using mock data');
    return getMockProductData();
  }

  try {
    const imageParts = await Promise.all(
      photos.map(async (photo) => ({
        inlineData: {
          mimeType: 'image/jpeg',
          data: await fileToBase64(photo.file)
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

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            ...imageParts
          ]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;

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

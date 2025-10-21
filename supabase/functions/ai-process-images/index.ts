import { createClient } from 'npm:@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface ProcessImageRequest {
  images: string[];
  operation: 'remove_background' | 'generate_mannequin' | 'extract_data' | 'all';
  mannequinDescription?: string;
  productId?: string;
}

interface AILog {
  user_id: string;
  product_id?: string;
  api_provider: string;
  operation_type: string;
  input_data: any;
  output_data: any;
  cost: number;
  duration_ms: number;
  status: 'success' | 'error' | 'pending';
  error_message?: string;
}

async function callNanoBananaAPI(apiKey: string, modelKey: string, inputs: any) {
  const response = await fetch('https://api.banana.dev/start/v4/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      apiKey,
      modelKey,
      modelInputs: inputs,
    }),
  });

  if (!response.ok) {
    throw new Error(`Banana API error: ${response.statusText}`);
  }

  return await response.json();
}

async function removeBackground(apiKey: string, imageBase64: string) {
  const modelKey = Deno.env.get('NANO_BANANA_REMBG_MODEL_KEY') || '';

  if (!modelKey || !apiKey) {
    throw new Error('Missing API configuration for background removal');
  }

  const result = await callNanoBananaAPI(apiKey, modelKey, {
    image: imageBase64,
  });

  return result.modelOutputs?.[0]?.image_base64 || imageBase64;
}

async function generateMannequin(apiKey: string, imageBase64: string, prompt: string) {
  const modelKey = Deno.env.get('NANO_BANANA_TRYON_MODEL_KEY') || '';

  if (!modelKey || !apiKey) {
    throw new Error('Missing API configuration for mannequin generation');
  }

  const result = await callNanoBananaAPI(apiKey, modelKey, {
    image: imageBase64,
    prompt: prompt || 'professional model wearing the product, studio lighting, clean background',
    num_variants: 3,
  });

  return result.modelOutputs?.map((o: any) => o.image_base64) || [imageBase64];
}

async function extractProductData(apiKey: string, images: string[]) {
  const modelKey = Deno.env.get('NANO_BANANA_VISION_MODEL_KEY') || '';

  if (!modelKey || !apiKey) {
    throw new Error('Missing API configuration for data extraction');
  }

  const prompt = `Analyze this product image and extract the following information in JSON format:
{
  "title": "descriptive product title in Portuguese",
  "description": "detailed product description in Portuguese (2-3 sentences)",
  "category": "product category",
  "colors": ["list of colors"],
  "material": "main material"
}`;

  const result = await callNanoBananaAPI(apiKey, modelKey, {
    image: images[0],
    prompt,
    max_tokens: 500,
  });

  try {
    const text = result.modelOutputs?.[0]?.text || '{}';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const extracted = jsonMatch ? JSON.parse(jsonMatch[0]) : {};

    return {
      title: extracted.title || 'Produto',
      description: extracted.description || 'Descrição do produto',
      category: extracted.category || 'Geral',
      colors: extracted.colors || [],
      material: extracted.material || 'Não especificado',
    };
  } catch (error) {
    console.error('Error parsing AI response:', error);
    return {
      title: 'Produto',
      description: 'Descrição do produto',
      category: 'Geral',
      colors: [],
      material: 'Não especificado',
    };
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const nanoBananaApiKey = Deno.env.get('NANO_BANANA_API_KEY') || '';

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { images, operation, mannequinDescription, productId }: ProcessImageRequest = await req.json();

    const results = [];
    const logs: AILog[] = [];
    const useRealAPI = nanoBananaApiKey.length > 0;

    let backgroundRemovedImages: string[] = [];
    let mannequinImages: string[][] = [];
    let extractedData: any = null;

    if (operation === 'remove_background' || operation === 'all') {
      for (let i = 0; i < images.length; i++) {
        const startTime = Date.now();
        try {
          let processedImage = images[i];

          if (useRealAPI) {
            processedImage = await removeBackground(nanoBananaApiKey, images[i]);
          }

          backgroundRemovedImages.push(processedImage);

          const duration = Date.now() - startTime;
          logs.push({
            user_id: user.id,
            product_id: productId,
            api_provider: useRealAPI ? 'nano_banana' : 'mock',
            operation_type: 'remove_background',
            input_data: { image_index: i, using_real_api: useRealAPI },
            output_data: { success: true },
            cost: useRealAPI ? 0.0025 : 0,
            duration_ms: duration,
            status: 'success',
          });

          results.push({
            type: 'background_removed',
            index: i,
            url: processedImage,
          });
        } catch (error) {
          const duration = Date.now() - startTime;
          backgroundRemovedImages.push(images[i]);

          logs.push({
            user_id: user.id,
            product_id: productId,
            api_provider: 'nano_banana',
            operation_type: 'remove_background',
            input_data: { image_index: i },
            output_data: {},
            cost: 0,
            duration_ms: duration,
            status: 'error',
            error_message: error.message,
          });

          results.push({
            type: 'background_removed',
            index: i,
            url: images[i],
          });
        }
      }
    }

    if (operation === 'generate_mannequin' || operation === 'all') {
      const imagesToProcess = backgroundRemovedImages.length > 0 ? backgroundRemovedImages : images;

      for (let i = 0; i < imagesToProcess.length; i++) {
        const startTime = Date.now();
        try {
          let variants = [imagesToProcess[i], imagesToProcess[i], imagesToProcess[i]];

          if (useRealAPI) {
            variants = await generateMannequin(
              nanoBananaApiKey,
              imagesToProcess[i],
              mannequinDescription || ''
            );
          }

          mannequinImages.push(variants);

          const duration = Date.now() - startTime;
          logs.push({
            user_id: user.id,
            product_id: productId,
            api_provider: useRealAPI ? 'nano_banana' : 'mock',
            operation_type: 'generate_mannequin',
            input_data: {
              image_index: i,
              description: mannequinDescription,
              using_real_api: useRealAPI
            },
            output_data: { success: true, variants_count: variants.length },
            cost: useRealAPI ? 0.01 : 0,
            duration_ms: duration,
            status: 'success',
          });

          results.push({
            type: 'mannequin',
            index: i,
            urls: variants,
          });
        } catch (error) {
          const duration = Date.now() - startTime;
          mannequinImages.push([imagesToProcess[i]]);

          logs.push({
            user_id: user.id,
            product_id: productId,
            api_provider: 'nano_banana',
            operation_type: 'generate_mannequin',
            input_data: { image_index: i },
            output_data: {},
            cost: 0,
            duration_ms: duration,
            status: 'error',
            error_message: error.message,
          });

          results.push({
            type: 'mannequin',
            index: i,
            urls: [imagesToProcess[i]],
          });
        }
      }
    }

    if (operation === 'extract_data' || operation === 'all') {
      const startTime = Date.now();
      try {
        if (useRealAPI) {
          extractedData = await extractProductData(nanoBananaApiKey, images);
        } else {
          extractedData = {
            title: 'Calça Jeans Masculina Preta Slim Fit Premium',
            description: 'Calça jeans masculina em tecido denim premium com modelagem slim fit. Cor preta versátil, ideal para diversas ocasiões. Acabamento de qualidade com costuras reforçadas.',
            category: 'Moda Masc > Calças',
            colors: ['Preto'],
            material: 'Jeans/Denim',
          };
        }

        const duration = Date.now() - startTime;
        logs.push({
          user_id: user.id,
          product_id: productId,
          api_provider: useRealAPI ? 'nano_banana' : 'mock',
          operation_type: 'extract_data',
          input_data: { images_count: images.length, using_real_api: useRealAPI },
          output_data: extractedData,
          cost: useRealAPI ? 0.02 : 0,
          duration_ms: duration,
          status: 'success',
        });

        results.push({
          type: 'extracted_data',
          data: extractedData,
        });
      } catch (error) {
        const duration = Date.now() - startTime;

        extractedData = {
          title: 'Produto',
          description: 'Descrição do produto',
          category: 'Geral',
          colors: [],
          material: 'Não especificado',
        };

        logs.push({
          user_id: user.id,
          product_id: productId,
          api_provider: 'nano_banana',
          operation_type: 'extract_data',
          input_data: {},
          output_data: {},
          cost: 0,
          duration_ms: duration,
          status: 'error',
          error_message: error.message,
        });

        results.push({
          type: 'extracted_data',
          data: extractedData,
        });
      }
    }

    const { error: logError } = await supabase
      .from('ai_processing_logs')
      .insert(logs);

    if (logError) {
      console.error('Error saving logs:', logError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        results,
        total_cost: logs.reduce((sum, log) => sum + log.cost, 0),
        total_duration_ms: logs.reduce((sum, log) => sum + log.duration_ms, 0),
        using_real_api: useRealAPI,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});

import { createClient } from 'npm:@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface ProcessImageRequest {
  images: string[]; // base64 images
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

    // Get user from auth header
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

    // Process each image based on operation
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const startTime = Date.now();

      if (operation === 'remove_background' || operation === 'all') {
        try {
          // TODO: Replace with actual Nano Banana API call
          // For now, mock the response
          const mockResult = {
            original: image,
            background_removed: image, // In production, this would be the processed image
            confidence: 0.95,
          };

          const duration = Date.now() - startTime;

          logs.push({
            user_id: user.id,
            product_id: productId,
            api_provider: 'nano_banana',
            operation_type: 'remove_background',
            input_data: { image_index: i },
            output_data: { success: true, confidence: mockResult.confidence },
            cost: 0.0025,
            duration_ms: duration,
            status: 'success',
          });

          results.push({
            type: 'background_removed',
            index: i,
            url: mockResult.background_removed,
          });
        } catch (error) {
          const duration = Date.now() - startTime;
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
        }
      }

      if (operation === 'generate_mannequin' || operation === 'all') {
        try {
          // TODO: Replace with actual Nano Banana API call for mannequin generation
          const mockResult = {
            original: image,
            mannequin_variants: [image, image, image], // In production, generated variants
          };

          const duration = Date.now() - startTime;

          logs.push({
            user_id: user.id,
            product_id: productId,
            api_provider: 'nano_banana',
            operation_type: 'generate_mannequin',
            input_data: { image_index: i, description: mannequinDescription },
            output_data: { success: true, variants_count: mockResult.mannequin_variants.length },
            cost: 0.01,
            duration_ms: duration,
            status: 'success',
          });

          results.push({
            type: 'mannequin',
            index: i,
            urls: mockResult.mannequin_variants,
          });
        } catch (error) {
          const duration = Date.now() - startTime;
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
        }
      }
    }

    // Extract product data from first image if requested
    if (operation === 'extract_data' || operation === 'all') {
      const startTime = Date.now();
      try {
        // TODO: Replace with actual Nano Banana vision API call
        const mockExtraction = {
          title: 'Calça Jeans Masculina Preta Slim Fit Premium',
          description: 'Calça jeans masculina em tecido denim premium com modelagem slim fit. Cor preta versátil, ideal para diversas ocasiões. Acabamento de qualidade com costuras reforçadas.',
          category: 'Moda Masc > Calças',
          colors: ['Preto'],
          material: 'Jeans/Denim',
        };

        const duration = Date.now() - startTime;

        logs.push({
          user_id: user.id,
          product_id: productId,
          api_provider: 'nano_banana',
          operation_type: 'extract_data',
          input_data: { images_count: images.length },
          output_data: mockExtraction,
          cost: 0.02,
          duration_ms: duration,
          status: 'success',
        });

        results.push({
          type: 'extracted_data',
          data: mockExtraction,
        });
      } catch (error) {
        const duration = Date.now() - startTime;
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
      }
    }

    // Save all logs to database
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

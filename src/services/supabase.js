import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('🔐 Supabase Config Check:', {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
  urlPreview: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'MISSING',
  keyPreview: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'MISSING'
});

if (!supabaseUrl || !supabaseAnonKey) {
  const errorMsg = `❌ Missing Supabase environment variables!\n` +
    `URL: ${supabaseUrl ? 'OK' : 'MISSING'}\n` +
    `Key: ${supabaseAnonKey ? 'OK' : 'MISSING'}\n\n` +
    `Please configure these in Vercel:\n` +
    `VITE_SUPABASE_URL=https://jnqynypefthinysddrka.supabase.co\n` +
    `VITE_SUPABASE_ANON_KEY=eyJhbGci...`;

  console.error(errorMsg);

  // Show user-friendly error
  if (typeof document !== 'undefined') {
    document.body.innerHTML = `
      <div style="padding: 20px; font-family: system-ui; max-width: 600px; margin: 50px auto;">
        <h1 style="color: #dc2626;">⚠️ Configuração Incompleta</h1>
        <p>As variáveis de ambiente do Supabase não estão configuradas.</p>
        <p>Configure no Vercel:</p>
        <pre style="background: #f3f4f6; padding: 15px; border-radius: 8px; overflow-x: auto;">
VITE_SUPABASE_URL=https://jnqynypefthinysddrka.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpucXlueXBlZnRoaW55c2RkcmthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5ODExOTUsImV4cCI6MjA3NjU1NzE5NX0.WEJk5IiWyJqaaiNh0-jsEL0a5R1ry3hQ1N0U4eBm45k</pre>
        <p style="margin-top: 20px;">
          <a href="https://vercel.com" style="color: #0066cc;">→ Abrir Vercel Dashboard</a>
        </p>
      </div>
    `;
  }

  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const authService = {
  async signUp(email, password, fullName) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: undefined,
      },
    });

    if (error) throw error;

    if (data.user) {
      try {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              email: data.user.email,
              full_name: fullName,
            },
          ]);

        if (profileError && !profileError.message.includes('duplicate')) {
          console.error('Profile creation error:', profileError);
        }
      } catch (e) {
        console.error('Profile insert failed:', e);
      }
    }

    return data;
  },

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  async getProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async updateProfile(userId, updates) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  },
};

export const productsService = {
  async createProduct(productData) {
    const user = await authService.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('products')
      .insert([
        {
          ...productData,
          user_id: user.id,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getProducts(filters = {}) {
    const user = await authService.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    let query = supabase
      .from('products')
      .select('*, product_images(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    if (filters.marketplace) {
      query = query.eq('marketplace', filters.marketplace);
    }

    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  },

  async getProduct(productId) {
    const { data, error } = await supabase
      .from('products')
      .select('*, product_images(*)')
      .eq('id', productId)
      .single();

    if (error) throw error;
    return data;
  },

  async updateProduct(productId, updates) {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', productId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteProduct(productId) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) throw error;
  },

  async uploadProductImage(productId, file, orderIndex = 0) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${productId}_${orderIndex}_${Date.now()}.${fileExt}`;
    const filePath = `product-images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('products')
      .getPublicUrl(filePath);

    const { data, error } = await supabase
      .from('product_images')
      .insert([
        {
          product_id: productId,
          image_url: publicUrl,
          order_index: orderIndex,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getStats() {
    const user = await authService.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const { data: products, error } = await supabase
      .from('products')
      .select('status, marketplace')
      .eq('user_id', user.id);

    if (error) throw error;

    const stats = {
      total: products.length,
      active: products.filter(p => p.status === 'active').length,
      paused: products.filter(p => p.status === 'paused').length,
      draft: products.filter(p => p.status === 'draft').length,
      mercadoLivre: products.filter(p => p.marketplace === 'ml').length,
      shopee: products.filter(p => p.marketplace === 'shopee').length,
    };

    return stats;
  },
};

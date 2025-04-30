
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = 'https://xyhebqsgccwvmigqkwam.supabase.co';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Find products that have been out of stock for more than 4 days
    const fourDaysAgo = new Date();
    fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);

    const { data: productsToClean, error: fetchError } = await supabase
      .from('product_stock_tracking')
      .select('product_id, marketplace_products!inner(images)')
      .lt('zero_stock_date', fourDaysAgo.toISOString())
      .not('marketplace_products.images', 'eq', '{}');

    if (fetchError) throw fetchError;

    console.log(`Found ${productsToClean?.length || 0} products to clean up`);

    if (productsToClean && productsToClean.length > 0) {
      for (const record of productsToClean) {
        const product = record.marketplace_products;
        if (product.images && product.images.length > 0) {
          // Update the product to remove image references
          const { error: updateError } = await supabase
            .from('marketplace_products')
            .update({ images: [] })
            .eq('id', record.product_id);

          if (updateError) {
            console.error(`Error updating product ${record.product_id}:`, updateError);
            continue;
          }

          console.log(`Cleaned up images for product ${record.product_id}`);
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        message: 'Cleanup completed successfully', 
        products_cleaned: productsToClean?.length || 0 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in cleanup-empty-stock-images function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    );
  }
});

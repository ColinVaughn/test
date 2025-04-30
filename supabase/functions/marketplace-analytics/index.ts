
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    
    if (!supabaseUrl || !supabaseKey) {
      return new Response(
        JSON.stringify({ error: "Missing required environment variables" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Check authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    // Get the JWT token
    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData) {
      return new Response(
        JSON.stringify({ error: "Invalid authorization" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    // Get the seller profile
    const { data: sellerData, error: sellerError } = await supabase
      .from('marketplace_sellers')
      .select('id')
      .eq('user_id', userData.user.id)
      .single();

    if (sellerError || !sellerData) {
      return new Response(
        JSON.stringify({ error: "Seller profile not found" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
      );
    }

    const sellerId = sellerData.id;
    const data = await req.json();
    const { timeframe, metric } = data;
    
    // Parse dates for timeframe
    const now = new Date();
    let startDate = new Date();
    
    switch (timeframe) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 30); // Default to 30 days
    }

    // Format dates for SQL query
    const startDateStr = startDate.toISOString();
    const endDateStr = now.toISOString();

    let analyticsData;
    
    switch (metric) {
      case 'revenue':
        // Get total sales, revenue, and orders over time
        const { data: salesData, error: salesError } = await supabase
          .from('marketplace_orders')
          .select('created_at, total_price, seller_payout')
          .eq('seller_id', sellerId)
          .gte('created_at', startDateStr)
          .lte('created_at', endDateStr)
          .order('created_at', { ascending: true });

        if (salesError) {
          return new Response(
            JSON.stringify({ error: `Database error: ${salesError.message}` }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
          );
        }

        analyticsData = {
          timeSeriesData: salesData,
          summary: {
            totalOrders: salesData.length,
            totalRevenue: salesData.reduce((sum, order) => sum + order.total_price, 0),
            totalPayout: salesData.reduce((sum, order) => sum + order.seller_payout, 0),
          }
        };
        break;

      case 'products':
        // Get product performance stats
        const { data: productData, error: productError } = await supabase
          .from('marketplace_orders')
          .select(`
            product_id,
            quantity,
            marketplace_products (name, price, category)
          `)
          .eq('seller_id', sellerId)
          .gte('created_at', startDateStr)
          .lte('created_at', endDateStr);

        if (productError) {
          return new Response(
            JSON.stringify({ error: `Database error: ${productError.message}` }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
          );
        }

        // Process product data to get top products
        const productSummary = {};
        productData.forEach(order => {
          if (!productSummary[order.product_id]) {
            productSummary[order.product_id] = {
              id: order.product_id,
              name: order.marketplace_products?.name || 'Unknown Product',
              totalQuantity: 0,
              totalRevenue: 0,
              category: order.marketplace_products?.category || 'Unknown',
              price: order.marketplace_products?.price || 0
            };
          }
          
          productSummary[order.product_id].totalQuantity += order.quantity;
          productSummary[order.product_id].totalRevenue += (order.quantity * productSummary[order.product_id].price);
        });

        analyticsData = {
          productPerformance: Object.values(productSummary).sort((a, b) => b.totalRevenue - a.totalRevenue)
        };
        break;

      case 'inventory':
        // Get inventory status
        const { data: inventoryData, error: inventoryError } = await supabase
          .from('marketplace_products')
          .select('id, name, stock_quantity, price, category')
          .eq('seller_id', sellerId);

        if (inventoryError) {
          return new Response(
            JSON.stringify({ error: `Database error: ${inventoryError.message}` }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
          );
        }

        // Calculate low stock items (< 5 items)
        const lowStockItems = inventoryData.filter(item => item.stock_quantity < 5);
        
        // Calculate out of stock items
        const outOfStockItems = inventoryData.filter(item => item.stock_quantity === 0);
        
        analyticsData = {
          inventoryStatus: inventoryData,
          summary: {
            totalProducts: inventoryData.length,
            lowStockItems: lowStockItems.length,
            outOfStockItems: outOfStockItems.length,
            averageStock: inventoryData.reduce((sum, item) => sum + item.stock_quantity, 0) / inventoryData.length
          }
        };
        break;

      default:
        return new Response(
          JSON.stringify({ error: "Invalid metric requested" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
        );
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        metric,
        timeframe,
        data: analyticsData
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('Error in marketplace-analytics function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});


import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Stripe } from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import { corsHeaders, generateCustomPCDescription, generateStripeMetadata } from "./utils.ts";
import { createOrder } from "./orderService.ts";
import type { CheckoutData } from "./types.ts";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { configuration } = await req.json()

    if (!configuration) {
      return new Response(JSON.stringify({ message: "Missing configuration" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const origin = req.headers.get('origin')
    if (!origin) {
      return new Response(JSON.stringify({ message: "Missing origin" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Creating Stripe checkout session for:", configuration.name);
    console.log("Configuration includes addresses:", !!configuration.addresses);
    
    // Extract userId from authorization header if available
    let userId = null;
    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      try {
        const supabaseClient = createClient(
          Deno.env.get("SUPABASE_URL") ?? "",
          Deno.env.get("SUPABASE_ANON_KEY") ?? ""
        );
        const { data, error } = await supabaseClient.auth.getUser(token);
        if (!error && data.user) {
          userId = data.user.id;
          console.log("Authenticated user:", userId);
        }
      } catch (authError) {
        console.error("Auth error:", authError);
      }
    }
    
    // Generate detailed description and metadata for Stripe
    let productDescription = '';
    
    // Handle cart checkout with multiple items
    if (Array.isArray(configuration.details)) {
      console.log("Processing cart checkout with multiple items:", configuration.details.length);
      
      // Build a comprehensive description of all items
      productDescription = configuration.details.map((item, index) => {
        const itemNumber = index + 1;
        
        // For custom PC configurations
        if (item.product_type === 'custom' && item.configuration) {
          const pcConfig = item.configuration;
          const components = [];
          
          if (pcConfig.cpu) components.push(`CPU: ${pcConfig.cpu.name}`);
          if (pcConfig.gpu) components.push(`GPU: ${pcConfig.gpu.name}`);
          if (pcConfig.ram) {
            const ramDetails = pcConfig.ram.selectedRamSize 
              ? `${pcConfig.ram.name} (${pcConfig.ram.selectedRamSize.size})`
              : pcConfig.ram.name;
            components.push(`RAM: ${ramDetails}`);
          }
          if (pcConfig.motherboard) components.push(`Motherboard: ${pcConfig.motherboard.name}`);
          if (pcConfig.storage) components.push(`Storage: ${pcConfig.storage.name}`);
          if (pcConfig.case) {
            const caseDetails = pcConfig.case.selectedColor
              ? `${pcConfig.case.name} (${pcConfig.case.selectedColor.name})`
              : pcConfig.case.name;
            components.push(`Case: ${caseDetails}`);
          }
          if (pcConfig.psu) components.push(`PSU: ${pcConfig.psu.name}`);
          if (pcConfig.cooler) components.push(`Cooling: ${pcConfig.cooler.name}`);
          
          return `Item ${itemNumber}: ${item.product_name}\n${components.join('\n')}`;
        }
        
        // For marketplace items
        else if (item.product_type === 'marketplace') {
          const details = item.details || {};
          return `Item ${itemNumber}: ${item.product_name}\nSeller: ${details.seller || 'Unknown'}\nCondition: ${details.condition || 'Not specified'}`;
        }
        
        // For other items
        return `Item ${itemNumber}: ${item.product_name}`;
      }).join('\n\n');
    }
    // Handle single PC configuration or prebuilt
    else if (configuration.pcConfiguration || configuration.components) {
      productDescription = generateCustomPCDescription(configuration.pcConfiguration || {}, configuration.components);
    }
    // Use default description
    else {
      productDescription = configuration.description || '';
    }
    
    const productMetadata = generateStripeMetadata(configuration);
    console.log("Product metadata for Stripe:", productMetadata);
    
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
      apiVersion: "2023-10-16",
    });

    // Sanitize image URL - validate it properly
    let validImageUrl = null;
    const imageUrl = configuration.imageUrl || '';
    
    // Only use URLs that start with http/https and don't have null/undefined
    if (imageUrl && typeof imageUrl === 'string' && 
        (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) &&
        !imageUrl.includes('undefined') && !imageUrl.includes('null')) {
      validImageUrl = imageUrl;
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      payment_intent_data: {
        setup_future_usage: 'off_session',
        metadata: productMetadata
      },
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'],
      },
      billing_address_collection: 'auto',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: configuration.name,
              description: productDescription,
              images: validImageUrl ? [validImageUrl] : [],
              metadata: productMetadata
            },
            unit_amount: Math.round(configuration.price * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancelled`, // Changed from /checkout/cancelled to /cancelled
    });

    if (!session.url || !session.id) {
      return new Response(JSON.stringify({ message: "Failed to create Stripe session" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    try {
      await createOrder(configuration, session.id, userId);
      console.log("Order successfully created for session:", session.id);
    } catch (error) {
      console.error("Error creating order:", error);
      return new Response(JSON.stringify({ message: "Failed to create order", error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
})

// Import Supabase SDK from URL (required for Deno edge functions)
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

// Define necessary types inline instead of importing from src/integrations/supabase/types
type Database = {
  public: {
    Tables: {
      orders: {
        Row: {
          id: string;
          total: number;
          status: string;
          paypal_order_id: string | null;
          coupon_code: string | null;
          affiliate_code: string | null;
          updated_at: string | null;
        }
      },
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          product_name: string;
          quantity: number;
          price: number;
          product_details: Record<string, any> | null;
        }
      },
      payment_transactions: {
        Row: {
          id: string;
          order_id: string;
          amount: number;
          status: string;
          payment_method: string;
          transaction_id: string | null;
          customer_email: string | null;
        }
      }
    }
  }
}

// Define the checkout data type
export type CheckoutData = {
  id: string;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  addresses?: any;
  promoCode?: string;
  accessories?: string[];
  affiliateCode?: string | null;
  couponCode?: string | null;
  pcConfiguration?: Record<string, any> | null;
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Initialize Supabase client with SERVICE_ROLE key to bypass RLS policies
const supabaseClient = createClient<Database>(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// PayPal API credentials
const PAYPAL_CLIENT_ID = Deno.env.get('PAYPAL_CLIENT_ID')!;
const PAYPAL_CLIENT_SECRET = Deno.env.get('PAYPAL_CLIENT_SECRET')!;
const PAYPAL_API_URL = 'https://api-m.paypal.com'; // Production URL

async function getPayPalAccessToken() {
  console.log("Attempting PayPal authentication...");
  
  const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`)}`
    },
    body: 'grant_type=client_credentials'
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    console.error("PayPal authentication failed:", data);
    throw new Error(`PayPal authentication failed: ${data.error_description}`);
  }
  
  console.log("PayPal access token obtained successfully");
  return data.access_token;
}

async function createPayPalOrder(configuration: CheckoutData, origin: string) {
  try {
    // Get PayPal access token
    const accessToken = await getPayPalAccessToken();
    
    // Calculate price details
    const rawTotalPrice = configuration.price;
    console.log("Raw total price:", rawTotalPrice);
    
    // Calculate additional fees (assembly, shipping, tax, processing fee)
    const assemblyFee = 99;
    const shippingFee = 60; 
    const subtotal = rawTotalPrice + assemblyFee;
    const tax = Math.round(subtotal * 0.08); // Assuming 8% tax
    const processingFee = Math.round(rawTotalPrice * 0.03); // 3% processing fee
    const finalTotal = subtotal + shippingFee + tax + processingFee;
    
    const priceDetails = {
      totalPrice: rawTotalPrice,
      assemblyFee,
      shippingFee,
      tax,
      processingFee,
      finalTotal
    };
    
    console.log("Price calculation:", priceDetails);
    
    // Create a detailed description for PayPal
    let description = configuration.description || "Custom PC Configuration";
    
    // If we have cart items in details, generate a more detailed description
    if (Array.isArray(configuration.details) && configuration.details.length > 0) {
      const cartItems = configuration.details;
      description = `Cart with ${cartItems.length} item(s):\n` + 
        cartItems.map((item, i) => {
          let itemDesc = `${i+1}. ${item.product_name}`;
          
          if (item.product_type === 'custom' && item.configuration) {
            const components = [];
            const config = item.configuration;
            
            if (config.cpu) components.push(`CPU: ${config.cpu.name}`);
            if (config.gpu) components.push(`GPU: ${config.gpu.name}`);
            if (config.ram) {
              let ramDesc = config.ram.name;
              if (config.ram.selectedRamSize) {
                ramDesc += ` (${config.ram.selectedRamSize.size})`;
              }
              components.push(`RAM: ${ramDesc}`);
            }
            
            if (components.length > 0) {
              itemDesc += ` - ${components.join(', ')}`;
            }
          } else if (item.product_type === 'marketplace' && item.details) {
            itemDesc += ` - Seller: ${item.details.seller || 'Unknown'}, Condition: ${item.details.condition || 'Not specified'}`;
          }
          
          return itemDesc;
        }).join('\n');
    }
    
    // Create PayPal order
    const orderData = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: finalTotal.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: rawTotalPrice.toFixed(2)
              },
              shipping: {
                currency_code: "USD",
                value: shippingFee.toFixed(2)
              },
              handling: {
                currency_code: "USD",
                value: (assemblyFee + processingFee).toFixed(2)
              },
              tax_total: {
                currency_code: "USD",
                value: tax.toFixed(2)
              }
            }
          },
          description: description,
          items: [
            {
              name: configuration.name,
              description: description.substring(0, 127), // PayPal has a 127 character limit
              quantity: "1",
              unit_amount: {
                currency_code: "USD",
                value: rawTotalPrice.toFixed(2)
              },
              category: "DIGITAL_GOODS"
            }
          ]
        }
      ],
      application_context: {
        return_url: `${origin}/order-success`,
        cancel_url: `${origin}/prebuilt?canceled=true`
      }
    };
    
    const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(orderData)
    });
    
    const orderResponse = await response.json();
    
    if (!response.ok) {
      console.error("PayPal order creation failed:", orderResponse);
      throw new Error(`PayPal order creation failed: ${JSON.stringify(orderResponse)}`);
    }
    
    console.log("PayPal order response:", JSON.stringify(orderResponse));
    console.log("PayPal order created successfully:", orderResponse.id);
    
    return orderResponse;
  } catch (error) {
    console.error("Error creating PayPal order:", error);
    throw error;
  }
}

async function createOrder(configuration: CheckoutData, paypalOrderId: string, userId?: string) {
  try {
    console.log("Creating order with configuration:", JSON.stringify(configuration));
    console.log("PayPal Order ID:", paypalOrderId);
    console.log("User ID:", userId || "No user ID provided (guest checkout)");
    
    // Create a customer email based on shipping info or a fallback
    const customerEmail = configuration.addresses?.shipping?.email || 
                         configuration.addresses?.shipping?.name?.replace(/\s+/g, '.').toLowerCase() + '@placeholder.com' || 
                         `customer-${Date.now()}@placeholder.com`;
    
    // Check if this is a cart checkout with multiple items
    const isCartCheckout = Array.isArray(configuration.details) && configuration.details.length > 0;
    
    // Determine if this is a custom PC or prebuilt for single item checkout
    const isCustomPC = !isCartCheckout && !!configuration.pcConfiguration;
    console.log("Product type:", isCartCheckout ? "Cart Checkout" : (isCustomPC ? "Custom PC" : "Prebuilt PC"));
    
    const { data, error } = await supabaseClient
      .from('orders')
      .insert({
        total: configuration.price,
        status: 'pending',
        paypal_order_id: paypalOrderId,
        coupon_code: configuration.couponCode || null,
        affiliate_code: configuration.affiliateCode || null,
        user_id: userId || null, // Set user_id if available
        updated_at: new Date().toISOString()
      })
      .select();
      
    if (error) {
      console.error("Error creating order:", error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.error("No order data returned after insert");
      throw new Error("Failed to create order: No data returned");
    }

    // Create order item
    const order = data[0];
    console.log("Order created:", order);
    
    if (isCartCheckout) {
      // For cart checkout with multiple items, create multiple order items
      const cartItems = configuration.details as any[];
      
      for (const item of cartItems) {
        let productDetails: Record<string, any> = {};
        
        if (item.product_type === 'custom' && item.configuration) {
          // For custom PCs, extract component details properly
          const pcConfig = item.configuration;
          const componentData: Record<string, any> = {};
          
          if (pcConfig.cpu) {
            componentData.cpu = {
              name: pcConfig.cpu.name,
              brand: pcConfig.cpu.brand
            };
          }
          
          if (pcConfig.gpu) {
            componentData.gpu = {
              name: pcConfig.gpu.name,
              brand: pcConfig.gpu.brand
            };
          }
          
          if (pcConfig.ram) {
            componentData.ram = {
              name: pcConfig.ram.name,
              brand: pcConfig.ram.brand,
              size: pcConfig.ram.selectedSize?.size || "",
              modules: pcConfig.ram.selectedSize?.modules || ""
            };
          }
          
          if (pcConfig.motherboard) {
            componentData.motherboard = {
              name: pcConfig.motherboard.name,
              brand: pcConfig.motherboard.brand
            };
          }
          
          if (pcConfig.storage) {
            componentData.storage = {
              name: pcConfig.storage.name,
              brand: pcConfig.storage.brand
            };
          }
          
          if (pcConfig.case) {
            componentData.case = {
              name: pcConfig.case.name,
              brand: pcConfig.case.brand
            };
          }
          
          if (pcConfig.psu) {
            componentData.psu = {
              name: pcConfig.psu.name,
              brand: pcConfig.psu.brand
            };
          }
          
          if (pcConfig.cooler) {
            componentData.cooler = {
              name: pcConfig.cooler.name,
              brand: pcConfig.cooler.brand
            };
          }
          
          if (pcConfig.os) {
            componentData.os = {
              name: pcConfig.os.name
            };
          }
          
          if (pcConfig.fans && pcConfig.fans.component) {
            componentData.fans = {
              quantity: pcConfig.fans.quantity,
              component: {
                name: pcConfig.fans.component.name,
                brand: pcConfig.fans.component.brand
              }
            };
          }
          
          // Add product_type marker
          productDetails = { 
            product_type: 'custom',
            ...componentData
          };
        } else if (item.product_type === 'marketplace' && item.details) {
          productDetails = { 
            product_type: 'marketplace',
            ...item.details
          };
        }
        
        // Create order item
        const { error: itemError } = await supabaseClient
          .from('order_items')
          .insert({
            order_id: order.id,
            product_id: item.product_id,
            product_name: item.product_name,
            quantity: item.quantity,
            price: item.price,
            product_details: productDetails
          });
        
        if (itemError) {
          console.error(`Error creating order item for ${item.product_name}:`, itemError);
          // Continue with other items despite errors
        }
      }
    } else {
      // For single item checkout (custom PC or prebuilt)
      // Prepare product details based on whether it's a custom PC or prebuilt
      let productDetails: any;
      
      if (isCustomPC && configuration.pcConfiguration) {
        // For custom PCs, extract component details properly
        const pcConfig = configuration.pcConfiguration;
        const componentData: Record<string, any> = {};
        
        if (pcConfig.cpu) {
          componentData.cpu = {
            name: pcConfig.cpu.name,
            brand: pcConfig.cpu.brand
          };
        }
        
        if (pcConfig.gpu) {
          componentData.gpu = {
            name: pcConfig.gpu.name,
            brand: pcConfig.gpu.brand
          };
        }
        
        if (pcConfig.ram) {
          componentData.ram = {
            name: pcConfig.ram.name,
            brand: pcConfig.ram.brand,
            size: pcConfig.ram.selectedSize?.size || "",
            modules: pcConfig.ram.selectedSize?.modules || ""
          };
        }
        
        if (pcConfig.motherboard) {
          componentData.motherboard = {
            name: pcConfig.motherboard.name,
            brand: pcConfig.motherboard.brand
          };
        }
        
        if (pcConfig.storage) {
          componentData.storage = {
            name: pcConfig.storage.name,
            brand: pcConfig.storage.brand
          };
        }
        
        if (pcConfig.case) {
          componentData.case = {
            name: pcConfig.case.name,
            brand: pcConfig.case.brand
          };
        }
        
        if (pcConfig.psu) {
          componentData.psu = {
            name: pcConfig.psu.name,
            brand: pcConfig.psu.brand
          };
        }
        
        if (pcConfig.cooler) {
          componentData.cooler = {
            name: pcConfig.cooler.name,
            brand: pcConfig.cooler.brand
          };
        }
        
        if (pcConfig.os) {
          componentData.os = {
            name: pcConfig.os.name
          };
        }
        
        if (pcConfig.fans && pcConfig.fans.component) {
          componentData.fans = {
            quantity: pcConfig.fans.quantity,
            component: {
              name: pcConfig.fans.component.name,
              brand: pcConfig.fans.component.brand
            }
          };
        }
        
        // Add product_type marker
        productDetails = { 
          product_type: 'custom',
          ...componentData
        };
      } else {
        // For prebuilt PCs, extract specs from description or use defaults
        productDetails = { 
          product_type: 'prebuilt',
          cpu: configuration.description?.includes('CPU') ? configuration.description.split('CPU:')[1]?.split(',')[0]?.trim() : undefined,
          gpu: configuration.description?.includes('GPU') ? configuration.description.split('GPU:')[1]?.split(',')[0]?.trim() : undefined,
          ram: configuration.description?.includes('RAM') ? configuration.description.split('RAM:')[1]?.split(',')[0]?.trim() : undefined,
          storage: configuration.description?.includes('Storage') ? configuration.description.split('Storage:')[1]?.split(',')[0]?.trim() : undefined
        };
      }
      
      console.log("Saving product details:", JSON.stringify(productDetails));
      
      const { error: itemError } = await supabaseClient
        .from('order_items')
        .insert([
          {
            order_id: order.id,
            product_id: configuration.id,
            product_name: isCustomPC ? "Custom Gaming PC" : configuration.name,
            quantity: 1,
            price: configuration.price,
            product_details: productDetails
          }
        ]);

      if (itemError) {
        console.error("Error creating order item:", itemError);
        throw itemError;
      }
    }
    
    // Create payment transaction record with customer email
    const { error: paymentError } = await supabaseClient
      .from('payment_transactions')
      .insert([
        {
          order_id: order.id,
          amount: configuration.price,
          status: 'pending',
          payment_method: 'paypal',
          transaction_id: paypalOrderId,
          customer_email: customerEmail
        }
      ]);
      
    if (paymentError) {
      console.error("Error creating payment transaction:", paymentError);
      // Continue despite payment transaction error - we'll log it but not fail the order
      console.log("Continuing with order creation despite payment transaction error");
    }

    // Send order confirmation email
    try {
      await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/order-notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
        },
        body: JSON.stringify({
          type: 'order_placed',
          email: configuration.addresses?.shipping?.email || customerEmail,
          orderDetails: {
            orderId: order.id,
            items: [{
              name: configuration.name,
              quantity: 1,
              price: configuration.price
            }],
            total: configuration.price,
            customerName: configuration.addresses?.shipping?.name
          }
        })
      });
    } catch (emailError) {
      console.error('Error sending order confirmation email:', emailError);
      // Continue with order creation even if email fails
    }

    return order;
  } catch (error) {
    console.error("Failed to create order:", error);
    throw error;
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { configuration } = await req.json() as { configuration: CheckoutData };
    const origin = req.headers.get('origin') || 'https://pixel-forge-customizer.lovable.app';

    if (!configuration) {
      return new Response(JSON.stringify({ message: "Missing configuration" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Creating PayPal checkout for:", configuration.name);
    
    // Extract userId from authorization header if available
    let userId = null;
    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      try {
        const { data, error } = await supabaseClient.auth.getUser(token);
        if (!error && data.user) {
          userId = data.user.id;
          console.log("Authenticated user:", userId);
        }
      } catch (authError) {
        console.error("Auth error:", authError);
        // Continue with null userId (guest checkout)
      }
    }

    try {
      // Create a real PayPal order
      const paypalOrder = await createPayPalOrder(configuration, origin);
      const paypalOrderId = paypalOrder.id;
      
      // Find the PayPal approval URL
      const approvalUrl = paypalOrder.links.find((link: any) => link.rel === "approve")?.href;
      
      if (!approvalUrl) {
        throw new Error("PayPal approval URL not found in response");
      }
      
      // Create our internal order record
      const order = await createOrder(configuration, paypalOrderId, userId);
      console.log("Order successfully created for PayPal order:", paypalOrderId);
      
      // Create the final approval URL with proper parameters
      const finalApprovalUrl = new URL(approvalUrl);
      
      // Add our internal order_id to the approval URL
      finalApprovalUrl.searchParams.append('order_id', order.id);
      // Also add the PayPal order ID directly to ensure complete correlation
      finalApprovalUrl.searchParams.append('paypal_id', paypalOrderId);
      // Add token as an additional parameter to help with tracking
      finalApprovalUrl.searchParams.append('token', paypalOrderId);
      
      console.log("Final approval URL:", finalApprovalUrl.toString());
      
      // Return the PayPal approval URL for redirect
      return new Response(
        JSON.stringify({
          url: finalApprovalUrl.toString(),
          orderId: order.id,
          paypalOrderId: paypalOrderId
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } catch (error) {
      console.error("Error creating order:", error);
      return new Response(JSON.stringify({ message: "Failed to create order", error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (error: any) {
    console.error("PayPal checkout error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

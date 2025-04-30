import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import { Database, CheckoutData } from "./types.ts";
import { generateCustomPCDescription } from "./utils.ts";

export async function createOrder(
  configuration: CheckoutData,
  sessionId: string,
  userId?: string
) {
  try {
    console.log("Creating order with configuration:", JSON.stringify(configuration));
    console.log("Session ID:", sessionId);
    console.log("User ID:", userId || "No user ID provided (guest checkout)");
    
    const supabaseClient = createClient<Database>(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );
    
    // Determine if this is a cart checkout with multiple items
    const isCartCheckout = Array.isArray(configuration.details) && configuration.details.length > 0;
    
    // Determine if this is a custom PC or prebuilt
    const isCustomPC = !isCartCheckout && (!!configuration.pcConfiguration || !!configuration.components);
    console.log("Product type:", isCartCheckout ? "Cart Checkout" : (isCustomPC ? "Custom PC" : "Prebuilt PC"));
    
    // Create the order
    const { data, error } = await supabaseClient
      .from('orders')
      .insert([
        { 
          total: configuration.price,
          stripe_session_id: sessionId,
          status: 'pending',
          user_id: userId || null,
          updated_at: new Date().toISOString()
        }
      ])
      .select();
      
    if (error) {
      console.error("Error creating order:", error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.error("No order data returned after insert");
      throw new Error("Failed to create order: No data returned");
    }

    const order = data[0];
    console.log("Order created:", order);
    
    // Create order items based on checkout type
    if (isCartCheckout) {
      // For cart checkout, create multiple order items
      const cartItems = configuration.details as any[];
      
      for (const item of cartItems) {
        let productDetails: Record<string, any> = {};
        
        if (item.product_type === 'custom' && item.configuration) {
          productDetails = {
            product_type: 'custom',
            components: {}
          };
          
          // Process the configuration to extract component details
          const pcConfig = item.configuration;
          for (const [key, component] of Object.entries(pcConfig)) {
            if (!component || typeof component !== 'object') continue;
            
            // Skip non-component entries or fans which have special structure
            if (key === 'fans' || !('name' in component)) continue;
            
            // Create component entry
            productDetails.components[key] = {
              name: (component as any).name,
              brand: (component as any).brand || undefined,
              price: (component as any).price || undefined,
            };
            
            // Handle specific component options
            if (key === 'ram' && (component as any).selectedRamSize) {
              const ramSize = (component as any).selectedRamSize;
              productDetails.components[key].size = ramSize.size;
              productDetails.components[key].modules = ramSize.modules;
              
              if (ramSize.selectedColor) {
                productDetails.components[key].color = ramSize.selectedColor.name;
              }
            }
            
            if ((component as any).selectedColor) {
              productDetails.components[key].color = (component as any).selectedColor.name;
            }
            
            if (key === 'cooler') {
              if ((component as any).selectedCoolerColor) {
                productDetails.components[key].color = (component as any).selectedCoolerColor.name;
              }
              if ((component as any).selectedCoolerSize) {
                productDetails.components[key].size = (component as any).selectedCoolerSize.size;
              }
            }
          }
          
          // Handle fans separately
          if (pcConfig.fans && typeof pcConfig.fans === 'object' && 'quantity' in pcConfig.fans && pcConfig.fans.component) {
            productDetails.components.fans = {
              quantity: pcConfig.fans.quantity,
              name: pcConfig.fans.component.name,
            };
          }
        } else if (item.product_type === 'marketplace') {
          // For marketplace items
          productDetails = {
            product_type: 'marketplace',
            ...item.details
          };
        }
        
        // Create order item entry
        const { error: itemError } = await supabaseClient
          .from('order_items')
          .insert([
            {
              order_id: order.id,
              product_id: item.product_id,
              product_name: item.product_name,
              quantity: item.quantity,
              price: item.price,
              product_details: productDetails
            }
          ]);

        if (itemError) {
          console.error(`Error creating order item for ${item.product_name}:`, itemError);
          // Continue with other items despite errors
        }
      }
    } else {
      // For single item checkout (custom PC or prebuilt)
      let productDetails: Record<string, any> = {};
      
      if (isCustomPC) {
        productDetails.product_type = 'custom';
        
        if (configuration.components) {
          productDetails.components = configuration.components;
          console.log("Using preformatted component list:", configuration.components);
        }
        
        if (configuration.pcConfiguration) {
          // Process each component to capture details including colors and sizes
          Object.entries(configuration.pcConfiguration).forEach(([key, component]) => {
            if (!component || typeof component !== 'object') return;
            
            // Skip non-component entries or fans which have special structure
            if (key === 'fans' || !('id' in component)) return;
            
            // Create component entry 
            productDetails[key] = {
              id: component.id,
              name: component.name,
              brand: component.brand,
              price: component.price
            };
            
            // Handle case color
            if (component.selectedColor) {
              productDetails[key].color = component.selectedColor.name;
              productDetails[key].color_price = component.selectedColor.price;
              productDetails[key].color_hex = component.selectedColor.hexCode;
            }
            
            // Handle cooler specifics
            if (component.selectedCoolerColor) {
              productDetails[key].color = component.selectedCoolerColor.name;
              productDetails[key].color_price = component.selectedCoolerColor.price;
              productDetails[key].color_hex = component.selectedCoolerColor.hexCode;
            }
            
            if (component.selectedCoolerSize) {
              productDetails[key].size = component.selectedCoolerSize.size;
              productDetails[key].size_price = component.selectedCoolerSize.price;
            }
            
            // Handle RAM specifics
            if (key === 'ram' && component.selectedRamSize) {
              productDetails[key].size = component.selectedRamSize.size;
              productDetails[key].modules = component.selectedRamSize.modules;
              productDetails[key].speed = component.selectedRamSize.speed;
              productDetails[key].size_price = component.selectedRamSize.price;
              
              if (component.selectedRamSize.selectedColor) {
                productDetails[key].color = component.selectedRamSize.selectedColor.name;
                productDetails[key].color_price = component.selectedRamSize.selectedColor.price;
                productDetails[key].color_hex = component.selectedRamSize.selectedColor.hexCode;
              }
            }
          });
          
          // Handle fans separately due to different structure
          if (configuration.pcConfiguration.fans && typeof configuration.pcConfiguration.fans === 'object' && 'quantity' in configuration.pcConfiguration.fans && configuration.pcConfiguration.fans.component) {
            productDetails.fans = {
              quantity: configuration.pcConfiguration.fans.quantity,
              name: configuration.pcConfiguration.fans.component.name,
              brand: configuration.pcConfiguration.fans.component.brand,
              price: configuration.pcConfiguration.fans.component.price,
              total_price: configuration.pcConfiguration.fans.component.price * configuration.pcConfiguration.fans.quantity
            };
          }
        }
      } else {
        productDetails = { 
          product_type: 'prebuilt',
          cpu: configuration.description?.includes('CPU') ? configuration.description.split('CPU:')[1]?.split(',')[0]?.trim() : undefined,
          gpu: configuration.description?.includes('GPU') ? configuration.description.split('GPU:')[1]?.split(',')[0]?.trim() : undefined,
          ram: configuration.description?.includes('RAM') ? configuration.description.split('RAM:')[1]?.split(',')[0]?.trim() : undefined,
          storage: configuration.description?.includes('Storage') ? configuration.description.split('Storage:')[1]?.split(',')[0]?.trim() : undefined
        };
      }
      
      console.log("Saving product details:", JSON.stringify(productDetails));
      
      // Create order item
      const { error: itemError } = await supabaseClient
        .from('order_items')
        .insert([
          {
            order_id: order.id,
            product_id: configuration.id,
            product_name: configuration.name,
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

    // Store shipping information and customer metadata
    let zelleNotes = '';
    let customerMetadata: Record<string, any> = {};
    
    if (configuration.addresses?.shipping) {
      const shipping = configuration.addresses.shipping;
      
      if (shipping.address) {
        const address = shipping.address;
        const formattedAddress = `${address.line1}${address.line2 ? ', ' + address.line2 : ''}, ${address.city}, ${address.state} ${address.postal_code}`;
        zelleNotes = `Customer: ${shipping.name}. Shipping Address: ${formattedAddress}`;
        
        customerMetadata = {
          name: shipping.name,
          email: shipping.email || null,
          shipping_address: {
            line1: address.line1,
            line2: address.line2 || '',
            city: address.city,
            state: address.state,
            postal_code: address.postal_code,
            country: address.country || 'US'
          }
        };
      }
    }
    
    if (isCustomPC) {
      let componentsList = configuration.components 
        ? generateCustomPCDescription({}, configuration.components)
        : configuration.pcConfiguration 
          ? generateCustomPCDescription(configuration.pcConfiguration)
          : '';
      
      customerMetadata.components = componentsList;
      customerMetadata.component_count = configuration.components 
        ? Object.keys(configuration.components).length 
        : (configuration.pcConfiguration 
            ? Object.values(configuration.pcConfiguration).filter(Boolean).length 
            : 0);
      
      if (configuration.components) {
        customerMetadata.component_details = configuration.components;
      }
    }
    
    console.log("Customer metadata:", JSON.stringify(customerMetadata));
    
    // Create payment transaction
    const { error: paymentError } = await supabaseClient
      .from('payment_transactions')
      .insert([{
        order_id: order.id,
        amount: configuration.price,
        status: 'pending',
        payment_method: 'stripe',
        transaction_id: sessionId,
        customer_email: configuration.addresses?.shipping?.email || null,
        zelle_notes: zelleNotes || null,
        customer_metadata: Object.keys(customerMetadata).length > 0 ? customerMetadata : null
      }]);
      
    if (paymentError) {
      console.error("Error creating payment transaction:", paymentError);
      // Continue despite payment error to ensure the order is created
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
          email: configuration.addresses?.shipping?.email || 'customer@example.com',
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
    }

    return order;
  } catch (error) {
    console.error("Failed to create order:", error);
    throw error;
  }
}

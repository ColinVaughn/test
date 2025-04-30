
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.31.0";
import PDFDocument from "https://esm.sh/pdfkit@0.13.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { order } = await req.json();
    
    // Create PDF document
    const doc = new PDFDocument();
    let buffers: Uint8Array[] = [];
    
    doc.on('data', buffer => buffers.push(buffer));
    
    // Add content to PDF
    doc
      .fontSize(20)
      .text('Order Receipt', { align: 'center' })
      .moveDown()
      .fontSize(12);

    // Order details
    doc
      .text(`Order ID: ${order.id}`)
      .text(`Date: ${new Date().toLocaleDateString()}`)
      .moveDown()
      .text('Product Details:')
      .text(`Name: ${order.product.name}`)
      .text(`Price: $${order.product.price.toFixed(2)}`)
      .moveDown();

    // If product has components with selected colors, include that information
    if (order.product.components) {
      doc.text('Components:');
      
      Object.entries(order.product.components).forEach(([categoryId, component]) => {
        if (!component) return;
        
        doc.text(`- ${component.name} (${component.brand}): $${component.price.toFixed(2)}`);
        
        if (component.selectedColor) {
          doc.text(`  Color: ${component.selectedColor.name}`);
        }
      });
      
      doc.moveDown();
    }

    // Shipping address
    doc
      .text('Shipping Address:')
      .text(order.addresses.shipping.name)
      .text(order.addresses.shipping.address.line1)
      .text(order.addresses.shipping.address.line2 || '')
      .text(`${order.addresses.shipping.address.city}, ${order.addresses.shipping.address.state} ${order.addresses.shipping.address.postal_code}`)
      .text(order.addresses.shipping.address.country)
      .moveDown();

    // Payment details
    doc
      .text('Payment Details:')
      .text(`Subtotal: $${order.product.price.toFixed(2)}`)
      .text(`Shipping: $60.00`)
      .text(`Tax (8%): $${(order.product.price * 0.08).toFixed(2)}`)
      .text(`Total: $${(order.product.price * 1.08 + 60).toFixed(2)}`)
      .moveDown();

    // Finalize PDF
    doc.end();

    // Convert buffers to a single Uint8Array
    const pdfData = new Uint8Array(Buffer.concat(buffers));

    return new Response(pdfData, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=receipt.pdf"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

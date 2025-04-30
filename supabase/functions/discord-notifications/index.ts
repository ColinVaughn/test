
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"

const DISCORD_WEBHOOK_URL = Deno.env.get('DISCORD_WEBHOOK_URL')!

interface WebhookBody {
  name: string;
  price: number;
  category: string;
  description?: string;
  seller_name: string;
  status: string;
  images?: string[];
  product_url: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log("Received webhook request")
    
    const body = await req.json() as WebhookBody
    const { name, price, category, description, seller_name, status, images, product_url } = body;
    
    console.log("Processing webhook for:", { name, status, product_url })
    
    // Verify we have the webhook URL
    if (!DISCORD_WEBHOOK_URL) {
      console.error("Missing Discord webhook URL");
      throw new Error("Discord webhook URL not configured");
    }

    const embed = {
      title: "New Marketplace Listing",
      url: product_url,
      color: 0x00ff00,
      fields: [
        {
          name: "Product",
          value: name,
          inline: true
        },
        {
          name: "Price",
          value: `$${price.toFixed(2)}`,
          inline: true
        },
        {
          name: "Category",
          value: category,
          inline: true
        },
        {
          name: "Seller",
          value: seller_name,
          inline: true
        },
        {
          name: "Status",
          value: status,
          inline: true
        }
      ],
      description: description || "No description provided",
      timestamp: new Date().toISOString(),
      image: images?.length ? { url: images[0] } : undefined
    };

    const message = {
      embeds: [embed]
    };

    console.log("Sending Discord webhook with image:", images?.[0])
    
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(message)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Discord API error: ${response.status} - ${response.statusText}`, errorText);
      throw new Error(`Discord API error: ${response.statusText}`);
    }

    console.log("Discord webhook sent successfully")
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error sending Discord notification:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
})

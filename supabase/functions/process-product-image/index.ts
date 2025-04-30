
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const formData = await req.formData()
    const image = formData.get('image') as File
    
    if (!image) {
      throw new Error('No image provided')
    }

    // Create unique filename
    const timestamp = Date.now()
    const fileExt = image.name.split('.').pop()
    const filename = `${timestamp}-${image.name.replace(/\.[^/.]+$/, '')}.${fileExt}`

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!)

    // Upload original image
    // Note: We're not processing the image with Sharp anymore
    const arrayBuffer = await image.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    const { data, error } = await supabase
      .storage
      .from('marketplace-products')
      .upload(filename, buffer, {
        contentType: image.type,
        cacheControl: '3600'
      })

    if (error) throw error

    // Get public URL
    const publicUrl = supabase
      .storage
      .from('marketplace-products')
      .getPublicUrl(filename)
      .data
      .publicUrl

    return new Response(
      JSON.stringify({ url: publicUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error processing image:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

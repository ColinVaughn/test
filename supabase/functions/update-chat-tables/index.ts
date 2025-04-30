
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Supabase credentials are not set");
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Check if is_guest column exists
    const { data: columns, error: columnError } = await supabase
      .rpc('check_column_exists', { 
        p_table: 'chat_conversations', 
        p_column: 'is_guest' 
      });
    
    if (columnError) {
      throw columnError;
    }
    
    // If column doesn't exist, add it
    if (!columns || columns.length === 0) {
      const { error: alterError } = await supabase.query(`
        ALTER TABLE chat_conversations 
        ADD COLUMN IF NOT EXISTS is_guest BOOLEAN DEFAULT FALSE;
      `);
      
      if (alterError) {
        throw alterError;
      }
    }
    
    return new Response(
      JSON.stringify({ success: true, message: "Database updated successfully" }),
      { headers: { "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { "Content-Type": "application/json" }, status: 500 }
    );
  }
});

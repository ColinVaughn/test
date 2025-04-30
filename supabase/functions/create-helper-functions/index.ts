
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
    
    // Create helper function to check if column exists
    const { error: functionError } = await supabase.query(`
      CREATE OR REPLACE FUNCTION check_column_exists(p_table TEXT, p_column TEXT)
      RETURNS TABLE(column_name TEXT, data_type TEXT) AS
      $$
      BEGIN
        RETURN QUERY
        SELECT c.column_name::TEXT, c.data_type::TEXT
        FROM information_schema.columns c
        WHERE c.table_schema = 'public'
        AND c.table_name = p_table
        AND c.column_name = p_column;
      END;
      $$ LANGUAGE plpgsql;
    `);
    
    if (functionError) {
      throw functionError;
    }
    
    return new Response(
      JSON.stringify({ success: true, message: "Helper functions created successfully" }),
      { headers: { "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { "Content-Type": "application/json" }, status: 500 }
    );
  }
});

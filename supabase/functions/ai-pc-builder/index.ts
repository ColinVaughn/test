// This is the Supabase Edge Function that leverages OpenAI to generate PC build recommendations
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Get environment variables
const openAiApiKey = Deno.env.get("OPENAI_API_KEY");
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";

// CORS headers for cross-origin requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type ComponentOption = {
  id: string;
  name: string;
  price: number;
  wattage?: number;
  specs?: Record<string, any>;
  coolingCapacity?: number;
};

interface RequestBody {
  budget: number;
  games: string[];
  prioritizeLooks: boolean;
  targetResolution: string;
  primaryUse: string;
  targetFps: number;
  powerCalculation?: {
    strategy: string;
    description: string;
  };
  availableComponents: {
    cpu: ComponentOption[];
    gpu: ComponentOption[];
    motherboard: ComponentOption[];
    ram: ComponentOption[];
    storage: ComponentOption[];
    cooler: ComponentOption[];
    case: ComponentOption[];
    psu: ComponentOption[];
  };
}

// Calculate total power requirements and recommended PSU wattage
const calculateSystemPowerRequirements = (
  cpu?: ComponentOption,
  gpu?: ComponentOption,
  extraComponents = true
) => {
  // Calculate GPU wattage with headroom for power spikes
  const gpuWattage = gpu?.wattage || 0;
  const gpuHeadroom = Math.round(gpuWattage * 0.3);
  
  // Calculate total wattage
  const baseWattage = 
    (cpu?.wattage || 0) + 
    (gpuWattage + gpuHeadroom) + 
    (extraComponents ? 135 : 0); // 25W RAM + 10W storage + 100W base
  
  // Add overall headroom for future upgrades
  const recommendedWattage = Math.ceil(baseWattage * 1.3 / 50) * 50; // Round up to nearest 50W
  
  return {
    baseWattage,
    recommendedWattage,
  };
};

serve(async (req: Request) => {
  console.log("AI PC Builder function invoked");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request data
    let requestData: RequestBody;
    
    try {
      requestData = await req.json();
      console.log("Request data structure:", Object.keys(requestData));
    } catch (error) {
      console.error("Error parsing request body:", error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Invalid JSON in request body" 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    const { 
      budget,
      games,
      prioritizeLooks,
      targetResolution,
      primaryUse,
      targetFps,
      powerCalculation,
      availableComponents
    } = requestData;

    // Validate required parameters
    if (!budget || !availableComponents) {
      console.error("Missing required parameters", { 
        hasBudget: !!budget, 
        hasComponentsData: !!availableComponents,
        hasGames: !!games && Array.isArray(games),
        componentsKeys: availableComponents ? Object.keys(availableComponents) : 'undefined'
      });
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Missing required parameters" 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Check if OpenAI API key is available
    if (!openAiApiKey) {
      console.error("OpenAI API key not found");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "OpenAI API key not configured" 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    // Simplify components for OpenAI
    const simplifiedComponents = {
      cpu: availableComponents.cpu.map(c => ({
        id: c.id,
        name: c.name,
        price: c.price,
        wattage: c.wattage,
        socket: c.specs?.socket,
        memoryType: c.specs?.memoryType,
        cores: c.specs?.cores,
        speed: c.specs?.speed
      })),
      gpu: availableComponents.gpu.map(c => ({
        id: c.id,
        name: c.name,
        price: c.price,
        wattage: c.wattage,
        vram: c.specs?.vram
      })),
      motherboard: availableComponents.motherboard.map(c => ({
        id: c.id,
        name: c.name,
        price: c.price,
        socket: c.specs?.socket,
        memoryType: c.specs?.memoryType,
        formFactor: c.specs?.formFactor
      })),
      ram: availableComponents.ram.map(c => ({
        id: c.id,
        name: c.name,
        price: c.price,
        size: c.specs?.size,
        speed: c.specs?.speed,
        memoryType: c.specs?.memoryType
      })),
      storage: availableComponents.storage.map(c => ({
        id: c.id,
        name: c.name,
        price: c.price,
        capacity: c.specs?.capacity,
        type: c.specs?.type
      })),
      cooler: availableComponents.cooler.map(c => ({
        id: c.id,
        name: c.name,
        price: c.price,
        type: c.specs?.type,
        coolingCapacity: c.coolingCapacity
      })),
      case: availableComponents.case.map(c => ({
        id: c.id,
        name: c.name,
        price: c.price,
        formFactor: c.specs?.formFactor,
        aesthetics: prioritizeLooks ? "important" : "secondary"
      })),
      psu: availableComponents.psu.map(c => ({
        id: c.id,
        name: c.name,
        price: c.price,
        wattage: c.wattage || parseInt((c.specs?.wattage || "0").replace(/[^0-9]/g, ""))
      }))
    };

    console.log("Components data prepared. Sample counts:", {
      cpuCount: simplifiedComponents.cpu.length,
      gpuCount: simplifiedComponents.gpu.length,
      moboCount: simplifiedComponents.motherboard.length
    });

    // Construct instructions for OpenAI
    const systemInstructions = `
You are a PC building expert AI. Your task is to create the optimal PC build by selecting components
based on the user's requirements and budget constraints.

Key requirements:
- Budget: $${budget}
- Games: ${games.join(", ")}
- Resolution: ${targetResolution}
- Target FPS: ${targetFps}
- Primary use: ${primaryUse}
- Aesthetics priority: ${prioritizeLooks ? "High" : "Standard"}

Choose components that are compatible with each other:
- CPU and motherboard must have matching sockets
- RAM must be compatible with both CPU and motherboard
- Case must support the motherboard form factor
- PSU must provide enough wattage for all components

IMPORTANT PSU SELECTION GUIDELINE:
The PSU wattage should be at least equal to the GPU's wattage. This is a simplified approach that ensures the PSU can handle the most power-hungry component in the system.

Once you've chosen the components, provide a brief explanation for each choice and a summary of the overall build.
`;

    // Prepare the OpenAI API request
    const openAIResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openAiApiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",  // Using GPT-4o-mini for cost effectiveness
        messages: [
          {
            role: "system",
            content: systemInstructions
          },
          {
            role: "user",
            content: JSON.stringify({
              budget,
              games,
              prioritizeLooks,
              targetResolution,
              primaryUse,
              targetFps,
              powerCalculation: powerCalculation || {
                strategy: "GPU-based",
                description: "PSU should have at least the same wattage as the GPU"
              },
              availableComponents: simplifiedComponents
            })
          }
        ],
        response_format: { type: "json_object" }
      })
    });

    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.text();
      console.error("OpenAI API error:", errorData);
      throw new Error(`OpenAI API error: ${errorData}`);
    }

    const openAIData = await openAIResponse.json();
    console.log("OpenAI response received", { 
      hasChoices: !!openAIData.choices, 
      choicesLength: openAIData.choices?.length 
    });
    
    // Parse the OpenAI response
    try {
      const content = openAIData.choices[0]?.message?.content;
      if (!content) throw new Error("No content in OpenAI response");
      
      const parsedResponse = JSON.parse(content);
      
      // Validate the parsed response has the expected structure
      if (!parsedResponse.recommendation || typeof parsedResponse.recommendation !== 'object') {
        throw new Error("Invalid recommendation format in OpenAI response");
      }
      
      // Validate PSU selection against GPU wattage
      if (parsedResponse.recommendation.gpu && parsedResponse.recommendation.psu) {
        const gpuWattage = parsedResponse.recommendation.gpu.wattage || 0;
        console.log("GPU wattage:", gpuWattage);
        
        if (parsedResponse.recommendation.psu) {
          const psuWattage = parsedResponse.recommendation.psu.wattage || 
            parseInt((parsedResponse.recommendation.psu.specs?.wattage || "0").replace(/[^0-9]/g, ""));
          
          if (psuWattage < gpuWattage) {
            console.warn(
              `AI selected PSU (${psuWattage}W) is less than GPU wattage (${gpuWattage}W). ` +
              `Looking for better options...`
            );
            
            // Find a better PSU option within budget
            const betterPsuOptions = simplifiedComponents.psu
              .filter(psu => psu.wattage >= gpuWattage && 
                      psu.price <= parsedResponse.recommendation.psu.price * 1.2) // Allow 20% higher price
              .sort((a, b) => a.price - b.price);
            
            if (betterPsuOptions.length > 0) {
              // Get the original PSU from availableComponents
              const originalPsu = availableComponents.psu.find(
                p => p.id === betterPsuOptions[0].id
              );
              
              if (originalPsu) {
                console.log(`Replacing PSU with better option: ${originalPsu.name} (${betterPsuOptions[0].wattage}W)`);
                parsedResponse.recommendation.psu = originalPsu;
                
                // Add note about PSU upgrade
                parsedResponse.recommendation.psuNote = 
                  `Selected a PSU with ${betterPsuOptions[0].wattage}W to match the GPU's wattage requirement of ${gpuWattage}W.`;
              }
            }
          }
        }
      }
      
      // Calculate total cost
      let totalCost = 0;
      const components = ['cpu', 'gpu', 'motherboard', 'ram', 'storage', 'cooler', 'case', 'psu'];
      for (const component of components) {
        if (parsedResponse.recommendation[component] && parsedResponse.recommendation[component].price) {
          totalCost += parsedResponse.recommendation[component].price;
        }
      }
      
      // Add total cost and ensure each component has a reason
      parsedResponse.recommendation.totalCost = totalCost;
      
      if (!parsedResponse.recommendation.buildSummary) {
        parsedResponse.recommendation.buildSummary = 
          `This $${totalCost.toFixed(2)} build is optimized for ${primaryUse} at ${targetResolution} with a target of ${targetFps} FPS.`;
      }

      return new Response(
        JSON.stringify({
          success: true,
          recommendation: parsedResponse.recommendation
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    } catch (error) {
      console.error("Error parsing OpenAI response:", error);
      throw new Error(`Failed to parse OpenAI response: ${error.message}`);
    }
  } catch (error) {
    console.error("Error in AI PC builder function:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});


import { WizardFormData } from "@/types/wizardTypes";
import { ComponentOption } from "@/types/types";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useAIConfiguration = () => {
  const getComponentOptionsForAI = async (componentType: string) => {
    const { getComponentOptions } = await import('@/utils/componentUtils');
    return getComponentOptions(componentType);
  };

  const generateAIConfiguration = async (data: WizardFormData) => {
    try {
      console.log("Attempting to get AI recommendation with data:", {
        budget: data.budget,
        games: data.games,
        prioritizeLooks: data.prioritizeLooks,
        targetResolution: data.targetResolution,
        primaryUse: data.primaryUse,
        targetFps: data.targetFps
      });

      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Session error:", sessionError);
        throw new Error('Failed to get auth session');
      }

      const authHeader = sessionData?.session ? `Bearer ${sessionData.session.access_token}` : '';
      console.log("Authorization header present:", !!authHeader);
      
      const componentData = {
        cpu: await getComponentOptionsForAI('cpu'),
        gpu: await getComponentOptionsForAI('gpu'),
        motherboard: await getComponentOptionsForAI('motherboard'),
        ram: await getComponentOptionsForAI('ram'),
        storage: await getComponentOptionsForAI('storage'),
        cooler: await getComponentOptionsForAI('cooler'),
        case: await getComponentOptionsForAI('case'),
        psu: await getComponentOptionsForAI('psu')
      };

      // Add metadata about simplified PSU selection based on GPU wattage
      const requestPayload = {
        ...data,
        availableComponents: componentData,
        powerCalculation: {
          strategy: "GPU-based",
          description: "PSU should have at least the same wattage as the GPU"
        }
      };

      console.log("Sending AI request payload with structure:", 
        Object.keys(requestPayload),
        "Components included:", 
        Object.keys(requestPayload.availableComponents).length > 0 ? "Yes" : "No",
        "Power calculation strategy included:", 
        requestPayload.powerCalculation?.strategy || "None");
      
      const aiResponse = await fetch('https://xyhebqsgccwvmigqkwam.functions.supabase.co/ai-pc-builder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader,
        },
        body: JSON.stringify(requestPayload),
      });
      
      console.log("AI service response status:", aiResponse.status);
      
      if (!aiResponse.ok) {
        const errorText = await aiResponse.text();
        console.error("AI service error response:", errorText);
        throw new Error(`AI service responded with status ${aiResponse.status}: ${errorText}`);
      }
      
      const result = await aiResponse.json();
      console.log("AI service response:", result);
      
      if (result.success && result.recommendation) {
        const recommendation = result.recommendation;
        
        // Simple verification that PSU wattage is sufficient for GPU
        if (recommendation.gpu && recommendation.psu) {
          const gpuWattage = recommendation.gpu.wattage || 0;
          const psuWattage = recommendation.psu.wattage || 
            parseInt((recommendation.psu.specs?.wattage || "0").replace(/[^0-9]/g, ""));
            
          console.log(`PSU wattage (${psuWattage}W) vs GPU wattage (${gpuWattage}W)`);
          
          if (psuWattage < gpuWattage) {
            console.warn("AI selected PSU has less wattage than the GPU");
            // We'll just log a warning but not replace the PSU, trusting the AI's choice
          }
        }
        
        console.log("AI recommendation successful:", recommendation);
        return recommendation;
      }
      
      console.error("Invalid AI response format:", result);
      throw new Error('AI response missing recommendation data');
      
    } catch (error) {
      console.error("Detailed AI recommendation error:", {
        message: error.message,
        stack: error.stack,
        cause: error.cause
      });
      throw error;
    }
  };

  return { generateAIConfiguration };
};


import { useMemo } from "react";
import { WizardFormData } from "@/types/wizardTypes";
import { toast } from "@/hooks/use-toast";
import { useAIConfiguration } from "./useAIConfiguration";
import { useAlgorithmConfiguration } from "./useAlgorithmConfiguration";

export const useConfigurationGenerator = () => {
  const { generateAIConfiguration } = useAIConfiguration();
  const { generateAlgorithmConfiguration } = useAlgorithmConfiguration();

  const generateConfiguration = useMemo(() => async (data: WizardFormData) => {
    try {
      try {
        const aiConfiguration = await generateAIConfiguration(data);
        return aiConfiguration;
      } catch (error) {
        console.error("AI recommendation error:", error);
        toast({
          title: "AI Service Unavailable",
          description: `Using built-in algorithm instead. Error: ${error.message}`,
          variant: "destructive",
        });
      }
      
      return await generateAlgorithmConfiguration(data);
    } catch (error) {
      console.error("Error in configuration generator:", error);
      toast({
        title: "Configuration Error",
        description: (error as Error).message || "Failed to generate configuration within budget constraints",
        variant: "destructive",
      });
      return {};
    }
  }, [generateAIConfiguration, generateAlgorithmConfiguration]);

  return { generateConfiguration };
};

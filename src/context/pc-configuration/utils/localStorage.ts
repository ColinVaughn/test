
import { toast } from "sonner";

/**
 * Saves PC configuration to browser's local storage
 * 
 * @param configData Configuration data to save
 */
export const saveConfigurationToLocalStorage = (configToSave: any): void => {
  try {
    const savedConfigs = JSON.parse(localStorage.getItem('savedConfigurations') || '[]');
    savedConfigs.push(configToSave);
    localStorage.setItem('savedConfigurations', JSON.stringify(savedConfigs));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
    toast("Error Saving Configuration", {
      description: "Could not save configuration locally.",
    });
  }
};

/**
 * Retrieves saved configurations from local storage
 * 
 * @returns Array of saved configurations or empty array if none
 */
export const getSavedConfigurationsFromLocalStorage = (): any[] => {
  try {
    return JSON.parse(localStorage.getItem('savedConfigurations') || '[]');
  } catch (error) {
    console.error("Error retrieving from localStorage:", error);
    return [];
  }
};

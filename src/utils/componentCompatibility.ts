
import { ComponentOption, PcConfiguration } from "@/types/types";

export const checkCompatibility = (
  configuration: PcConfiguration,
  componentCategory: string,
  components: ComponentOption[]
): ComponentOption[] => {
  // If no CPU or motherboard selected yet, return all options
  if (!configuration.cpu && !configuration.motherboard && !configuration.case) {
    return components;
  }
  
  switch (componentCategory) {
    case 'motherboard':
      let compatibleMobo = components;
      
      // Filter motherboards based on CPU socket type
      if (configuration.cpu && configuration.cpu.specs.socket) {
        compatibleMobo = compatibleMobo.filter(mobo => 
          mobo.specs.socket === configuration.cpu!.specs.socket
        );
      }
      
      // Filter motherboards based on case form factor support
      if (configuration.case && configuration.case.specs.formFactor) {
        const supportedFormFactors = configuration.case.specs.formFactor.split(', ');
        compatibleMobo = compatibleMobo.filter(mobo => 
          supportedFormFactors.includes(mobo.specs.formFactor)
        );
      }
      
      return compatibleMobo;
      
    case 'case':
      // Filter cases based on motherboard form factor
      if (configuration.motherboard && configuration.motherboard.specs.formFactor) {
        const moboFormFactor = configuration.motherboard.specs.formFactor;
        return components.filter(caseComponent => {
          const supportedFormFactors = caseComponent.specs.formFactor.split(', ');
          // A case can fit any motherboard that's the same size or smaller
          // ATX can fit ATX, Micro-ATX, and Mini-ITX
          // Micro-ATX can fit Micro-ATX and Mini-ITX
          // Mini-ITX can only fit Mini-ITX
          switch (moboFormFactor) {
            case 'ATX':
              return supportedFormFactors.includes('ATX');
            case 'Micro-ATX':
              return supportedFormFactors.includes('Micro-ATX') || supportedFormFactors.includes('ATX');
            case 'Mini-ITX':
              return supportedFormFactors.includes('Mini-ITX') || 
                     supportedFormFactors.includes('Micro-ATX') || 
                     supportedFormFactors.includes('ATX');
            default:
              return true;
          }
        });
      }
      break;
      
    case 'cpu':
      // Filter CPUs based on motherboard socket type
      if (configuration.motherboard && configuration.motherboard.specs.socket) {
        return components.filter(cpu => 
          cpu.specs.socket === configuration.motherboard!.specs.socket
        );
      }
      break;
      
    case 'ram':
      // Filter RAM based on CPU/motherboard memory type (DDR4/DDR5)
      const memoryType = configuration.cpu?.specs.memoryType || 
                        configuration.motherboard?.specs.memoryType;
      if (memoryType) {
        return components.filter(ram => 
          ram.specs.memoryType === memoryType
        );
      }
      break;
  }
  
  // If no specific compatibility constraints, return all options
  return components;
};

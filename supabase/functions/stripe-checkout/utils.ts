import { CheckoutData } from './types.ts';

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export function generateCustomPCDescription(pcConfig: Record<string, any>, components?: Record<string, string> | null): string {
  // If we have preformatted components list, use that
  if (components && Object.keys(components).length > 0) {
    return Object.entries(components)
      .map(([key, value]) => `${key.toUpperCase()}: ${value}`)
      .join('\n');
  }
  
  // Otherwise build description from pcConfig
  if (!pcConfig || Object.keys(pcConfig).length === 0) {
    return "Custom PC Build";
  }
  
  const descriptionParts: string[] = [];
  
  if (pcConfig.cpu && typeof pcConfig.cpu === 'object') {
    const cpu = pcConfig.cpu.name || 'Unknown CPU';
    descriptionParts.push(`CPU: ${cpu}`);
  }
  
  if (pcConfig.gpu && typeof pcConfig.gpu === 'object') {
    const gpu = pcConfig.gpu.name || 'Unknown GPU';
    descriptionParts.push(`GPU: ${gpu}`);
  }
  
  if (pcConfig.ram && typeof pcConfig.ram === 'object') {
    let ram = pcConfig.ram.name || 'Unknown RAM';
    if (pcConfig.ram.selectedRamSize) {
      ram += ` (${pcConfig.ram.selectedRamSize.size} ${pcConfig.ram.selectedRamSize.modules})`;
      
      if (pcConfig.ram.selectedRamSize.selectedColor) {
        ram += ` - ${pcConfig.ram.selectedRamSize.selectedColor.name} color`;
      }
    }
    descriptionParts.push(`RAM: ${ram}`);
  }
  
  if (pcConfig.motherboard && typeof pcConfig.motherboard === 'object') {
    const motherboard = pcConfig.motherboard.name || 'Unknown Motherboard';
    descriptionParts.push(`Motherboard: ${motherboard}`);
  }
  
  if (pcConfig.storage && typeof pcConfig.storage === 'object') {
    const storage = pcConfig.storage.name || 'Unknown Storage';
    descriptionParts.push(`Storage: ${storage}`);
  }
  
  if (pcConfig.case && typeof pcConfig.case === 'object') {
    let caseString = pcConfig.case.name || 'Unknown Case';
    if (pcConfig.case.selectedColor) {
      caseString += ` - ${pcConfig.case.selectedColor.name}`;
    }
    descriptionParts.push(`Case: ${caseString}`);
  }
  
  if (pcConfig.psu && typeof pcConfig.psu === 'object') {
    const psu = pcConfig.psu.name || 'Unknown PSU';
    descriptionParts.push(`PSU: ${psu}`);
  }
  
  if (pcConfig.cooler && typeof pcConfig.cooler === 'object') {
    let cooler = pcConfig.cooler.name || 'Unknown Cooler';
    if (pcConfig.cooler.selectedCoolerColor) {
      cooler += ` - ${pcConfig.cooler.selectedCoolerColor.name} color`;
    }
    if (pcConfig.cooler.selectedCoolerSize) {
      cooler += ` - ${pcConfig.cooler.selectedCoolerSize.size}`;
    }
    descriptionParts.push(`Cooling: ${cooler}`);
  }
  
  if (pcConfig.os && typeof pcConfig.os === 'object') {
    const os = pcConfig.os.name || 'Unknown OS';
    descriptionParts.push(`OS: ${os}`);
  }
  
  if (pcConfig.fans && pcConfig.fans.quantity > 0 && pcConfig.fans.component) {
    const fans = `${pcConfig.fans.quantity}x ${pcConfig.fans.component.name || 'Fan'}`;
    descriptionParts.push(`Fans: ${fans}`);
  }
  
  return descriptionParts.join('\n');
}

export function generateStripeMetadata(configuration: any): Record<string, string> {
  // Create a base metadata object
  const metadata: Record<string, string> = {};
  
  // Determine product type
  if (Array.isArray(configuration.details) && configuration.details.length > 0) {
    metadata.product_type = "cart_checkout";
    metadata.item_count = String(configuration.details.length);
    
    // Add metadata about cart items
    configuration.details.forEach((item: any, index: number) => {
      if (item.product_type) {
        metadata[`item_${index + 1}_type`] = item.product_type;
        metadata[`item_${index + 1}_id`] = item.product_id || '';
        metadata[`item_${index + 1}_name`] = item.product_name || '';
      }
    });
  } 
  else if (configuration.pcConfiguration) {
    metadata.product_type = "custom_pc";
  } 
  else {
    metadata.product_type = "prebuilt_pc";
  }
  
  // Include additional metadata if available
  if (configuration.affiliateCode) {
    metadata.affiliate_code = configuration.affiliateCode;
  }
  if (configuration.couponCode) {
    metadata.coupon_code = configuration.couponCode;
  }
  
  return metadata;
}


export function getName(component: any) {
  if (!component) return 'Not specified';
  if (typeof component === 'string') return component;
  return component.name || 'Not specified';
}

export function isCustomPC(config: Record<string, any>, type = 'custom') {
  return (
    type === 'custom' || 
    config.product_type === 'custom' || 
    config.cpu || 
    config.gpu || 
    config.ram || 
    config.motherboard || 
    config.storage || 
    config.case || 
    config.psu || 
    config.cooler
  );
}

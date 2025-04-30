import { ComponentOption } from "@/types/types";

export function isComponentOption(value: any): value is ComponentOption {
  return (
    value !== null &&
    typeof value === 'object' &&
    'name' in value &&
    'price' in value
  );
}

export function isFanConfiguration(value: any): value is { quantity: number; component: ComponentOption } {
  return (
    value !== null &&
    typeof value === 'object' &&
    'quantity' in value &&
    typeof value.quantity === 'number' &&
    'component' in value
  );
}

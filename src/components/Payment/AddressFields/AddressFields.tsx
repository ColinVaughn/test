
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddressFieldsProps {
  type: "shipping" | "billing";
  values: {
    name: string;
    line1: string;
    line2: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  onChange: (field: string, value: string) => void;
  errors?: {[key: string]: boolean};
}

const AddressFields = ({ type, values, onChange, errors = {} }: AddressFieldsProps) => {
  const getErrorClass = (field: string) => {
    const errorKey = `${type}${field.charAt(0).toUpperCase() + field.slice(1)}`;
    return errors[errorKey] ? "border-red-500 focus:border-red-500" : "";
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      <div>
        <Label htmlFor={`${type}-name`}>Full Name *</Label>
        <Input
          id={`${type}-name`}
          value={values.name}
          onChange={(e) => onChange("name", e.target.value)}
          className={`bg-gaming-dark border-gaming-light-gray/40 ${getErrorClass("name")}`}
        />
        {errors[`${type}Name`] && (
          <p className="text-red-400 text-xs mt-1">Required</p>
        )}
      </div>
      <div>
        <Label htmlFor={`${type}-line1`}>Address Line 1 *</Label>
        <Input
          id={`${type}-line1`}
          value={values.line1}
          onChange={(e) => onChange("line1", e.target.value)}
          className={`bg-gaming-dark border-gaming-light-gray/40 ${getErrorClass("line1")}`}
        />
        {errors[`${type}Line1`] && (
          <p className="text-red-400 text-xs mt-1">Required</p>
        )}
      </div>
      <div>
        <Label htmlFor={`${type}-line2`}>Address Line 2 (Optional)</Label>
        <Input
          id={`${type}-line2`}
          value={values.line2}
          onChange={(e) => onChange("line2", e.target.value)}
          className="bg-gaming-dark border-gaming-light-gray/40"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor={`${type}-city`}>City *</Label>
          <Input
            id={`${type}-city`}
            value={values.city}
            onChange={(e) => onChange("city", e.target.value)}
            className={`bg-gaming-dark border-gaming-light-gray/40 ${getErrorClass("city")}`}
          />
          {errors[`${type}City`] && (
            <p className="text-red-400 text-xs mt-1">Required</p>
          )}
        </div>
        <div>
          <Label htmlFor={`${type}-state`}>State *</Label>
          <Input
            id={`${type}-state`}
            value={values.state}
            onChange={(e) => onChange("state", e.target.value)}
            className={`bg-gaming-dark border-gaming-light-gray/40 ${getErrorClass("state")}`}
          />
          {errors[`${type}State`] && (
            <p className="text-red-400 text-xs mt-1">Required</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor={`${type}-postal`}>ZIP Code *</Label>
          <Input
            id={`${type}-postal`}
            value={values.postal_code}
            onChange={(e) => onChange("postal_code", e.target.value)}
            className={`bg-gaming-dark border-gaming-light-gray/40 ${getErrorClass("postal")}`}
          />
          {errors[`${type}Postal`] && (
            <p className="text-red-400 text-xs mt-1">Required</p>
          )}
        </div>
        <div>
          <Label htmlFor={`${type}-country`}>Country *</Label>
          <Input
            id={`${type}-country`}
            value={values.country}
            onChange={(e) => onChange("country", e.target.value)}
            className="bg-gaming-dark border-gaming-light-gray/40"
          />
        </div>
      </div>
    </div>
  );
};

export default AddressFields;

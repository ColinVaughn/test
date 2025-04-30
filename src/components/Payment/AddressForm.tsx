
import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import AddressFields from "./AddressFields/AddressFields";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export interface AddressData {
  shipping: {
    name: string;
    address: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
  };
  billing?: {
    name: string;
    address: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
  };
}

interface AddressFormProps {
  onAddressSubmit: (addresses: AddressData) => void;
}

const AddressForm = ({ onAddressSubmit }: AddressFormProps) => {
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "US"
  });
  const [billingAddress, setBillingAddress] = useState({
    name: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "US"
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState<{[key: string]: boolean}>({});

  const handleShippingChange = (field: string, value: string) => {
    setShippingAddress(prev => ({ ...prev, [field]: value }));
  };

  const handleBillingChange = (field: string, value: string) => {
    setBillingAddress(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const errors: {[key: string]: boolean} = {};
    
    // Required shipping fields
    if (!shippingAddress.name) errors.shippingName = true;
    if (!shippingAddress.line1) errors.shippingLine1 = true;
    if (!shippingAddress.city) errors.shippingCity = true;
    if (!shippingAddress.state) errors.shippingState = true;
    if (!shippingAddress.postal_code) errors.shippingPostal = true;
    
    // Required billing fields if not same as shipping
    if (!sameAsBilling) {
      if (!billingAddress.name) errors.billingName = true;
      if (!billingAddress.line1) errors.billingLine1 = true;
      if (!billingAddress.city) errors.billingCity = true;
      if (!billingAddress.state) errors.billingState = true;
      if (!billingAddress.postal_code) errors.billingPostal = true;
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    setFormSubmitted(true);
    if (!validateForm()) {
      toast.error("Please fill all required address fields");
      return;
    }

    const addressData: AddressData = {
      shipping: {
        name: shippingAddress.name,
        address: {
          line1: shippingAddress.line1,
          line2: shippingAddress.line2 || undefined,
          city: shippingAddress.city,
          state: shippingAddress.state,
          postal_code: shippingAddress.postal_code,
          country: shippingAddress.country,
        }
      }
    };

    if (!sameAsBilling) {
      addressData.billing = {
        name: billingAddress.name,
        address: {
          line1: billingAddress.line1,
          line2: billingAddress.line2 || undefined,
          city: billingAddress.city,
          state: billingAddress.state,
          postal_code: billingAddress.postal_code,
          country: billingAddress.country,
        }
      };
    }

    onAddressSubmit(addressData);
    toast.success("Address information saved");
  };

  // Check form on changes to update validation state
  useEffect(() => {
    if (formSubmitted) {
      validateForm();
    }
  }, [shippingAddress, billingAddress, sameAsBilling, formSubmitted]);

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <h3 className="font-medium text-lg">Shipping Address</h3>
        <AddressFields
          type="shipping"
          values={shippingAddress}
          onChange={handleShippingChange}
          errors={formErrors}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox 
          id="same-billing"
          checked={sameAsBilling}
          onCheckedChange={(checked) => setSameAsBilling(checked as boolean)}
        />
        <Label htmlFor="same-billing">Billing address same as shipping</Label>
      </div>

      {!sameAsBilling && (
        <div className="space-y-4">
          <h3 className="font-medium text-lg">Billing Address</h3>
          <AddressFields
            type="billing"
            values={billingAddress}
            onChange={handleBillingChange}
            errors={formErrors}
          />
        </div>
      )}

      <Button 
        onClick={handleSubmit} 
        className="w-full mt-4 bg-gaming-blue hover:bg-gaming-blue/90"
      >
        Save Address Information
      </Button>
      
      {formSubmitted && Object.keys(formErrors).length > 0 && (
        <p className="text-red-400 text-sm mt-2">
          Please fill in all required address fields
        </p>
      )}
    </div>
  );
};

export default AddressForm;

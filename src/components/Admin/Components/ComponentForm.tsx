
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

// Define the component category type to match the database enum
type ComponentCategory = "cpu" | "motherboard" | "gpu" | "ram" | "storage" | "cooler" | "case" | "psu" | "os" | "fans";

const categories = [
  { value: "cpu", label: "CPU" },
  { value: "motherboard", label: "Motherboard" },
  { value: "gpu", label: "GPU" },
  { value: "ram", label: "RAM" },
  { value: "storage", label: "Storage" },
  { value: "cooler", label: "Cooler" },
  { value: "case", label: "Case" },
  { value: "psu", label: "Power Supply" },
  { value: "os", label: "Operating System" },
  { value: "fans", label: "Fans" }
];

export default function ComponentForm() {
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "" as ComponentCategory | "",
    price: "",
    amazonLink: "",
    imageUrl: "",
    specs: "",
    wattage: "",
    coolingCapacity: "",
    fanSlots: "",
    preInstalledFans: "",
    fanSize: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.category) {
      toast.error("Please select a category");
      return;
    }
    
    try {
      const { error } = await supabase
        .from('pc_components')
        .insert({
          name: formData.name,
          brand: formData.brand,
          category: formData.category as ComponentCategory,
          price: parseFloat(formData.price),
          amazon_link: formData.amazonLink,
          image_url: formData.imageUrl,
          specs: JSON.parse(formData.specs || "{}"),
          wattage: formData.wattage ? parseInt(formData.wattage) : null,
          cooling_capacity: formData.coolingCapacity ? parseInt(formData.coolingCapacity) : null,
          fan_slots: formData.fanSlots ? parseInt(formData.fanSlots) : null,
          pre_installed_fans: formData.preInstalledFans ? parseInt(formData.preInstalledFans) : null,
          fan_size: formData.fanSize ? parseInt(formData.fanSize) : null
        });

      if (error) throw error;
      
      toast.success("Component added successfully");
      setFormData({
        name: "",
        brand: "",
        category: "",
        price: "",
        amazonLink: "",
        imageUrl: "",
        specs: "",
        wattage: "",
        coolingCapacity: "",
        fanSlots: "",
        preInstalledFans: "",
        fanSize: ""
      });
    } catch (error) {
      console.error('Error adding component:', error);
      toast.error("Failed to add component");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Component Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="brand">Brand</Label>
          <Input
            id="brand"
            value={formData.brand}
            onChange={e => setFormData(prev => ({ ...prev, brand: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value: ComponentCategory) => setFormData(prev => ({ ...prev, category: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category.value} value={category.value as ComponentCategory}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price ($)</Label>
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="amazonLink">Amazon Link (Optional)</Label>
          <Input
            id="amazonLink"
            value={formData.amazonLink}
            onChange={e => setFormData(prev => ({ ...prev, amazonLink: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="imageUrl">Image URL (Optional)</Label>
          <Input
            id="imageUrl"
            value={formData.imageUrl}
            onChange={e => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="wattage">Wattage (Optional)</Label>
          <Input
            id="wattage"
            type="number"
            value={formData.wattage}
            onChange={e => setFormData(prev => ({ ...prev, wattage: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="coolingCapacity">Cooling Capacity (Optional)</Label>
          <Input
            id="coolingCapacity"
            type="number"
            value={formData.coolingCapacity}
            onChange={e => setFormData(prev => ({ ...prev, coolingCapacity: e.target.value }))}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="specs">Specifications (JSON format)</Label>
        <Textarea
          id="specs"
          placeholder='{"key": "value"}'
          value={formData.specs}
          onChange={e => setFormData(prev => ({ ...prev, specs: e.target.value }))}
          className="h-32"
          required
        />
      </div>

      <Button type="submit" className="w-full">
        Add Component
      </Button>
    </form>
  );
}

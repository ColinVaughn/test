import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { NewPrebuiltSystem } from "../types/AdminTypes";
import { Button } from "@/components/ui/button";
import { Upload, Trash2 } from "lucide-react";

interface PrebuiltFormProps {
  onSubmit: (system: NewPrebuiltSystem) => void;
}

export default function PrebuiltForm({ onSubmit }: PrebuiltFormProps) {
  const [newSystem, setNewSystem] = useState<NewPrebuiltSystem>({
    name: '',
    price: 0,
    originalPrice: 0,
    discount: 0,
    category: '',
    imageUrl: '',
    specs: {},
    bestseller: false,
    featured: false,
    new: true,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageUpload = async () => {
    if (!imageFile) {
      toast.error("Please select an image first");
      return;
    }

    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, imageFile);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      setNewSystem(prev => ({ ...prev, imageUrl: publicUrl }));
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error("Failed to upload image");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setNewSystem(prev => ({ ...prev, imageUrl: '' }));
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>System Name</Label>
        <Input
          value={newSystem.name}
          onChange={(e) => setNewSystem({...newSystem, name: e.target.value})}
          placeholder="Enter system name"
        />
      </div>
      <div>
        <Label>Price</Label>
        <Input
          type="number"
          value={newSystem.price}
          onChange={(e) => setNewSystem({...newSystem, price: Number(e.target.value)})}
          placeholder="Enter price"
        />
      </div>
      <div>
        <Label>Original Price</Label>
        <Input
          type="number"
          value={newSystem.originalPrice}
          onChange={(e) => setNewSystem({...newSystem, originalPrice: Number(e.target.value)})}
          placeholder="Enter original price"
        />
      </div>
      <div>
        <Label>Discount</Label>
        <Input
          type="number"
          value={newSystem.discount}
          onChange={(e) => setNewSystem({...newSystem, discount: Number(e.target.value)})}
          placeholder="Enter discount"
        />
      </div>
      <div>
        <Label>Category</Label>
        <Input
          value={newSystem.category}
          onChange={(e) => setNewSystem({...newSystem, category: e.target.value})}
          placeholder="Enter category (Gaming PC, Workstation, etc.)"
        />
      </div>
      <div>
        <Label>Product Image</Label>
        <div className="flex items-center space-x-4">
          <Input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange} 
            className="flex-grow"
          />
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleImageUpload}
            disabled={!imageFile}
            className="flex items-center gap-2"
          >
            <Upload size={16} /> Upload
          </Button>
        </div>
        
        {imagePreview && (
          <div className="mt-4 relative">
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="max-w-full h-48 object-cover rounded-md"
            />
            <Button 
              type="button" 
              variant="destructive" 
              size="icon" 
              className="absolute top-2 right-2"
              onClick={removeImage}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        )}
        
        {newSystem.imageUrl && (
          <div className="mt-2">
            <Label>Image URL</Label>
            <Input 
              value={newSystem.imageUrl} 
              readOnly 
              className="bg-gray-100"
            />
          </div>
        )}
      </div>
      <Button 
        onClick={() => onSubmit(newSystem)}
        className="w-full"
      >
        Create Prebuilt System
      </Button>
    </div>
  );
}

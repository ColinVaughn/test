
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import ComponentForm from "./ComponentForm";
import ComponentList from "./ComponentList";
import { Package } from "lucide-react";

export default function ComponentManager() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="bg-gaming-dark/30 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <Package className="h-6 w-6" />
        <h2 className="text-xl font-semibold">Component Management</h2>
      </div>

      <Tabs defaultValue="add" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="add">Add Component</TabsTrigger>
          <TabsTrigger value="list">Component List</TabsTrigger>
        </TabsList>

        <TabsContent value="add">
          <ComponentForm />
        </TabsContent>

        <TabsContent value="list">
          <ComponentList />
        </TabsContent>
      </Tabs>
    </div>
  );
}


import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminSellerManager from "./AdminSellerManager";
import AdminProductManager from "./AdminProductManager";

const AdminMarketplaceManager = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gaming-blue">Marketplace Management</h2>
      
      <Tabs defaultValue="sellers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sellers">Sellers</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sellers">
          <AdminSellerManager />
        </TabsContent>
        
        <TabsContent value="products">
          <AdminProductManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminMarketplaceManager;

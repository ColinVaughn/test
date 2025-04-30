import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import AdminProductManager from '@/components/Admin/AdminProductManager';
import AdminOrderManager from '@/components/Admin/AdminOrderManager';
import AdminUserManager from '@/components/Admin/AdminUserManager';
import AdminAffiliateManager from '@/components/Admin/AdminAffiliateManager';
import AdminPrebuiltManager from '@/components/Admin/AdminPrebuiltManager';
import AdminCouponManager from '@/components/Admin/AdminCouponManager';
import { RMADetail } from '@/components/Admin/RMAManagement/RMADetail';
import { RMAList } from '@/components/Admin/RMAManagement/RMAList';
import AdminMarketplaceManager from '@/components/Admin/MarketplaceManager/AdminMarketplaceManager';
import { ArticleManager } from '@/components/Admin/ArticleManagement/ArticleManager';

export const AdminTabsContent = ({ 
  selectedRequest, 
  setSelectedRequest, 
  updateRequestStatus,
  requests,
  rmaLoading
}) => {
  return (
    <>
      <TabsContent value="orders">
        <Card>
          <CardContent className="pt-6">
            <AdminOrderManager />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="users">
        <Card>
          <CardContent className="pt-6">
            <AdminUserManager />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="products">
        <Card>
          <CardContent className="pt-6">
            <AdminProductManager />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="prebuilt">
        <Card>
          <CardContent className="pt-6">
            <AdminPrebuiltManager />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="coupons">
        <Card>
          <CardContent className="pt-6">
            <AdminCouponManager />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="affiliates">
        <Card>
          <CardContent className="pt-6">
            <AdminAffiliateManager />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="articles">
        <Card>
          <CardContent className="pt-6">
            <ArticleManager />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="rma">
        <Card>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <RMAList 
                  requests={requests} 
                  isLoading={rmaLoading}
                  onSelectRequest={setSelectedRequest}
                />
              </div>
              <div className="md:col-span-2">
                {selectedRequest ? (
                  <RMADetail 
                    request={selectedRequest}
                    onBack={() => setSelectedRequest(null)}
                    onUpdateStatus={updateRequestStatus}
                  />
                ) : (
                  <div className="bg-gaming-dark/30 rounded-lg p-6 text-center">
                    <p className="text-gray-400">Select an RMA request to view details</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="marketplace">
        <Card>
          <CardContent className="pt-6">
            <AdminMarketplaceManager />
          </CardContent>
        </Card>
      </TabsContent>
    </>
  );
};

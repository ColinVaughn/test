
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { OrderList } from './OrderManagement/OrderList';
import { OrderDetailsContent } from './OrderManagement/OrderDetailsContent';
import { OrderFilters } from './OrderManagement/OrderFilters';
import { useOrders } from './hooks/useOrders';
import { Loader2, PlusCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { CreateOrderDialog } from './OrderManagement/CreateOrderDialog';

const AdminOrderManager = () => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { 
    orders,
    isLoading,
    selectedOrder,
    orderItems,
    shipment,
    paymentInfo,
    setSelectedOrder,
    fetchOrders,
    fetchOrderDetails,
    updateOrderStatus,
    createTestOrder,
    isUpdatingStatus,
    isUpdatingShipment,
    isCreatingTestOrder,
  } = useOrders();
  
  const isMobile = useIsMobile();

  // Initial fetch of orders when component mounts
  useEffect(() => {
    const loadOrders = async () => {
      await fetchOrders(statusFilter);
    };
    
    loadOrders();
  }, [fetchOrders, statusFilter]);

  // Handle order selection
  const handleSelectOrder = async (order) => {
    await fetchOrderDetails(order.id);
    setSelectedOrder(order);
  };

  // Handle order status updates
  const handleUpdateOrderStatus = async (orderId, status) => {
    await updateOrderStatus(orderId, status);
  };

  // Handle back to list
  const handleBackToList = () => {
    setSelectedOrder(null);
  };

  // Handle refresh orders
  const handleRefreshOrders = () => {
    fetchOrders(statusFilter);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h2 className="text-xl font-bold text-gaming-blue">Orders Management</h2>
        <div className="flex gap-2">
          <CreateOrderDialog />
          <Button
            variant="outline"
            size="sm"
            onClick={() => createTestOrder()}
            disabled={isCreatingTestOrder}
            className="text-xs"
          >
            {isCreatingTestOrder ? (
              <>
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                Creating Test...
              </>
            ) : (
              <>
                <PlusCircle className="mr-2 h-3 w-3" />
                Create Test Order
              </>
            )}
          </Button>
          {selectedOrder && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleBackToList}
              className="text-xs"
            >
              Back to List
            </Button>
          )}
        </div>
      </div>
      
      {!selectedOrder ? (
        <>
          <OrderFilters 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            onRefresh={handleRefreshOrders}
          />
          <OrderList 
            orders={orders}
            onSelectOrder={handleSelectOrder}
            isMobile={isMobile}
            isLoading={isLoading}
          />
        </>
      ) : (
        <OrderDetailsContent
          selectedOrder={selectedOrder}
          orderItems={orderItems}
          shipment={shipment}
          paymentInfo={paymentInfo}
          isUpdatingStatus={isUpdatingStatus}
          isUpdatingShipment={isUpdatingShipment}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onUpdateShipment={() => fetchOrderDetails(selectedOrder.id)}
        />
      )}
    </div>
  );
};

export default AdminOrderManager;


import OrderTracker from "@/components/OrderTracking/OrderTracker";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const OrderTrackingPage = () => {
  return (
    <div className="min-h-screen bg-gaming-darker">
      <Header />
      <main className="container mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold text-gaming-blue mb-8">Order Tracking</h1>
        <p className="text-gray-300 mb-6">Enter your order ID or email to track your order status and shipment information.</p>
        <div className="max-w-2xl mx-auto">
          <OrderTracker />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderTrackingPage;

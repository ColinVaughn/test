
import HeaderWithAdmin from "@/components/HeaderWithAdmin";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";

const OrderCancelledPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col bg-gaming-darker">
      <Helmet>
        <title>Order Cancelled | BattleforgePC</title>
        <meta name="description" content="Your order has been cancelled. No charges have been made to your payment method." />
      </Helmet>
      
      <HeaderWithAdmin />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-screen-xl">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
        </div>
        
        <Card className="max-w-2xl mx-auto p-8 bg-gaming-dark border-gaming-light-gray/20">
          <div className="text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Order Cancelled
            </h1>
            <p className="text-gray-400 mb-6">
              Your order has been cancelled. No charges have been made to your payment method.
            </p>
            <Link to="/checkout">
              <Button className="bg-gaming-blue hover:bg-gaming-blue/80 text-white w-full mb-4">
                Try Again
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" className="w-full text-gray-400 hover:text-white">
                Return to Home
              </Button>
            </Link>
          </div>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default OrderCancelledPage;

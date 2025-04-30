
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PackageCheck, FileCheck, ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const OrderSuccessPage = () => {
  const [orderNumber, setOrderNumber] = useState<string>("");
  const [paymentProvider, setPaymentProvider] = useState<string>("");
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    
    // Log the full URL for debugging
    console.log("Order success URL:", location.search);
    
    // Check different identifiers
    const sessionId = searchParams.get('session_id');
    const paypalId = searchParams.get('paypal_id');
    const orderId = searchParams.get('order_id'); // Use order_id parameter for consistency
    const paymentMethod = searchParams.get('paymentMethod');
    const token = searchParams.get('token');
    const PayerID = searchParams.get('PayerID');
    
    console.log("URL params:", { 
      sessionId, 
      paypalId, 
      orderId, 
      paymentMethod,
      token, 
      PayerID
    });
    
    // Detect which payment provider was used
    if (token || paypalId) {
      setPaymentProvider("PayPal");
    } else if (sessionId) {
      setPaymentProvider("Stripe");
    } else if (paymentMethod === 'zelle') {
      setPaymentProvider("Zelle");
    }
    
    const fetchOrderDetails = async () => {
      try {
        setIsLoading(true);
        
        // If we already have the direct order ID, this is the best case scenario
        if (orderId) {
          console.log("Direct order ID provided:", orderId);
          setOrderNumber(orderId);
          
          // For Zelle orders, we don't update the status to processing immediately
          // as we need to wait for payment confirmation
          if (paymentMethod !== 'zelle') {
            // Update order status to processing for non-Zelle orders
            const { error: updateError } = await supabase
              .from('orders')
              .update({ status: 'processing', updated_at: new Date().toISOString() })
              .eq('id', orderId);
              
            if (updateError) {
              console.error('Error updating order status:', updateError);
              setError("Could not update order status");
            } else {
              console.log("Order status updated to processing");
              toast.success("Order confirmed and processing");
            }
          } else {
            // For Zelle orders, we just show a success message as status remains pending
            console.log("Zelle order registered successfully");
            toast.success("Order placed! Please complete your Zelle payment.");
          }
          
          setIsLoading(false);
          return;
        }
        
        // Next best option: Check using PayPal ID directly
        if (paypalId) {
          console.log("Searching for order with PayPal ID:", paypalId);
          
          const { data: orderByPayPalId, error: paypalError } = await supabase
            .from('orders')
            .select('id')
            .eq('paypal_order_id', paypalId)
            .maybeSingle();
            
          if (paypalError) {
            console.error('Error fetching order by PayPal ID:', paypalError);
          }
          
          if (orderByPayPalId) {
            console.log("Found order via paypal_order_id:", orderByPayPalId.id);
            setOrderNumber(orderByPayPalId.id);
            
            // Update order status to processing
            const { error: updateError } = await supabase
              .from('orders')
              .update({ status: 'processing', updated_at: new Date().toISOString() })
              .eq('id', orderByPayPalId.id);
              
            if (updateError) {
              console.error('Error updating order status:', updateError);
              setError("Could not update order status");
            } else {
              console.log("Order status updated to processing");
              toast.success("Order confirmed and processing");
            }
            
            setIsLoading(false);
            return;
          }
        }
        
        // Next try the PayPal token
        if (token) {
          console.log("Searching for order with PayPal token:", token);
          
          // First check the payment_transactions table
          const { data: transaction, error: transactionError } = await supabase
            .from('payment_transactions')
            .select('order_id, id')
            .eq('transaction_id', token)
            .maybeSingle();
            
          if (transactionError) {
            console.error('Error fetching transaction:', transactionError);
          }
          
          if (transaction?.order_id) {
            console.log("Found order via transaction record:", transaction.order_id);
            setOrderNumber(transaction.order_id);
            
            // Update order status to processing
            const { error: updateError } = await supabase
              .from('orders')
              .update({ status: 'processing', updated_at: new Date().toISOString() })
              .eq('id', transaction.order_id);
              
            if (updateError) {
              console.error('Error updating order status:', updateError);
              setError("Could not update order status");
            } else {
              console.log("Order status updated to processing");
              toast.success("Order confirmed and processing");
            }
            
            setIsLoading(false);
            return;
          }
          
          // If not found in transactions, check orders table directly
          const { data: orderByToken, error: orderError } = await supabase
            .from('orders')
            .select('id')
            .eq('paypal_order_id', token)
            .maybeSingle();
            
          if (orderError) {
            console.error('Error fetching order by token:', orderError);
          }
          
          if (orderByToken) {
            console.log("Found order via paypal_order_id:", orderByToken.id);
            setOrderNumber(orderByToken.id);
            
            // Update order status to processing
            const { error: updateError } = await supabase
              .from('orders')
              .update({ status: 'processing', updated_at: new Date().toISOString() })
              .eq('id', orderByToken.id);
              
            if (updateError) {
              console.error('Error updating order status:', updateError);
              setError("Could not update order status");
            } else {
              console.log("Order status updated to processing");
              toast.success("Order confirmed and processing");
            }
            
            setIsLoading(false);
            return;
          }
          
          // If we get here and have a PayerID but no order found yet, create a recovery record
          if (PayerID && token && !orderNumber) {
            console.log("Creating recovery record for PayPal transaction:", token);
            
            try {
              const { data: recoveryTx, error: recoveryError } = await supabase
                .from('payment_transactions')
                .insert({
                  transaction_id: token,
                  payment_method: 'paypal',
                  status: 'received',
                  amount: 0, // We don't know the amount yet
                  customer_email: `paypal-${token.substring(0, 8)}@recovery.com`,
                  order_id: null // We'll link this later manually
                })
                .select()
                .single();
                
              if (recoveryError) {
                console.error('Error creating recovery transaction:', recoveryError);
              } else {
                console.log("Created recovery transaction record:", recoveryTx);
                
                // Show a more specific error message
                setError(`PayPal payment received (${token}). Our team will contact you to complete your order.`);
              }
            } catch (err) {
              console.error("Recovery record creation failed:", err);
            }
          } else {
            // Show the token in the error message so support can look up the transaction
            setError(`Order information incomplete. Your payment reference: ${token}`);
          }
        } else if (sessionId) {
          // Handle Stripe session ID lookup
          const { data: orderBySession, error: sessionError } = await supabase
            .from('orders')
            .select('id')
            .eq('stripe_session_id', sessionId)
            .maybeSingle();
            
          if (sessionError) {
            console.error('Error fetching order by session:', sessionError);
          }
          
          if (orderBySession) {
            console.log("Found order via stripe session:", orderBySession.id);
            setOrderNumber(orderBySession.id);
            
            // Update order status to processing
            const { error: updateError } = await supabase
              .from('orders')
              .update({ status: 'processing', updated_at: new Date().toISOString() })
              .eq('id', orderBySession.id);
              
            if (updateError) {
              console.error('Error updating order status:', updateError);
              setError("Could not update order status");
            } else {
              console.log("Order status updated to processing");
              toast.success("Order confirmed and processing");
            }
          } else {
            setError("Could not find order details for this session");
          }
        } else {
          setError("Missing order information in URL");
        }
      } catch (error) {
        console.error('Error fetching order:', error);
        setError("Could not find order details");
      } finally {
        setIsLoading(false);
      }
    };

    // Only attempt to fetch order details if we have some identifier
    if (sessionId || paypalId || orderId || token || PayerID) {
      fetchOrderDetails();
    } else {
      setIsLoading(false);
      setError("Missing order information");
    }
  }, [location.search]);

  const handleBackToHome = () => {
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gaming-darker flex items-center justify-center">
        <div className="animate-pulse text-gaming-blue">Loading order details...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gaming-darker text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto bg-gaming-dark/50 rounded-lg p-8 border border-gaming-light-gray/20">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gaming-blue/20 mb-4">
              {error ? (
                <AlertCircle className="w-8 h-8 text-red-500" />
              ) : (
                <PackageCheck className="w-8 h-8 text-gaming-blue" />
              )}
            </div>
            <h1 className="text-3xl font-bold mb-2">
              {error ? "Order Status" : "Order Confirmed!"}
            </h1>
            <p className="text-gray-400">
              {error 
                ? paymentProvider ? `Your ${paymentProvider} payment was received, but there was an issue with your order details.` 
                                 : "We've recorded your payment, but there was an issue with your order details."
                : paymentProvider === "Zelle" 
                    ? "Thank you for your order. Please complete your Zelle payment using the instructions below."
                    : "Thank you for your purchase. We're preparing your order for shipping."
              }
            </p>
          </div>

          {orderNumber && (
            <div className="bg-gaming-dark/40 rounded-lg p-4 mb-6 flex items-center gap-3">
              <FileCheck className="text-green-500" />
              <div>
                <p className="text-sm text-gray-400">Order Number</p>
                <p className="font-mono">{orderNumber}</p>
              </div>
            </div>
          )}

          {/* Special Zelle Instructions */}
          {paymentProvider === "Zelle" && orderNumber && !error && (
            <div className="bg-gaming-darker rounded-lg p-4 mb-6 space-y-3">
              <h3 className="font-medium text-gaming-blue">Complete Your Zelle Payment</h3>
              <div className="space-y-2">
                <p className="text-sm">Please send your payment to:</p>
                <div className="bg-black/30 px-3 py-2 rounded">
                  <p className="text-gaming-blue font-mono">info@battleforgepc.com</p>
                </div>
                <p className="text-sm">Include your order number in the memo:</p>
                <div className="bg-black/30 px-3 py-2 rounded">
                  <p className="text-gaming-blue font-mono">{orderNumber}</p>
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  Your order will be processed once your Zelle payment is confirmed.
                </p>
              </div>
            </div>
          )}

          <div className="space-y-4 text-center">
            <p className="text-gray-400">
              {error 
                ? "Our support team has been notified. Please contact support if you have any questions about your order." 
                : paymentProvider === "Zelle"
                    ? "After sending your Zelle payment, please allow 1-2 business days for confirmation."
                    : "We'll send you an email with your order confirmation and tracking details once your order ships."}
            </p>
            
            <Button 
              onClick={() => navigate('/')}
              className="bg-gaming-blue hover:bg-gaming-blue/90"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-900/80 text-white px-6 py-4 rounded-lg flex items-center space-x-3 shadow-lg max-w-md">
          <AlertCircle className="w-5 h-5 text-red-300 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}
    </div>
  );
};

export default OrderSuccessPage;

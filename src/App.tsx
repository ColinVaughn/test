
import React from "react";
import { Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";

// Pages
import Index from "./pages/Index";
import PrebuiltPCs from "./pages/PrebuiltPCs";
import CustomizePage from "./pages/CustomizePage";
import NotFound from "./pages/NotFound";
import AboutPage from "./pages/AboutPage";
import SupportPage from "./pages/SupportPage";
import AdminPage from "./pages/AdminPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderTrackingPage from "./pages/OrderTrackingPage";
import AuthPage from "./pages/AuthPage";
import ComponentsPage from "./pages/ComponentsPage";
import GamingPCsPage from "./pages/GamingPCsPage";
import WorkstationsPage from "./pages/WorkstationsPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import OrderCancelledPage from "./pages/OrderCancelledPage";
import AffiliateApplicationPage from "./pages/AffiliateApplicationPage";
import AffiliateDashboardPage from "./pages/AffiliateDashboardPage";
import AffiliateStatusPage from "./pages/AffiliateStatusPage";
import SitemapPage from "./pages/SitemapPage";
import CustomerPortalPage from "./pages/CustomerPortalPage";
import MarketplacePage from "./pages/MarketplacePage";
import MarketplaceSellerPage from "./pages/MarketplaceSellerPage";
import MarketplaceProductPage from "./pages/MarketplaceProductPage";
import MarketplaceSellerEditPage from "./pages/MarketplaceSellerEditPage";
import MarketplaceSellerSalesPage from "./pages/MarketplaceSellerSalesPage";
import MarketplaceSellerProfilePage from "./pages/MarketplaceSellerProfilePage";
import ArticlePage from "./pages/ArticlePage";
import ArticlesListPage from "./pages/ArticlesListPage";

// Providers and Components
import { AuthProvider } from "./hooks/useAuth";
import { CartProvider } from "./hooks/use-cart";
import { PCConfigProvider } from "./hooks/use-pc-configuration";
import { Toaster } from "@/components/ui/sonner";
import { MobileProvider } from "./hooks/use-mobile";
import { CheckoutProvider } from "./hooks/use-checkout";
import { CustomizerStateProvider } from "./hooks/use-customizer-state";
import { MarketplaceProvider } from "./hooks/use-marketplace";
import CrispChat from "./components/Chat/CrispChat";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <MobileProvider>
          <AuthProvider>
            <CartProvider>
              <PCConfigProvider>
                <CheckoutProvider>
                  <CustomizerStateProvider>
                    <MarketplaceProvider>
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/prebuilt" element={<PrebuiltPCs />} />
                        <Route path="/customize" element={<CustomizePage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/support" element={<SupportPage />} />
                        <Route path="/admin" element={<AdminPage />} />
                        <Route path="/checkout" element={<CheckoutPage />} />
                        <Route path="/order-tracking" element={<OrderTrackingPage />} />
                        <Route path="/auth" element={<AuthPage />} />
                        <Route path="/components" element={<ComponentsPage />} />
                        <Route path="/gaming-pcs" element={<GamingPCsPage />} />
                        <Route path="/workstations" element={<WorkstationsPage />} />
                        <Route path="/terms" element={<TermsPage />} />
                        <Route path="/privacy" element={<PrivacyPage />} />
                        <Route path="/order-success" element={<OrderSuccessPage />} />
                        <Route path="/cancelled" element={<OrderCancelledPage />} />
                        <Route path="/checkout/cancelled" element={<OrderCancelledPage />} />
                        <Route path="/affiliate/apply" element={<AffiliateApplicationPage />} />
                        <Route path="/affiliate/dashboard" element={<AffiliateDashboardPage />} />
                        <Route path="/affiliate/status" element={<AffiliateStatusPage />} />
                        <Route path="/sitemap" element={<SitemapPage />} />
                        <Route path="/account" element={<CustomerPortalPage />} />
                        <Route path="/marketplace" element={<MarketplacePage />} />
                        <Route path="/marketplace/sell" element={<MarketplaceSellerPage />} />
                        <Route path="/marketplace/product/:id" element={<MarketplaceProductPage />} />
                        <Route path="/marketplace/seller/edit" element={<MarketplaceSellerEditPage />} />
                        <Route path="/marketplace/seller/sales" element={<MarketplaceSellerSalesPage />} />
                        <Route path="/marketplace/seller/:slug" element={<MarketplaceSellerProfilePage />} />
                        <Route path="/article/:slug" element={<ArticlePage />} />
                        <Route path="/articles" element={<ArticlesListPage />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                      <CrispChat />
                    </MarketplaceProvider>
                  </CustomizerStateProvider>
                </CheckoutProvider>
              </PCConfigProvider>
            </CartProvider>
          </AuthProvider>
        </MobileProvider>
        <Toaster />
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;

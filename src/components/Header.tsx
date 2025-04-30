import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { CartDialog } from "./Cart/CartDialog";
import { Search, Menu, X, ShoppingCart, User, Package, FileText } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const Header = () => {
  const { currentUser } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const searchTerm = event.currentTarget.value;
      navigate(`/components?search=${searchTerm}`);
    }
  };

  return (
    <header className="bg-gaming-dark py-4 sticky top-0 z-40 border-b border-gaming-darker">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-gaming-blue">BattleforgePC</span>
          </Link>
        </div>

        {!isMobile && (
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Gaming PCs</NavigationMenuTrigger>
                <NavigationMenuContent className="bg-gaming-dark border border-gaming-blue/20">
                  <div className="grid gap-3 md:grid-cols-2 p-4 w-[400px]">
                    <Link to="/gaming-pcs" className="block p-3 hover:bg-gaming-accent/10 rounded-md">
                      <div className="text-sm font-medium">Ready-to-Ship Gaming PCs</div>
                      <div className="text-xs text-gray-400 mt-1">
                        Pre-built systems ready to game
                      </div>
                    </Link>
                    <Link to="/customize" className="block p-3 hover:bg-gaming-accent/10 rounded-md">
                      <div className="text-sm font-medium">Custom Gaming PCs</div>
                      <div className="text-xs text-gray-400 mt-1">
                        Build your dream gaming rig
                      </div>
                    </Link>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Workstations</NavigationMenuTrigger>
                <NavigationMenuContent className="bg-gaming-dark border border-gaming-blue/20">
                  <div className="p-4 w-[400px]">
                    <Link to="/workstations" className="block p-3 hover:bg-gaming-accent/10 rounded-md">
                      <div className="text-sm font-medium">Professional Workstations</div>
                      <div className="text-xs text-gray-400 mt-1">
                        High-performance systems for professional work
                      </div>
                    </Link>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Components</NavigationMenuTrigger>
                <NavigationMenuContent className="bg-gaming-dark border border-gaming-blue/20">
                  <div className="grid gap-3 md:grid-cols-2 p-4 w-[400px]">
                    <Link to="/components" className="block p-3 hover:bg-gaming-accent/10 rounded-md">
                      <div className="text-sm font-medium">PC Components</div>
                      <div className="text-xs text-gray-400 mt-1">
                        Individual PC parts and upgrades
                      </div>
                    </Link>
                    <Link to="/marketplace" className="block p-3 hover:bg-gaming-accent/10 rounded-md">
                      <div className="text-sm font-medium">Marketplace</div>
                      <div className="text-xs text-gray-400 mt-1">
                        Buy from third-party sellers
                      </div>
                    </Link>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link to="/support" className="flex items-center gap-1 px-4 py-2 text-sm">
                  <span>Support</span>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link to="/articles" className="flex items-center gap-1 px-4 py-2 text-sm">
                  <FileText className="h-4 w-4 mr-1" />
                  <span>Articles</span>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        )}

        <div className="flex items-center">
          {!isMobile ? (
            <>
              <Link to="/order-tracking" className="px-3 py-2 text-sm hover:text-gaming-blue">
                Track Order
              </Link>
              {currentUser ? (
                <Link to="/account" className="px-3 py-2 text-sm hover:text-gaming-blue">
                  Account
                </Link>
              ) : (
                <Link to="/auth" className="px-3 py-2 text-sm hover:text-gaming-blue">
                  Sign In
                </Link>
              )}
              <CartDialog />
            </>
          ) : (
            <>
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(true)}>
                <Menu className="h-6 w-6" />
              </Button>
              <CartDialog />
            </>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isMobile && mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/95 z-50 overflow-y-auto">
          <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center mb-8">
              <Link to="/" className="text-2xl font-bold text-gaming-blue">
                BattleforgePC
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                <X className="h-6 w-6" />
              </Button>
            </div>

            <nav className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-gaming-blue mb-2">Gaming PCs</h3>
                <Link
                  to="/gaming-pcs"
                  className="block py-2 border-b border-gaming-dark/20"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Ready-to-Ship Gaming PCs
                </Link>
                <Link
                  to="/customize"
                  className="block py-2 border-b border-gaming-dark/20"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Custom Gaming PCs
                </Link>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium text-gaming-blue mb-2">Workstations</h3>
                <Link
                  to="/workstations"
                  className="block py-2 border-b border-gaming-dark/20"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Professional Workstations
                </Link>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium text-gaming-blue mb-2">Components</h3>
                <Link
                  to="/components"
                  className="block py-2 border-b border-gaming-dark/20"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  PC Components
                </Link>
                <Link
                  to="/marketplace"
                  className="block py-2 border-b border-gaming-dark/20"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Marketplace
                </Link>
              </div>

              <div className="space-y-2">
                <Link
                  to="/support"
                  className="block py-2 border-b border-gaming-dark/20"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Support
                </Link>
                <Link
                  to="/articles"
                  className="block py-2 border-b border-gaming-dark/20"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Articles
                </Link>
                <Link
                  to="/order-tracking"
                  className="block py-2 border-b border-gaming-dark/20"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Track Order
                </Link>
                <Link
                  to={currentUser ? "/account" : "/auth"}
                  className="block py-2 border-b border-gaming-dark/20"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {currentUser ? "Account" : "Sign In"}
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

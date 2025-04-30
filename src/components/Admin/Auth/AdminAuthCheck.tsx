
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface AdminAuthCheckProps {
  isLoading: boolean;
  isAdmin: boolean;
}

export const AdminAuthCheck = ({ isLoading, isAdmin }: AdminAuthCheckProps) => {
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg">Verifying admin access...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center max-w-md p-8 bg-gaming-dark rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-4 text-red-500">Access Denied</h1>
            <p className="mb-6">You don't have permission to access the admin panel.</p>
            <Button onClick={() => window.location.href = "/"}>
              Return to Home
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return null;
};

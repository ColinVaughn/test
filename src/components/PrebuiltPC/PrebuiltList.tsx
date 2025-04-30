
import { useState } from "react";
import { PrebuiltPC } from "@/types/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PrebuiltGrid from "./PrebuiltGrid";
import PaymentModal from "../Payment/PaymentModal";
import { usePrebuilts } from "./hooks/usePrebuilts";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const PrebuiltList = () => {
  const [selectedPC, setSelectedPC] = useState<string | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const { prebuiltSystems, benchmarks, loading, error } = usePrebuilts();

  const openPaymentModal = (id: string) => {
    setSelectedPC(id);
    setIsPaymentModalOpen(true);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4">
        <div className="text-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-gaming-blue mx-auto mb-4" />
          <p className="text-gray-400">Loading our awesome prebuilt systems...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4">
        <div className="text-center py-16">
          <h3 className="text-xl text-gaming-red mb-4">Error</h3>
          <p className="mb-4">{error}</p>
          <Button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-gaming-blue hover:bg-gaming-blue/80"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <Tabs defaultValue="all" className="mb-12">
        <div className="flex justify-center mb-8">
          <TabsList className="bg-gaming-dark">
            <TabsTrigger value="all">All Systems</TabsTrigger>
            <TabsTrigger value="gaming">Gaming</TabsTrigger>
            <TabsTrigger value="streaming">Streaming</TabsTrigger>
            <TabsTrigger value="workstation">Workstation</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="mt-8">
          <PrebuiltGrid 
            prebuilts={prebuiltSystems} 
            openPaymentModal={openPaymentModal}
          />
        </TabsContent>

        <TabsContent value="gaming" className="mt-8">
          <PrebuiltGrid 
            prebuilts={prebuiltSystems.filter(pc => pc.category.toLowerCase().includes("gaming"))}
            openPaymentModal={openPaymentModal}
          />
        </TabsContent>

        <TabsContent value="streaming" className="mt-8">
          <PrebuiltGrid 
            prebuilts={prebuiltSystems.filter(pc => pc.category.toLowerCase().includes("streaming"))}
            openPaymentModal={openPaymentModal}
          />
        </TabsContent>

        <TabsContent value="workstation" className="mt-8">
          <PrebuiltGrid 
            prebuilts={prebuiltSystems.filter(pc => pc.category.toLowerCase().includes("work"))}
            openPaymentModal={openPaymentModal}
          />
        </TabsContent>
      </Tabs>

      {isPaymentModalOpen && selectedPC && (
        <PaymentModal 
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          product={prebuiltSystems.find(pc => pc.id === selectedPC)!}
        />
      )}
    </div>
  );
};

export default PrebuiltList;

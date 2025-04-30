
import { PrebuiltPC } from "@/types/types";
import PrebuiltCard from "./PrebuiltCard";

interface PrebuiltGridProps {
  prebuilts: PrebuiltPC[];
  openPaymentModal: (id: string) => void;
}

const PrebuiltGrid = ({ prebuilts, openPaymentModal }: PrebuiltGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {prebuilts.map(pc => (
        <PrebuiltCard 
          key={pc.id} 
          pc={pc} 
          openPaymentModal={openPaymentModal}
        />
      ))}
    </div>
  );
};

export default PrebuiltGrid;

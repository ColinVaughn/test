
import React from "react";
import { PrebuiltPC } from "@/types/types";
import { ResponsiveImage } from "@/components/ui/responsive-image";
import { Button } from "@/components/ui/button";
import { Cpu, HardDrive, MemoryStick, Fan, Zap } from "lucide-react";

interface PrebuiltCardProps {
  pc: PrebuiltPC;
  openPaymentModal: (id: string) => void;
}

const PrebuiltCard: React.FC<PrebuiltCardProps> = ({ pc, openPaymentModal }) => {
  // Calculate savings amount and percentage
  const savings = pc.originalPrice - pc.price;
  const savingsPercentage = Math.round((savings / pc.originalPrice) * 100);
  
  return (
    <div className="bg-gaming-dark border border-gaming-light-gray/20 rounded-lg overflow-hidden shadow-lg transform transition-all hover:scale-105">
      <div className="relative">
        <ResponsiveImage 
          src={pc.imageUrl || `https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=2000&auto=format`} 
          alt={pc.name} 
          aspectRatio={16/9} 
          className="w-full object-cover"
        />
        {pc.discount > 0 && (
          <div className="absolute top-0 right-0 bg-gaming-red text-white text-xs px-3 py-1 m-2 rounded-md font-bold">
            SAVE ${savings}
          </div>
        )}
        {pc.bestseller && (
          <div className="absolute top-0 left-0 bg-gaming-red text-white text-xs px-3 py-1 m-2 rounded-md font-bold uppercase">
            Best Seller
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-1">{pc.name}</h3>
        <p className="text-gray-400 text-sm mb-3">{pc.category}</p>
        
        {/* PC Specs */}
        <div className="space-y-2 mb-4 bg-gaming-darker/50 p-3 rounded-lg">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-gaming-blue" />
            <span className="text-sm text-gray-300">{pc.specs?.cpu || pc.cpu}</span>
          </div>
          <div className="flex items-center gap-2">
            <HardDrive className="h-4 w-4 text-gaming-purple" />
            <span className="text-sm text-gray-300">{pc.specs?.gpu || pc.gpu}</span>
          </div>
          <div className="flex items-center gap-2">
            <MemoryStick className="h-4 w-4 text-gaming-blue" />
            <span className="text-sm text-gray-300">{pc.specs?.ram || pc.ram}</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-gaming-yellow" />
            <span className="text-sm text-gray-300">{pc.specs?.storage || pc.storage}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <span className="text-gaming-blue font-bold text-xl">${pc.price}</span>
            {pc.discount > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-gray-500 line-through text-sm">${pc.originalPrice}</span>
                <span className="text-gaming-green text-xs font-bold">
                  -{savingsPercentage}%
                </span>
              </div>
            )}
          </div>
        </div>
        
        <Button className="w-full bg-gaming-blue hover:bg-gaming-blue/80" onClick={() => openPaymentModal(pc.id)}>
          Buy Now
        </Button>
      </div>
    </div>
  );
};

export default PrebuiltCard;

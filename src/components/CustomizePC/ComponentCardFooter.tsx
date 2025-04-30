
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface ComponentCardFooterProps {
  price: number;
  amazonLink?: string;
  isSelected: boolean;
}

const ComponentCardFooter = ({
  price,
  amazonLink,
  isSelected,
}: ComponentCardFooterProps) => {
  return (
    <div className="flex justify-between w-full items-center">
      <span className="text-lg font-bold text-gaming-blue">
        ${price.toFixed(2)}
      </span>
      <div className="flex gap-2">
        {amazonLink && (
          <Button 
            size="sm" 
            variant="outline" 
            className="border-gaming-blue/50 hover:border-gaming-blue hover:bg-gaming-blue/10"
            onClick={(e) => {
              e.stopPropagation();
              window.open(amazonLink, '_blank');
            }}
          >
            <ExternalLink size={16} className="mr-1" />
            Amazon
          </Button>
        )}
        <Button 
          size="sm" 
          className={isSelected ? "bg-green-600 hover:bg-green-700" : "bg-gaming-blue hover:bg-gaming-blue/80"}
        >
          {isSelected ? "Selected" : "Select"}
        </Button>
      </div>
    </div>
  );
};

export default ComponentCardFooter;


import { Button } from "@/components/ui/button";

interface BackButtonProps {
  onClick: () => void;
}

export default function BackButton({ onClick }: BackButtonProps) {
  return (
    <Button 
      variant="ghost" 
      onClick={onClick} 
      className="mb-4 hover:bg-gaming-light-gray/10"
    >
      ← Back to all orders
    </Button>
  );
}

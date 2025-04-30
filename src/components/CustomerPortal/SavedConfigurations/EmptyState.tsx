
import { CircleHelp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const EmptyState = () => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center py-6">
      <CircleHelp className="mx-auto h-8 w-8 text-gray-400 mb-2" />
      <p className="text-gray-500">No saved configurations yet</p>
      <Button 
        variant="outline" 
        className="mt-4" 
        onClick={() => navigate('/customize')}
      >
        Create New Configuration
      </Button>
    </div>
  );
};

export default EmptyState;

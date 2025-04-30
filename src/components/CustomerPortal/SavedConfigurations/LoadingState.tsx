
import { Loader2 } from "lucide-react";

const LoadingState = () => (
  <div className="flex justify-center items-center py-8">
    <Loader2 className="h-8 w-8 animate-spin text-gaming-blue" />
    <span className="ml-2 text-gray-500">Loading configurations...</span>
  </div>
);

export default LoadingState;

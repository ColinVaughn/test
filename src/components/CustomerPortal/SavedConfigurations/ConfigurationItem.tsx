
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { formatDate } from "./utils";
import { SavedConfig } from "./types";
import ConfigurationDetails from "./ConfigurationDetails";

interface ConfigurationItemProps {
  config: SavedConfig;
  onLoad: (config: SavedConfig) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
}

const ConfigurationItem = ({ config, onLoad, onDelete, isLoading }: ConfigurationItemProps) => {
  return (
    <div className="p-4 border rounded-lg flex justify-between items-center">
      <div>
        <p className="font-medium">{config.name}</p>
        <p className="text-sm text-gray-500">
          Saved on {formatDate(config.created_at)}
        </p>
      </div>
      <div className="space-x-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Details</Button>
          </DialogTrigger>
          <ConfigurationDetails config={config} />
        </Dialog>
        <Button 
          variant="outline"
          onClick={() => onLoad(config)}
          disabled={isLoading}
        >
          Load
        </Button>
        <Button
          variant="outline"
          className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
          onClick={() => onDelete(config.id)}
          disabled={isLoading}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ConfigurationItem;

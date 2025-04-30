
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CircleHelp, Trash, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type SavedConfig = {
  id: string;
  name: string;
  configuration: any;
  created_at: string;
};

const SavedConfigurations = () => {
  const { currentUser } = useAuth();
  const [configs, setConfigs] = useState<SavedConfig[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      fetchConfigurations();
    }
  }, [currentUser]);

  const fetchConfigurations = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('saved_configurations')
        .select('*')
        .eq('user_id', currentUser?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      console.log("Fetched configurations:", data);
      setConfigs(data || []);
      
      // Also log any local configurations
      const localConfigs = localStorage.getItem('savedConfigurations');
      console.log("Local configurations:", localConfigs ? JSON.parse(localConfigs) : 'None');
      
    } catch (error: any) {
      console.error('Error loading saved configurations:', error);
      toast.error('Error loading saved configurations');
    } finally {
      setIsLoading(false);
    }
  };

  const loadConfiguration = (config: SavedConfig) => {
    console.log("Loading configuration:", config);
    // Navigate to customize page with the configuration
    navigate('/customize', { state: { configuration: config.configuration } });
  };

  const deleteConfiguration = async (id: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('saved_configurations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Configuration deleted');
      fetchConfigurations();
    } catch (error: any) {
      console.error('Error deleting configuration:', error);
      toast.error('Error deleting configuration');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Saved PC Configurations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gaming-blue" />
            <span className="ml-2 text-gray-500">Loading configurations...</span>
          </div>
        )}
        
        {!isLoading && configs.length === 0 && (
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
        )}
        
        {configs.map((config) => (
          <div
            key={config.id}
            className="p-4 border rounded-lg flex justify-between items-center"
          >
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
                <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{config.name}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <h3 className="font-medium text-lg">Components</h3>
                    <div className="space-y-2">
                      {Object.entries(config.configuration)
                        .filter(([_, component]) => component !== null)
                        .map(([category, component]) => {
                          // Skip fans category as it has a different structure
                          if (category === 'fans' && component) {
                            const fanComponent = (component as any).component;
                            const quantity = (component as any).quantity;
                            if (fanComponent && quantity) {
                              return (
                                <div key={category} className="flex justify-between">
                                  <span className="font-medium">Fans:</span>
                                  <span>{quantity}x {fanComponent.name}</span>
                                </div>
                              );
                            }
                            return null;
                          }
                          
                          // Handle regular components
                          if (component && typeof component === 'object' && 'name' in component) {
                            return (
                              <div key={category} className="flex justify-between">
                                <span className="font-medium">{category.charAt(0).toUpperCase() + category.slice(1)}:</span>
                                <span>{(component as any).name}</span>
                              </div>
                            );
                          }
                          return null;
                        })}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Button 
                variant="outline"
                onClick={() => loadConfiguration(config)}
                disabled={isLoading}
              >
                Load
              </Button>
              <Button
                variant="outline"
                className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                onClick={() => deleteConfiguration(config.id)}
                disabled={isLoading}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default SavedConfigurations;


import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import EmptyState from "./EmptyState";
import LoadingState from "./LoadingState";
import ConfigurationItem from "./ConfigurationItem";
import { useConfigurationsData } from "./useConfigurationsData";

const SavedConfigurationsView = () => {
  const { configs, isLoading, loadConfiguration, deleteConfiguration } = useConfigurationsData();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Saved PC Configurations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && <LoadingState />}
        
        {!isLoading && configs.length === 0 && <EmptyState />}
        
        {configs.map((config) => (
          <ConfigurationItem
            key={config.id}
            config={config}
            onLoad={loadConfiguration}
            onDelete={deleteConfiguration}
            isLoading={isLoading}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default SavedConfigurationsView;

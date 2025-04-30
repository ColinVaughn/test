
import { PcConfiguration } from "@/types/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import SystemScoreChart from "./Performance/SystemScoreChart";
import GamePerformanceChart from "./Performance/GamePerformanceChart";
import PerformanceOverview from "./Performance/PerformanceOverview";

interface PerformanceTabProps {
  configuration: PcConfiguration;
}

const PerformanceTab = ({ configuration }: PerformanceTabProps) => {
  const gpu = configuration.gpu;
  const cpu = configuration.cpu;

  if (!gpu || !cpu) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Please select both a CPU and GPU to view performance estimates.
        </AlertDescription>
      </Alert>
    );
  }

  const gpuModel = gpu.name.match(/\d{4}/)?.[0] || "";

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <SystemScoreChart gpu={gpu} cpu={cpu} />
        <PerformanceOverview gpu={gpu} cpu={cpu} gpuModel={gpuModel} />
      </div>

      <Tabs defaultValue="1080p">
        <TabsList>
          <TabsTrigger value="1080p">1080p</TabsTrigger>
          <TabsTrigger value="1440p">1440p</TabsTrigger>
          <TabsTrigger value="4k">4K</TabsTrigger>
        </TabsList>

        <TabsContent value="1080p">
          <div className="space-y-6">
            <GamePerformanceChart gpuModel={gpuModel} type="AAA" />
            <GamePerformanceChart gpuModel={gpuModel} type="Esports" />
          </div>
        </TabsContent>

        <TabsContent value="1440p">
          <div className="space-y-6">
            <GamePerformanceChart gpuModel={gpuModel} type="AAA" resolutionMultiplier={0.7} />
            <GamePerformanceChart gpuModel={gpuModel} type="Esports" resolutionMultiplier={0.7} />
          </div>
        </TabsContent>

        <TabsContent value="4k">
          <div className="space-y-6">
            <GamePerformanceChart gpuModel={gpuModel} type="AAA" resolutionMultiplier={0.4} />
            <GamePerformanceChart gpuModel={gpuModel} type="Esports" resolutionMultiplier={0.4} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerformanceTab;


import { ComponentOption } from "@/types/types";
import { Card } from "@/components/ui/card";

interface PerformanceOverviewProps {
  gpu: ComponentOption;
  cpu: ComponentOption;
  gpuModel: string;
}

const PerformanceOverview = ({ gpu, cpu, gpuModel }: PerformanceOverviewProps) => {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Performance Overview</h3>
      <div className="space-y-2">
        <p className="text-sm">GPU: {gpu.name}</p>
        <p className="text-sm">CPU: {cpu.name}</p>
        <p className="text-sm">
          Recommended Resolution: {gpuModel >= "4080" ? "4K" : gpuModel >= "4070" ? "1440p" : "1080p"}
        </p>
      </div>
    </Card>
  );
};

export default PerformanceOverview;

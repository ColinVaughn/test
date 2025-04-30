
import { ComponentOption } from "@/types/types";
import { Card } from "@/components/ui/card";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts";
import { calculateSystemScore } from "@/utils/performanceCalculations";

interface SystemScoreChartProps {
  gpu: ComponentOption;
  cpu: ComponentOption;
}

const SystemScoreChart = ({ gpu, cpu }: SystemScoreChartProps) => {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">System Performance Score</h3>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={calculateSystemScore(gpu, cpu)}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis domain={[0, 100]} />
          <Radar dataKey="score" fill="#3b82f6" fillOpacity={0.6} />
        </RadarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default SystemScoreChart;


import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { calculatePerformanceData, GAME_BENCHMARKS } from "@/utils/performanceCalculations";

interface GamePerformanceChartProps {
  gpuModel: string;
  resolutionMultiplier?: number;
  type: "AAA" | "Esports";
}

const GamePerformanceChart = ({ gpuModel, resolutionMultiplier = 1, type }: GamePerformanceChartProps) => {
  const data = calculatePerformanceData(
    type === "AAA" ? GAME_BENCHMARKS["AAA Games"] : GAME_BENCHMARKS["Esports"],
    gpuModel,
    resolutionMultiplier
  );

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">
        {type === "AAA" ? "AAA Games Performance" : "Esports Titles Performance"}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        {type === "AAA" ? (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis label={{ value: 'FPS', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="Average FPS" fill="#3b82f6" />
            <Bar dataKey="1% Low FPS" fill="#818cf8" />
            <Bar dataKey="0.1% Low FPS" fill="#c7d2fe" />
          </BarChart>
        ) : (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis label={{ value: 'FPS', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Average FPS" stroke="#3b82f6" />
            <Line type="monotone" dataKey="1% Low FPS" stroke="#818cf8" />
            <Line type="monotone" dataKey="0.1% Low FPS" stroke="#c7d2fe" />
          </LineChart>
        )}
      </ResponsiveContainer>
    </Card>
  );
};

export default GamePerformanceChart;

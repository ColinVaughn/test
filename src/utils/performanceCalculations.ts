
import { ComponentOption } from "@/types/types";

export interface GameBenchmark {
  name: string;
  performance: Record<string, number>;
}

export const GAME_BENCHMARKS = {
  "AAA Games": [
    { name: "Cyberpunk 2077", performance: { "4060": 75, "4070": 95, "4080": 120, "4090": 144 } },
    { name: "Red Dead Redemption 2", performance: { "4060": 85, "4070": 105, "4080": 130, "4090": 144 } },
    { name: "Hogwarts Legacy", performance: { "4060": 70, "4070": 90, "4080": 115, "4090": 140 } },
    { name: "Call of Duty: Warzone", performance: { "4060": 90, "4070": 120, "4080": 144, "4090": 165 } }
  ],
  "Esports": [
    { name: "Counter-Strike 2", performance: { "4060": 240, "4070": 360, "4080": 400, "4090": 400 } },
    { name: "Valorant", performance: { "4060": 280, "4070": 400, "4080": 400, "4090": 400 } },
    { name: "Overwatch 2", performance: { "4060": 180, "4070": 240, "4080": 300, "4090": 360 } },
    { name: "Apex Legends", performance: { "4060": 144, "4070": 200, "4080": 240, "4090": 300 } }
  ]
};

export const PERFORMANCE_METRICS = {
  "1% Low FPS": 0.7,
  "0.1% Low FPS": 0.5,
  "Average FPS": 1
};

export const calculatePerformanceData = (
  games: GameBenchmark[],
  gpuModel: string,
  resolutionMultiplier = 1
) => {
  return games.map(game => {
    const baseFPS = game.performance[gpuModel as keyof typeof game.performance] || 0;
    const adjustedFPS = Math.floor(baseFPS * resolutionMultiplier);
    
    return {
      name: game.name,
      "Average FPS": adjustedFPS,
      "1% Low FPS": Math.floor(adjustedFPS * PERFORMANCE_METRICS["1% Low FPS"]),
      "0.1% Low FPS": Math.floor(adjustedFPS * PERFORMANCE_METRICS["0.1% Low FPS"])
    };
  });
};

export const calculateSystemScore = (gpu: ComponentOption, cpu: ComponentOption) => {
  const gpuModel = gpu.name.match(/\d{4}/)?.[0] || "";
  const scores = {
    gaming: Math.floor((parseInt(gpuModel) / 4090) * 100),
    productivity: Math.min(100, Math.floor(((cpu?.specs?.cores ? parseInt(cpu.specs.cores) : 8) / 16) * 100)),
    thermals: Math.floor(Math.random() * 20 + 80),
    noise: Math.floor(Math.random() * 20 + 80),
  };
  
  return [
    { subject: 'Gaming', score: scores.gaming },
    { subject: 'Productivity', score: scores.productivity },
    { subject: 'Thermals', score: scores.thermals },
    { subject: 'Noise', score: scores.noise },
  ];
};

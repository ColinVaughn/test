
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NewBenchmark } from "../types/AdminTypes";

interface BenchmarkFormProps {
  onSubmit: (benchmark: NewBenchmark) => void;
}

export default function BenchmarkForm({ onSubmit }: BenchmarkFormProps) {
  const [newBenchmark, setNewBenchmark] = useState<NewBenchmark>({
    game: '',
    fps: 0,
  });

  return (
    <div className="space-y-4">
      <div>
        <Label>Benchmark Game</Label>
        <Input
          value={newBenchmark.game}
          onChange={(e) => setNewBenchmark({...newBenchmark, game: e.target.value})}
          placeholder="Enter game name"
        />
      </div>
      <div>
        <Label>Benchmark FPS</Label>
        <Input
          type="number"
          value={newBenchmark.fps}
          onChange={(e) => setNewBenchmark({...newBenchmark, fps: Number(e.target.value)})}
          placeholder="Enter FPS"
        />
      </div>
      <button 
        onClick={() => onSubmit(newBenchmark)}
        className="w-full bg-gaming-blue hover:bg-gaming-blue/80 text-white px-4 py-2 rounded"
      >
        Add Benchmark
      </button>
    </div>
  );
}


export const GAME_REQUIREMENTS = {
  "Cyberpunk 2077": { cpuIntensive: true, gpuIntensive: true, ramMin: "16GB", storageMin: "1TB", recommendedGpu: "RTX 3070" },
  "Red Dead Redemption 2": { cpuIntensive: true, gpuIntensive: true, ramMin: "16GB", storageMin: "1TB", recommendedGpu: "RTX 3060" },
  "Call of Duty: Warzone": { cpuIntensive: true, gpuIntensive: true, ramMin: "16GB", storageMin: "500GB", recommendedGpu: "RTX 3060" },
  "Assassin's Creed Valhalla": { cpuIntensive: true, gpuIntensive: true, ramMin: "16GB", storageMin: "500GB", recommendedGpu: "RTX 3060" },
  "Hogwarts Legacy": { cpuIntensive: true, gpuIntensive: true, ramMin: "16GB", storageMin: "1TB", recommendedGpu: "RTX 3070" },
  "Counter-Strike 2": { cpuIntensive: true, gpuIntensive: false, ramMin: "16GB", storageMin: "250GB", recommendedGpu: "RTX 3050" },
  "Fortnite": { cpuIntensive: true, gpuIntensive: false, ramMin: "16GB", storageMin: "250GB", recommendedGpu: "RTX 3050" },
  "Apex Legends": { cpuIntensive: true, gpuIntensive: false, ramMin: "16GB", storageMin: "250GB", recommendedGpu: "RTX 3050" },
  "Overwatch 2": { cpuIntensive: false, gpuIntensive: false, ramMin: "16GB", storageMin: "250GB", recommendedGpu: "RTX 3050" },
  "Valorant": { cpuIntensive: true, gpuIntensive: false, ramMin: "16GB", storageMin: "250GB", recommendedGpu: "GTX 1660" },
  "League of Legends": { cpuIntensive: false, gpuIntensive: false, ramMin: "8GB", storageMin: "250GB", recommendedGpu: "GTX 1650" },
  "Minecraft": { cpuIntensive: true, gpuIntensive: false, ramMin: "8GB", storageMin: "250GB", recommendedGpu: "GTX 1650" },
  "Rocket League": { cpuIntensive: false, gpuIntensive: false, ramMin: "8GB", storageMin: "250GB", recommendedGpu: "GTX 1650" },
  "World of Warcraft": { cpuIntensive: true, gpuIntensive: false, ramMin: "16GB", storageMin: "500GB", recommendedGpu: "GTX 1660" },
  "The Sims 4": { cpuIntensive: false, gpuIntensive: false, ramMin: "8GB", storageMin: "500GB", recommendedGpu: "GTX 1650" }
} as const;

export const analyzeGameRequirements = (games: string[]) => {
  const gameSet = new Set(games);
  const requirements = Array.from(gameSet).map(game => 
    GAME_REQUIREMENTS[game as keyof typeof GAME_REQUIREMENTS] || {
      cpuIntensive: false,
      gpuIntensive: false,
      ramMin: "8GB",
      storageMin: "250GB"
    }
  );

  return {
    needsHighCpu: requirements.some(req => req.cpuIntensive),
    needsHighGpu: requirements.some(req => req.gpuIntensive),
    minRam: requirements.reduce((max, game) => {
      const currentSize = parseInt(game.ramMin);
      const maxSize = parseInt(max);
      return currentSize > maxSize ? game.ramMin : max;
    }, "8GB"),
    minStorage: requirements.reduce((max, game) => {
      const currentSize = parseInt(game.storageMin);
      const maxSize = parseInt(max);
      return currentSize > maxSize ? game.storageMin : max;
    }, "250GB")
  };
};

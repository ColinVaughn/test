
import React from 'react';
import { FormItem, FormLabel } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { WizardFormData } from "@/types/wizardTypes";

// Enhanced game list with better categorization
const GAME_OPTIONS = [
  // AAA / Graphically intensive
  "Cyberpunk 2077",
  "Red Dead Redemption 2",
  "Call of Duty: Warzone",
  "Assassin's Creed Valhalla",
  "Hogwarts Legacy",
  // Popular Competitive
  "Counter-Strike 2",
  "Fortnite",
  "Apex Legends",
  "Overwatch 2",
  "Valorant",
  // Less demanding games
  "League of Legends",
  "Minecraft",
  "Rocket League",
  "World of Warcraft",
  "The Sims 4"
];

// Group games by their performance demands
const GAME_CATEGORIES = {
  "High Performance": ["Cyberpunk 2077", "Red Dead Redemption 2", "Call of Duty: Warzone", "Assassin's Creed Valhalla", "Hogwarts Legacy"],
  "Competitive": ["Counter-Strike 2", "Fortnite", "Apex Legends", "Overwatch 2", "Valorant"],
  "Casual": ["League of Legends", "Minecraft", "Rocket League", "World of Warcraft", "The Sims 4"]
};

// Enhanced AI game analysis information
const GAME_PERFORMANCE_INFO = {
  "Cyberpunk 2077": {
    cpuDemand: "high",
    gpuDemand: "very high",
    ramDemand: "high",
    storageDemand: "high",
    optimizedFor: "Ray Tracing, DLSS"
  },
  "Valorant": {
    cpuDemand: "medium",
    gpuDemand: "low",
    ramDemand: "low",
    storageDemand: "low",
    optimizedFor: "High FPS, Low Latency" 
  }
  // Additional games would be added here
};

interface GameSelectorProps {
  form: UseFormReturn<WizardFormData>;
}

const GameSelector = ({ form }: GameSelectorProps) => {
  // Ensure games array is initialized
  React.useEffect(() => {
    if (!form.getValues().games) {
      form.setValue("games", []);
    }
  }, [form]);

  // Prepare state for most played games (to suggest the most important optimization targets)
  const [mostPlayed, setMostPlayed] = React.useState<string[]>([]);

  return (
    <FormItem>
      <FormLabel>Select Games You Play</FormLabel>
      
      <div className="space-y-4">
        {Object.entries(GAME_CATEGORIES).map(([category, games]) => (
          <div key={category} className="space-y-2">
            <h4 className="text-sm font-medium text-gray-300">{category}</h4>
            <div className="grid grid-cols-1 gap-2 border rounded-lg p-2 bg-opacity-20 bg-gray-800">
              {games.map((game) => (
                <div key={game} className="flex items-center space-x-2">
                  <Checkbox
                    id={game}
                    checked={(form.watch("games") || []).includes(game)}
                    onCheckedChange={(checked) => {
                      const currentGames = form.watch("games") || [];
                      if (checked) {
                        form.setValue("games", [...currentGames, game]);
                        
                        // If one of the first 3 selected games, mark as most played
                        if (currentGames.length < 3 && !mostPlayed.includes(game)) {
                          setMostPlayed([...mostPlayed, game]);
                        }
                      } else {
                        form.setValue("games", currentGames.filter(g => g !== game));
                        // Remove from most played if unchecked
                        setMostPlayed(mostPlayed.filter(g => g !== game));
                      }
                    }}
                  />
                  <label htmlFor={game} className="text-sm">{game}</label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {(form.watch("games")?.length > 0) && (
        <div className="mt-4 text-xs text-gray-400">
          Selected {form.watch("games")?.length} games. The AI will optimize your build for these titles.
        </div>
      )}
    </FormItem>
  );
};

export default GameSelector;

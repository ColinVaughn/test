
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { PcConfiguration } from "@/types/types";
import { Wrench, Youtube } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ScrollArea } from "@/components/ui/scroll-area";
import { isFanConfiguration, isComponentOption } from "@/utils/typeGuards";

interface BuildGuideProps {
  configuration: PcConfiguration;
}

const BuildGuide = ({ configuration }: BuildGuideProps) => {
  const selectedComponents = Object.entries(configuration).filter(([categoryId, component]) => 
    component !== null && categoryId !== 'fans'
  );
  
  // Handle fans separately if present
  const hasFans = configuration.fans !== null && configuration.fans !== undefined;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full bg-gaming-dark border-gaming-blue/50 hover:border-gaming-blue hover:bg-gaming-blue/10 text-white">
          <Wrench className="mr-2 h-4 w-4" />
          Build it yourself
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[90vw] sm:w-[540px] bg-gaming-dark border-gaming-light-gray/20 flex flex-col p-0">
        <div className="p-6 pb-0">
          <SheetHeader>
            <SheetTitle className="text-gaming-blue">Build Guide</SheetTitle>
            <SheetDescription>
              Follow this guide to build your custom PC with the selected components
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6">
            <AspectRatio ratio={16 / 9} className="bg-gaming-darker rounded-lg overflow-hidden">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/DC-Xn2C_L1U"
                title="How to Build a PC"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="border-0"
              />
            </AspectRatio>
          </div>
        </div>

        <ScrollArea className="flex-1 p-6 pt-3">
          <div className="mt-3">
            <h3 className="text-lg font-semibold mb-4">Your Components</h3>
            <div className="space-y-4">
              {selectedComponents.map(([category, component]) => {
                // Skip if component is null
                if (!component) return null;
                
                // Make sure component is a ComponentOption
                if (!isComponentOption(component)) return null;
                
                return (
                  <div key={category} className="bg-gaming-darker p-4 rounded-lg">
                    <h4 className="text-sm text-gray-400 mb-1 capitalize">{category}</h4>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{component.name}</p>
                        <p className="text-sm text-gray-400">{component.brand}</p>
                      </div>
                      {component.amazonLink && (
                        <a
                          href={component.amazonLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gaming-blue hover:text-gaming-blue/80 text-sm flex items-center"
                        >
                          <Youtube className="w-4 h-4 mr-1" />
                          Buy on Amazon
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
              
              {/* Display fans if selected */}
              {hasFans && isFanConfiguration(configuration.fans) && (
                <div className="bg-gaming-darker p-4 rounded-lg">
                  <h4 className="text-sm text-gray-400 mb-1 capitalize">Additional Fans</h4>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">
                        {configuration.fans.quantity}× {configuration.fans.component.name}
                      </p>
                      <p className="text-sm text-gray-400">{configuration.fans.component.brand}</p>
                    </div>
                    {configuration.fans.component.amazonLink && (
                      <a
                        href={configuration.fans.component.amazonLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gaming-blue hover:text-gaming-blue/80 text-sm flex items-center"
                      >
                        <Youtube className="w-4 h-4 mr-1" />
                        Buy on Amazon
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default BuildGuide;

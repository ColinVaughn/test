
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PrebuiltPC, Benchmark } from "@/types/types";
import { prebuiltSystems as staticPrebuiltSystems } from "@/data/prebuiltSystems";

export const usePrebuilts = () => {
  const [prebuiltSystems, setPrebuiltSystems] = useState<PrebuiltPC[]>([]);
  const [benchmarks, setBenchmarks] = useState<{[key: string]: Benchmark[]}>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrebuiltSystems = async () => {
      try {
        setLoading(true);
        
        const { data: systems, error: systemsError } = await supabase
          .from('prebuilt_systems')
          .select('*');
          
        if (systemsError) throw systemsError;
        
        if (systems && systems.length > 0) {
          const mappedSystems: PrebuiltPC[] = systems.map(system => ({
            id: system.id,
            name: system.name,
            price: system.price,
            originalPrice: system.original_price,
            discount: system.discount,
            category: system.category,
            bestseller: system.bestseller,
            featured: system.featured,
            new: system.new,
            description: system.description || "",
            imageUrl: system.image_url,
            gallery: system.gallery,
            specs: system.specs as Record<string, string>,
            rating: system.rating,
            reviews: system.reviews
          }));
          
          setPrebuiltSystems(mappedSystems);
          
          const { data: benchmarkData, error: benchmarksError } = await supabase
            .from('prebuilt_benchmarks')
            .select('*');
            
          if (benchmarksError) throw benchmarksError;
          
          const benchmarksBySystem: {[key: string]: Benchmark[]} = {};
          benchmarkData?.forEach((benchmark: any) => {
            if (!benchmarksBySystem[benchmark.prebuilt_id]) {
              benchmarksBySystem[benchmark.prebuilt_id] = [];
            }
            benchmarksBySystem[benchmark.prebuilt_id].push({
              game: benchmark.game,
              fps: benchmark.fps
            });
          });
          
          setBenchmarks(benchmarksBySystem);
        } else {
          const formattedDemoData = staticPrebuiltSystems.map(system => ({
            id: system.id.toString(),
            name: system.name,
            price: system.price,
            originalPrice: system.originalPrice,
            discount: system.discount,
            category: system.category,
            bestseller: system.bestseller,
            featured: false,
            new: false,
            description: `High performance ${system.category.toLowerCase()}`,
            imageUrl: system.imageUrl,
            specs: {
              cpu: system.cpu,
              gpu: system.gpu,
              ram: system.ram,
              storage: system.storage,
              cooling: system.cooling,
              psu: system.psu
            }
          }));
          
          setPrebuiltSystems(formattedDemoData);
          
          const demoBenchmarks: {[key: string]: Benchmark[]} = {};
          staticPrebuiltSystems.forEach(system => {
            demoBenchmarks[system.id.toString()] = system.benchmarks;
          });
          
          setBenchmarks(demoBenchmarks);
        }
      } catch (err: any) {
        console.error("Error fetching prebuilt systems:", err.message);
        setError("Failed to load prebuilt systems. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchPrebuiltSystems();
  }, []);

  return { prebuiltSystems, benchmarks, loading, error };
};

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PrebuiltPC, Benchmark } from "@/types/types";
import { toast } from "sonner";
import PrebuiltForm from "./PrebuiltSystems/PrebuiltForm";
import BenchmarkForm from "./PrebuiltSystems/BenchmarkForm";
import PrebuiltTable from "./PrebuiltSystems/PrebuiltTable";
import { NewPrebuiltSystem, NewBenchmark } from "./types/AdminTypes";

export default function AdminPrebuiltManager() {
  const [prebuiltSystems, setPrebuiltSystems] = useState<PrebuiltPC[]>([]);
  const [benchmarks, setBenchmarks] = useState<Benchmark[]>([]);

  useEffect(() => {
    fetchPrebuiltSystems();
  }, []);

  const fetchPrebuiltSystems = async () => {
    try {
      const { data, error } = await supabase
        .from('prebuilt_systems')
        .select('*');
      
      if (error) throw error;
      
      const mappedData = data?.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        originalPrice: item.original_price,
        discount: item.discount,
        category: item.category,
        imageUrl: item.image_url,
        specs: item.specs,
        bestseller: item.bestseller,
        featured: item.featured,
        new: item.new,
        description: item.description,
        gallery: item.gallery,
        rating: item.rating,
        reviews: item.reviews,
      }));
      
      setPrebuiltSystems(mappedData as PrebuiltPC[]);
    } catch (error) {
      console.error('Error fetching prebuilt systems:', error);
      toast.error('Failed to load prebuilt systems');
    }
  };

  const fetchBenchmarks = async (prebuiltId: string) => {
    try {
      const { data, error } = await supabase
        .from('prebuilt_benchmarks')
        .select('*')
        .eq('prebuilt_id', prebuiltId);
      
      if (error) throw error;
      
      setBenchmarks(data.map(item => ({
        game: item.game,
        fps: item.fps
      })) as Benchmark[]);
    } catch (error) {
      console.error('Error fetching benchmarks:', error);
      toast.error('Failed to load benchmarks');
    }
  };

  const handleCreatePrebuiltSystem = async (newSystem: NewPrebuiltSystem) => {
    try {
      const systemToInsert = {
        name: newSystem.name,
        price: newSystem.price,
        original_price: newSystem.originalPrice,
        discount: newSystem.discount,
        category: newSystem.category,
        image_url: newSystem.imageUrl,
        specs: newSystem.specs,
        bestseller: newSystem.bestseller,
        featured: newSystem.featured,
        new: newSystem.new,
        description: newSystem.description || '',
      };

      const { data, error } = await supabase
        .from('prebuilt_systems')
        .insert(systemToInsert)
        .select();
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const createdSystem = {
          id: data[0].id,
          name: data[0].name,
          price: data[0].price,
          originalPrice: data[0].original_price,
          discount: data[0].discount,
          category: data[0].category,
          imageUrl: data[0].image_url,
          specs: data[0].specs,
          bestseller: data[0].bestseller,
          featured: data[0].featured,
          new: data[0].new,
          description: data[0].description,
          gallery: data[0].gallery,
          rating: data[0].rating,
          reviews: data[0].reviews,
        };
        
        setPrebuiltSystems([...prebuiltSystems, createdSystem as PrebuiltPC]);
        
        toast.success('Prebuilt system created successfully');
      }
    } catch (error) {
      console.error('Error creating prebuilt system:', error);
      toast.error('Failed to create prebuilt system');
    }
  };

  const handleCreateBenchmark = async (newBenchmark: NewBenchmark) => {
    try {
      const { data: prebuiltData, error: prebuiltError } = await supabase
        .from('prebuilt_systems')
        .select('id')
        .order('id', { ascending: false })
        .limit(1);
      
      if (prebuiltError) throw prebuiltError;
      
      if (prebuiltData && prebuiltData.length > 0) {
        const latestPrebuiltId = prebuiltData[0].id;
        
        const { error: insertError } = await supabase
          .from('prebuilt_benchmarks')
          .insert({
            prebuilt_id: latestPrebuiltId,
            game: newBenchmark.game,
            fps: newBenchmark.fps
          });
        
        if (insertError) throw insertError;
        
        toast.success('Benchmark added successfully');
      } else {
        toast.error('No prebuilt systems found to attach the benchmark to.');
      }
    } catch (error) {
      console.error('Error creating benchmark:', error);
      toast.error('Failed to create benchmark');
    }
  };

  return (
    <div className="bg-gaming-dark/30 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Prebuilt Systems Management</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Create New System</h3>
          <PrebuiltForm onSubmit={handleCreatePrebuiltSystem} />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4">Add Benchmark</h3>
          <BenchmarkForm onSubmit={handleCreateBenchmark} />
        </div>
      </div>
      
      <div className="mt-8">
        <PrebuiltTable 
          prebuiltSystems={prebuiltSystems}
          onViewBenchmarks={fetchBenchmarks}
          benchmarks={benchmarks}
        />
      </div>
    </div>
  );
}

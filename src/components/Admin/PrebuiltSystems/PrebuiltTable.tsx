
import { PrebuiltPC, Benchmark } from "@/types/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface PrebuiltTableProps {
  prebuiltSystems: PrebuiltPC[];
  onViewBenchmarks: (id: string) => void;
  benchmarks: Benchmark[];
}

export default function PrebuiltTable({ 
  prebuiltSystems, 
  onViewBenchmarks,
  benchmarks 
}: PrebuiltTableProps) {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {prebuiltSystems.map((system) => (
            <TableRow key={system.id}>
              <TableCell>{system.name}</TableCell>
              <TableCell>{system.category}</TableCell>
              <TableCell>${system.price}</TableCell>
              <TableCell>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onViewBenchmarks(system.id)}
                >
                  View Benchmarks
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {benchmarks.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Benchmarks</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Game</TableHead>
                <TableHead>FPS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {benchmarks.map((benchmark, index) => (
                <TableRow key={index}>
                  <TableCell>{benchmark.game}</TableCell>
                  <TableCell>{benchmark.fps}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}

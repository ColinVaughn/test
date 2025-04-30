
import { useState, useEffect } from "react";
import { Table, TableHeader, TableRow, TableHead, TableCell, TableBody } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";

type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
};

const mockProducts: Product[] = [
  {
    id: "1",
    name: "RGB Gaming PC",
    price: 1499.99,
    category: "Pre-built PC",
    stock: 5
  },
  {
    id: "2",
    name: "Pro Workstation",
    price: 2499.99,
    category: "Workstation",
    stock: 3
  },
  {
    id: "3",
    name: "Entry Gaming PC",
    price: 899.99,
    category: "Pre-built PC",
    stock: 8
  }
];

export default function AdminProductManager() {
  const [products] = useState<Product[]>(mockProducts);

  return (
    <div className="bg-gaming-dark/30 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <Package className="h-6 w-6" />
        <h2 className="text-xl font-semibold">Product Management</h2>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>${product.price.toFixed(2)}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>
                <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                  {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

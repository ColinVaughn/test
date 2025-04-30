import {
  Users,
  ShoppingCart,
  Package,
  Tags,
  BarChart,
  Package2,
  Store,
  FileText,
  Laptop,
  Ticket,
  RotateCcw
} from "lucide-react";

export const adminTabs = [
  { value: 'orders', icon: ShoppingCart, label: 'Orders' },
  { value: 'users', icon: Users, label: 'Users' },
  { value: 'products', icon: Package, label: 'Products' },
  { value: 'prebuilt', icon: Package2, label: 'Prebuilt' },
  { value: 'coupons', icon: Tags, label: 'Coupons' },
  { value: 'affiliates', icon: BarChart, label: 'Affiliates' },
  { value: 'marketplace', icon: Store, label: 'Marketplace' },
  { value: 'articles', icon: FileText, label: 'Articles' }
] as const;

export const tabItems = [
  {
    id: "orders",
    label: "Orders",
    icon: ShoppingCart,
  },
  {
    id: "users",
    label: "Users",
    icon: Users,
  },
  {
    id: "products",
    label: "Products",
    icon: Package,
  },
  {
    id: "prebuilt",
    label: "Prebuilt",
    icon: Laptop,
  },
  {
    id: "coupons",
    label: "Coupons",
    icon: Ticket,
  },
  {
    id: "affiliates",
    label: "Affiliates",
    icon: Users,
  },
  {
    id: "articles",
    label: "Articles",
    icon: FileText,
  },
  {
    id: "rma",
    label: "RMA",
    icon: RotateCcw,
  },
  {
    id: "marketplace",
    label: "Marketplace",
    icon: Store,
  },
];

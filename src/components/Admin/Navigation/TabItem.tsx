
import React from 'react';
import { TabsTrigger } from "@/components/ui/tabs";
import { LucideIcon } from "lucide-react";

interface TabItemProps {
  value: string;
  icon: LucideIcon;
  label: string;
}

export const TabItem = ({ value, icon: Icon, label }: TabItemProps) => {
  return (
    <TabsTrigger value={value} className="flex items-center">
      <Icon className="h-4 w-4 mr-2" />
      {label}
    </TabsTrigger>
  );
};


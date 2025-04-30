
import React from 'react';
import { TabsList } from "@/components/ui/tabs";
import { TabItem } from "./TabItem";
import { adminTabs } from "./tabsConfig";

export const AdminTabs = () => {
  return (
    <TabsList className="flex flex-wrap mb-6">
      {adminTabs.map((tab) => (
        <TabItem
          key={tab.value}
          value={tab.value}
          icon={tab.icon}
          label={tab.label}
        />
      ))}
    </TabsList>
  );
};


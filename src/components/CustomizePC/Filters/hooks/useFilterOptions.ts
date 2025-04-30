
import { ComponentOption } from "@/types/types";
import { Database, HardDriveDownload, Power, Thermometer, MemoryStick, PcCase, Wifi } from "lucide-react";
import React from "react";

export const useFilterOptions = (
  category: string,
  options: ComponentOption[],
  showSocketFilter: boolean,
  showWifiFilter: boolean,
  showStorageFilters: boolean,
  showPsuFilters: boolean,
  showCaseFilters: boolean,
  showCoolerFilters: boolean,
  showMemoryFilters: boolean
) => {
  // Extract unique values from component options
  const brands = [...new Set(options.map(comp => comp.brand))];
  const sockets = [...new Set(options.map(comp => comp.specs.socket).filter(Boolean))];
  const interfaces = [...new Set(options.map(comp => comp.specs.interface).filter(Boolean))];
  const capacities = [...new Set(options.map(comp => comp.specs.capacity).filter(Boolean))];
  const wattages = [...new Set(options.map(comp => comp.specs.wattage).filter(Boolean))];
  const formFactors = [...new Set(options.map(comp => comp.specs.formFactor).filter(Boolean))];
  const coolingTypes = [...new Set(options.map(comp => comp.specs.type).filter(Boolean))];
  const memoryTypes = [...new Set(options.map(comp => comp.specs.memoryType).filter(Boolean))];
  const memorySpeeds = [...new Set(options.map(comp => comp.specs.speed).filter(Boolean))];

  // Create lucide React elements
  const wifiIcon = React.createElement(Wifi, { className: "mr-2 h-4 w-4" });
  const databaseIcon = React.createElement(Database, { className: "mr-2 h-4 w-4" });
  const hardDriveIcon = React.createElement(HardDriveDownload, { className: "mr-2 h-4 w-4" });
  const powerIcon = React.createElement(Power, { className: "mr-2 h-4 w-4" });
  const pcCaseIcon = React.createElement(PcCase, { className: "mr-2 h-4 w-4" });
  const thermometerIcon = React.createElement(Thermometer, { className: "mr-2 h-4 w-4" });
  const memoryStickIcon = React.createElement(MemoryStick, { className: "mr-2 h-4 w-4" });

  const filterOptions = [
    ...(showSocketFilter && sockets.length > 0
      ? [
          { label: "All Sockets", value: null },
          ...sockets.map(socket => ({ label: socket, value: socket })),
          { label: "Socket Type", value: null, separator: true },
        ]
      : []
    ),
    ...(showWifiFilter
      ? [
          { label: "WiFi", value: null },
          { label: "All Boards", value: null, icon: wifiIcon },
          { label: "With WiFi", value: "true" },
          { label: "Without WiFi", value: "false" },
          { label: "WiFi Options", value: null, separator: true },
        ]
      : []
    ),
    ...(showStorageFilters
      ? [
          { label: "Interface", value: null },
          { label: "All Interfaces", value: null, icon: databaseIcon },
          ...interfaces.map(interface_ => ({ label: interface_, value: interface_ })),
          { label: "Interface Options", value: null, separator: true },
          { label: "Capacity", value: null },
          { label: "All Capacities", value: null, icon: hardDriveIcon },
          ...capacities.map(capacity => ({ label: capacity, value: capacity })),
          { label: "Capacity Options", value: null, separator: true },
        ]
      : []
    ),
    ...(showPsuFilters && wattages.length > 0
      ? [
          { label: "Wattage", value: null },
          { label: "All Wattages", value: null, icon: powerIcon },
          ...wattages.map(wattage => ({ label: wattage, value: wattage })),
          { label: "Wattage Options", value: null, separator: true },
        ]
      : []
    ),
    ...(showCaseFilters && formFactors.length > 0
      ? [
          { label: "Form Factor", value: null },
          { label: "All Form Factors", value: null, icon: pcCaseIcon },
          ...formFactors.map(formFactor => ({ label: formFactor, value: formFactor })),
          { label: "Form Factor Options", value: null, separator: true },
        ]
      : []
    ),
    ...(showCoolerFilters && coolingTypes.length > 0
      ? [
          { label: "Cooling Type", value: null },
          { label: "All Types", value: null, icon: thermometerIcon },
          ...coolingTypes.map(type => ({ label: type, value: type })),
          { label: "Cooling Type Options", value: null, separator: true },
        ]
      : []
    ),
    ...(showMemoryFilters
      ? [
          { label: "Memory Type", value: null },
          { label: "All Types", value: null, icon: memoryStickIcon },
          ...memoryTypes.map(type => ({ label: type, value: type })),
          { label: "Memory Type Options", value: null, separator: true },
          { label: "Memory Speed", value: null },
          ...memorySpeeds.map(speed => ({ label: speed, value: speed })),
        ]
      : []
    ),
  ];

  return filterOptions;
};

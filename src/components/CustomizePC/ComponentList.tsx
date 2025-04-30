
import { ComponentCategory, ComponentOption } from "@/types/types";
import FilterBar from "./List/FilterBar";
import ComponentGrid from "./List/ComponentGrid";
import { useComponentFilters } from "./List/useComponentFilters";
import { useFilterOptions } from "./Filters/hooks/useFilterOptions";
import { FilterHandlers } from "./Filters/FilterHandlers";

interface ComponentListProps {
  category: ComponentCategory;
  selectedComponent: ComponentOption | null;
  onSelectComponent: (component: ComponentOption) => void;
  compatibleComponents?: ComponentOption[];
}

const ComponentList = ({
  category,
  selectedComponent,
  onSelectComponent,
  compatibleComponents,
}: ComponentListProps) => {
  const {
    selectedColors,
    setSelectedColors,
    selectedCoolerColors,
    setSelectedCoolerColors,
    selectedCoolerSizes,
    setSelectedCoolerSizes,
    selectedRamSizes,
    setSelectedRamSizes,
    searchTerm,
    setSearchTerm,
    sortOption,
    setSortOption,
    filters,
    setFilters,
    filteredComponents
  } = useComponentFilters(compatibleComponents || category.options);

  // Determine which filters to show based on category
  const showSocketFilter = category.id === 'cpu' || category.id === 'motherboard';
  const showWifiFilter = category.id === 'motherboard';
  const showStorageFilters = category.id === 'storage';
  const showPsuFilters = category.id === 'psu';
  const showCaseFilters = category.id === 'case';
  const showCoolerFilters = category.id === 'cooler';
  const showMemoryFilters = category.id === 'ram';

  const filterOptions = useFilterOptions(
    category.id,
    category.options,
    showSocketFilter,
    showWifiFilter,
    showStorageFilters,
    showPsuFilters,
    showCaseFilters,
    showCoolerFilters,
    showMemoryFilters
  );

  // Extract unique values for filters
  const sockets = [...new Set(category.options.map(comp => comp.specs.socket).filter(Boolean))];
  const interfaces = [...new Set(category.options.map(comp => comp.specs.interface).filter(Boolean))];
  const capacities = [...new Set(category.options.map(comp => comp.specs.capacity).filter(Boolean))];
  const wattages = [...new Set(category.options.map(comp => comp.specs.wattage).filter(Boolean))];
  const formFactors = [...new Set(category.options.map(comp => comp.specs.formFactor).filter(Boolean))];
  const coolingTypes = [...new Set(category.options.map(comp => comp.specs.type).filter(Boolean))];
  const memoryTypes = [...new Set(category.options.map(comp => comp.specs.memoryType).filter(Boolean))];
  const memorySpeeds = [...new Set(category.options.map(comp => comp.specs.speed).filter(Boolean))];

  const activeFilters = [
    filters.brand && {
      type: 'Brand',
      value: filters.brand,
      onRemove: () => setFilters(prev => ({ ...prev, brand: null })),
    },
    filters.socket && {
      type: 'Socket',
      value: filters.socket,
      onRemove: () => setFilters(prev => ({ ...prev, socket: null })),
    },
    filters.wifi !== null && {
      type: 'WiFi',
      value: filters.wifi ? 'Yes' : 'No',
      onRemove: () => setFilters(prev => ({ ...prev, wifi: null })),
    },
    filters.interface && {
      type: 'Interface',
      value: filters.interface,
      onRemove: () => setFilters(prev => ({ ...prev, interface: null })),
    },
    filters.capacity && {
      type: 'Capacity',
      value: filters.capacity,
      onRemove: () => setFilters(prev => ({ ...prev, capacity: null })),
    },
    filters.speed && {
      type: 'Read Speed',
      value: filters.speed === 'highest' ? 'Fastest First' : 'Slowest First',
      onRemove: () => setFilters(prev => ({ ...prev, speed: null })),
    },
    filters.wattage && {
      type: 'Wattage',
      value: filters.wattage,
      onRemove: () => setFilters(prev => ({ ...prev, wattage: null })),
    },
    filters.formFactor && {
      type: 'Form Factor',
      value: filters.formFactor,
      onRemove: () => setFilters(prev => ({ ...prev, formFactor: null })),
    },
    filters.coolingType && {
      type: 'Cooling',
      value: filters.coolingType,
      onRemove: () => setFilters(prev => ({ ...prev, coolingType: null })),
    },
    filters.memoryType && {
      type: 'Memory',
      value: filters.memoryType,
      onRemove: () => setFilters(prev => ({ ...prev, memoryType: null })),
    },
    filters.memorySpeed && {
      type: 'Speed',
      value: filters.memorySpeed,
      onRemove: () => setFilters(prev => ({ ...prev, memorySpeed: null })),
    },
  ].filter(Boolean) as { type: string; value: string; onRemove: () => void }[];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2 text-white">{category.name}</h2>
        <p className="text-gray-400">{category.description}</p>
        
        <FilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterOptions={filterOptions}
          onFilterSelect={(value) => {
            const handlers = FilterHandlers({
              showSocketFilter,
              showWifiFilter,
              showStorageFilters,
              showPsuFilters,
              showCaseFilters,
              showCoolerFilters,
              showMemoryFilters,
              sockets,
              interfaces,
              capacities,
              wattages,
              formFactors,
              coolingTypes,
              memoryTypes,
              memorySpeeds,
              setFilters,
              value
            });
          }}
          sortOption={sortOption}
          onSortChange={setSortOption}
          activeFilters={activeFilters}
        />
      </div>

      <ComponentGrid
        components={filteredComponents}
        selectedComponent={selectedComponent}
        onSelectComponent={onSelectComponent}
        selectedColors={selectedColors}
        selectedCoolerColors={selectedCoolerColors}
        selectedCoolerSizes={selectedCoolerSizes}
        selectedRamSizes={selectedRamSizes}
        onColorSelect={(componentId, colorId) => setSelectedColors(prev => ({ ...prev, [componentId]: colorId }))}
        onCoolerColorSelect={(componentId, colorId) => setSelectedCoolerColors(prev => ({ ...prev, [componentId]: colorId }))}
        onCoolerSizeSelect={(componentId, sizeId) => setSelectedCoolerSizes(prev => ({ ...prev, [componentId]: sizeId }))}
        onRamSizeSelect={(componentId, sizeId) => setSelectedRamSizes(prev => ({ ...prev, [componentId]: sizeId }))}
        categoryId={category.id}
      />
    </div>
  );
};

export default ComponentList;


interface ComponentSpecsProps {
  specs: Record<string, string>;
}

const ComponentSpecs = ({ specs }: ComponentSpecsProps) => {
  return (
    <div className="space-y-2">
      {Object.entries(specs).map(([key, value]) => (
        <div key={key} className="flex justify-between text-sm">
          <span className="text-gray-400 capitalize">{key}:</span>
          <span className="text-gray-200">{value}</span>
        </div>
      ))}
    </div>
  );
};

export default ComponentSpecs;

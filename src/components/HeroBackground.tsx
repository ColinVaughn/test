
import React from 'react';

const HeroBackground = () => {
  return (
    <div className="absolute inset-0 grid grid-cols-[repeat(20,1fr)] grid-rows-[repeat(20,1fr)] opacity-10">
      {[...Array(20)].map((_, i) => (
        <div key={`h-line-${i}`} className="col-span-full h-px bg-gaming-blue/30"></div>
      ))}
      {[...Array(20)].map((_, i) => (
        <div key={`v-line-${i}`} className="row-span-full w-px bg-gaming-purple/30"></div>
      ))}
    </div>
  );
};

export default HeroBackground;

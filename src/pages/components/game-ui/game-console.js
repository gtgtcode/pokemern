import React from "react";
import Image from "next/image";

const GameConsole = () => {
  return (
    <div className="absolute bottom-0 grid h-[150px] w-full grid-cols-2 overflow-hidden bg-gray-200">
      <div className="relative left-1/2 top-1/2 h-[95%] w-[95%] -translate-x-1/2 -translate-y-1/2 bg-orange-600">
        <div className="absolute left-1/2 top-1/2 h-[94%] w-[98%] -translate-x-1/2 -translate-y-1/2 bg-white">
          <div className="absolute left-1/2 top-1/2 h-[96%] w-[98%] -translate-x-1/2 -translate-y-1/2 bg-sky-600"></div>
        </div>
      </div>
      <div>
        <Image
          src="/pokeball.png"
          className="absolute -right-40 h-[300px] w-[300px] rotate-45"
          alt="pokeball"
          height={600}
          width={600}
        />
        <div className="relative left-1/2 top-1/2 h-[95%] w-[95%] -translate-x-1/2 -translate-y-1/2 bg-white"></div>
      </div>
    </div>
  );
};

export default GameConsole;

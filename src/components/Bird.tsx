import React from 'react';

interface BirdProps {
  position: number;
  rotation: number;
}

export function Bird({ position, rotation }: BirdProps) {
  return (
    <div
      className="absolute w-8 h-8 bg-yellow-400 rounded-full"
      style={{
        top: `${position}px`,
        transform: `translateX(50px) rotate(${rotation}deg)`,
        transition: 'transform 0.1s ease-out',
      }}
    >
      <div className="absolute w-3 h-3 bg-white rounded-full top-1 left-1">
        <div className="absolute w-1 h-1 bg-black rounded-full top-1 left-1" />
      </div>
      <div className="absolute w-4 h-2 bg-orange-500 right-0 top-3 clip-path-triangle" />
    </div>
  );
}
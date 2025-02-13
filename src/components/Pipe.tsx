import React from 'react';

interface PipeProps {
  height: number;
  isTop: boolean;
  position: number;
}

export function Pipe({ height, isTop, position }: PipeProps) {
  return (
    <div
      className={`absolute w-16 bg-green-500 ${isTop ? 'top-0' : 'bottom-0'}`}
      style={{
        height: `${height}px`,
        left: `${position}px`,
        borderRadius: '4px',
      }}
    >
      <div className={`absolute w-20 h-8 bg-green-600 left-1/2 -translate-x-1/2 ${isTop ? 'bottom-0' : 'top-0'}`} />
    </div>
  );
}
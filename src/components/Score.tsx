import React from 'react';

interface ScoreProps {
  score: number;
  bestScore: number;
}

export function Score({ score, bestScore }: ScoreProps) {
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white text-4xl font-bold flex flex-col items-center">
      <div>{score}</div>
      <div className="text-sm opacity-75">Best: {bestScore}</div>
    </div>
  );
}
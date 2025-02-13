import React, { useEffect, useState, useCallback } from 'react';
import { Bird } from './components/Bird';
import { Pipe } from './components/Pipe';
import { Score } from './components/Score';

const GRAVITY = 0.5;
const JUMP_FORCE = -10;
const PIPE_SPEED = 3;
const PIPE_SPAWN_RATE = 1500;
const GAP_SIZE = 150;

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [birdPosition, setBirdPosition] = useState(250);
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [birdRotation, setBirdRotation] = useState(0);
  const [pipes, setPipes] = useState<Array<{ x: number; height: number }>>([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  const jump = useCallback(() => {
    if (!gameStarted) {
      setGameStarted(true);
    }
    if (!gameOver) {
      setBirdVelocity(JUMP_FORCE);
      setBirdRotation(-30);
    }
  }, [gameOver, gameStarted]);

  const resetGame = useCallback(() => {
    setBirdPosition(250);
    setBirdVelocity(0);
    setBirdRotation(0);
    setPipes([]);
    setScore(0);
    setGameOver(false);
    setGameStarted(false);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        if (gameOver) {
          resetGame();
        } else {
          jump();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [jump, gameOver, resetGame]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const gameLoop = setInterval(() => {
      setBirdPosition((pos) => {
        const newPos = pos + birdVelocity;
        if (newPos < 0 || newPos > 500) {
          setGameOver(true);
          return pos;
        }
        return newPos;
      });
      setBirdVelocity((vel) => vel + GRAVITY);
      setBirdRotation((rot) => Math.min(rot + 3, 90));

      setPipes((currentPipes) => {
        return currentPipes
          .map((pipe) => ({
            ...pipe,
            x: pipe.x - PIPE_SPEED,
          }))
          .filter((pipe) => pipe.x > -100);
      });
    }, 20);

    return () => clearInterval(gameLoop);
  }, [gameStarted, gameOver, birdVelocity]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const spawnPipe = setInterval(() => {
      const height = Math.random() * (400 - GAP_SIZE) + 50;
      setPipes((pipes) => [...pipes, { x: 800, height }]);
    }, PIPE_SPAWN_RATE);

    return () => clearInterval(spawnPipe);
  }, [gameStarted, gameOver]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const checkCollision = () => {
      const birdRect = {
        left: 50,
        right: 82,
        top: birdPosition,
        bottom: birdPosition + 32,
      };

      for (const pipe of pipes) {
        const pipeRect = {
          left: pipe.x,
          right: pipe.x + 64,
          top: 0,
          bottom: pipe.height,
        };

        const bottomPipeRect = {
          left: pipe.x,
          right: pipe.x + 64,
          top: pipe.height + GAP_SIZE,
          bottom: 500,
        };

        if (
          birdRect.right > pipeRect.left &&
          birdRect.left < pipeRect.right &&
          (birdRect.top < pipeRect.bottom || birdRect.bottom > bottomPipeRect.top)
        ) {
          setGameOver(true);
          if (score > bestScore) {
            setBestScore(score);
          }
          return;
        }

        if (pipe.x + 64 < 50 && !pipe.passed) {
          setScore((s) => s + 1);
          pipe.passed = true;
        }
      }
    };

    const collisionInterval = setInterval(checkCollision, 20);
    return () => clearInterval(collisionInterval);
  }, [gameStarted, gameOver, birdPosition, pipes, score, bestScore]);

  return (
    <div 
      className="relative w-full h-screen bg-sky-400 overflow-hidden cursor-pointer"
      onClick={gameOver ? resetGame : jump}
    >
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute bottom-0 w-full h-20 bg-green-600" />
      </div>

      <Bird position={birdPosition} rotation={birdRotation} />

      {pipes.map((pipe, index) => (
        <React.Fragment key={index}>
          <Pipe height={pipe.height} isTop={true} position={pipe.x} />
          <Pipe
            height={500 - pipe.height - GAP_SIZE}
            isTop={false}
            position={pipe.x}
          />
        </React.Fragment>
      ))}

      <Score score={score} bestScore={bestScore} />

      {!gameStarted && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-2xl font-bold text-center">
          Click or Press Space<br />to Start
        </div>
      )}

      {gameOver && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-2xl font-bold text-center">
          Game Over!<br />
          Click or Press Space<br />to Play Again
        </div>
      )}
    </div>
  );
}

export default App;
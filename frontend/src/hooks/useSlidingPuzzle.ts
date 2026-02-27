import { useState, useCallback } from 'react';

function generateSolvable(size: number): number[] {
  const total = size * size;
  let tiles: number[];
  do {
    tiles = shuffle(Array.from({ length: total }, (_, i) => i));
  } while (!isSolvable(tiles, size));
  return tiles;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function isSolvable(tiles: number[], size: number): boolean {
  let inversions = 0;
  const flat = tiles.filter((t) => t !== 0);
  for (let i = 0; i < flat.length; i++) {
    for (let j = i + 1; j < flat.length; j++) {
      if (flat[i] > flat[j]) inversions++;
    }
  }
  if (size % 2 === 1) return inversions % 2 === 0;
  const emptyRow = Math.floor(tiles.indexOf(0) / size);
  const fromBottom = size - emptyRow;
  return (fromBottom % 2 === 0) !== (inversions % 2 === 0);
}

function isSolved(tiles: number[]): boolean {
  for (let i = 0; i < tiles.length - 1; i++) {
    if (tiles[i] !== i + 1) return false;
  }
  return tiles[tiles.length - 1] === 0;
}

export default function useSlidingPuzzle(level: number) {
  const size = level <= 2 ? 3 : 4;

  const generateTiles = useCallback(() => generateSolvable(size), [size]);

  const [tiles, setTiles] = useState<number[]>(generateTiles);
  const [moves, setMoves] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const emptyIndex = tiles.indexOf(0);

  const resetPuzzle = useCallback(() => {
    setTiles(generateTiles());
    setMoves(0);
    setIsComplete(false);
  }, [generateTiles]);

  const moveTile = useCallback((index: number) => {
    const empty = tiles.indexOf(0);
    const row = Math.floor(index / size);
    const col = index % size;
    const emptyRow = Math.floor(empty / size);
    const emptyCol = empty % size;

    const isAdjacent =
      (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
      (Math.abs(col - emptyCol) === 1 && row === emptyRow);

    if (!isAdjacent) return;

    const newTiles = [...tiles];
    [newTiles[index], newTiles[empty]] = [newTiles[empty], newTiles[index]];
    setTiles(newTiles);
    setMoves((m) => m + 1);
    if (isSolved(newTiles)) setIsComplete(true);
  }, [tiles, size]);

  return { tiles, moves, isComplete, emptyIndex, size, moveTile, resetPuzzle };
}

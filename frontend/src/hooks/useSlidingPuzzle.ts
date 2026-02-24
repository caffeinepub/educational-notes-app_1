import { useState, useEffect, useCallback } from 'react';
import { getDifficultyConfig } from '../utils/difficultyConfig';

export function useSlidingPuzzle(level: number) {
  const config = getDifficultyConfig('slidingPuzzle', level);
  const gridSize = config.gridSize;
  const totalTiles = gridSize * gridSize;

  const [tiles, setTiles] = useState<number[]>([]);
  const [emptyIndex, setEmptyIndex] = useState(totalTiles - 1);
  const [moves, setMoves] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const isSolvable = useCallback((arr: number[], size: number) => {
    let inversions = 0;
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[i] && arr[j] && arr[i] > arr[j]) {
          inversions++;
        }
      }
    }
    
    if (size % 2 === 1) {
      return inversions % 2 === 0;
    } else {
      const emptyRow = Math.floor(arr.indexOf(0) / size);
      return (inversions + emptyRow) % 2 === 1;
    }
  }, []);

  const generatePuzzle = useCallback(() => {
    let newTiles: number[];
    do {
      newTiles = Array.from({ length: totalTiles - 1 }, (_, i) => i + 1);
      newTiles.push(0);
      
      for (let i = newTiles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newTiles[i], newTiles[j]] = [newTiles[j], newTiles[i]];
      }
    } while (!isSolvable(newTiles, gridSize));
    
    return newTiles;
  }, [totalTiles, gridSize, isSolvable]);

  useEffect(() => {
    const newTiles = generatePuzzle();
    setTiles(newTiles);
    setEmptyIndex(newTiles.indexOf(0));
    setMoves(0);
    setIsComplete(false);
  }, [generatePuzzle]);

  const checkComplete = useCallback((currentTiles: number[]) => {
    for (let i = 0; i < currentTiles.length - 1; i++) {
      if (currentTiles[i] !== i + 1) return false;
    }
    return currentTiles[currentTiles.length - 1] === 0;
  }, []);

  const handleTileClick = useCallback((index: number) => {
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;
    const emptyRow = Math.floor(emptyIndex / gridSize);
    const emptyCol = emptyIndex % gridSize;

    const isAdjacent =
      (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
      (Math.abs(col - emptyCol) === 1 && row === emptyRow);

    if (isAdjacent) {
      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
      setTiles(newTiles);
      setEmptyIndex(index);
      setMoves((prev) => prev + 1);

      if (checkComplete(newTiles)) {
        setIsComplete(true);
      }
    }
  }, [tiles, emptyIndex, gridSize, checkComplete]);

  const resetPuzzle = useCallback(() => {
    const newTiles = generatePuzzle();
    setTiles(newTiles);
    setEmptyIndex(newTiles.indexOf(0));
    setMoves(0);
    setIsComplete(false);
  }, [generatePuzzle]);

  return {
    tiles,
    emptyIndex,
    moves,
    isComplete,
    handleTileClick,
    resetPuzzle,
    gridSize,
  };
}

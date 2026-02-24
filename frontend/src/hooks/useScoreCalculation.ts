export function useScoreCalculation(timeTaken: number, moves: number, level: number): number {
  const timeInSeconds = Math.floor(timeTaken / 1000);
  
  // Time score (max 500 points)
  let timeScore = 500;
  if (timeInSeconds > 30) {
    timeScore = Math.max(100, 500 - (timeInSeconds - 30) * 5);
  }
  
  // Move efficiency score (max 500 points)
  const optimalMoves = level * 10;
  let moveScore = 500;
  if (moves > optimalMoves) {
    moveScore = Math.max(100, 500 - (moves - optimalMoves) * 10);
  }
  
  // Level multiplier
  const levelMultiplier = 1 + (level - 1) * 0.2;
  
  return Math.round((timeScore + moveScore) * levelMultiplier);
}

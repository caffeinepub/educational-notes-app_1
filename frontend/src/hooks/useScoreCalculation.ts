export default function useScoreCalculation() {
  const calculateScore = (timeTakenMs: number, moves: number, level: number): number => {
    const timeSeconds = timeTakenMs / 1000;
    const timeBonus = Math.max(0, 300 - timeSeconds) * 2;
    const moveBonus = Math.max(0, 100 - moves) * 3;
    const levelMultiplier = level * 1.5;
    return Math.round((timeBonus + moveBonus) * levelMultiplier);
  };

  return { calculateScore };
}

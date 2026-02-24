interface DifficultyConfig {
  gridSize: number;
  sequenceLength?: number;
  patternCount?: number;
  displayTime?: number;
}

type GameType = 'cardMatching' | 'slidingPuzzle' | 'patternMemory' | 'sequenceMemory';

const difficultyConfigs: Record<GameType, Record<number, DifficultyConfig>> = {
  cardMatching: {
    1: { gridSize: 4 }, // 4x4 = 16 cards (8 pairs)
    2: { gridSize: 4 }, // 4x4 = 16 cards
    3: { gridSize: 6 }, // 6x6 = 36 cards (18 pairs)
    4: { gridSize: 6 }, // 6x6 = 36 cards
    5: { gridSize: 8 }, // 8x8 = 64 cards (32 pairs)
  },
  slidingPuzzle: {
    1: { gridSize: 3 }, // 3x3 puzzle
    2: { gridSize: 3 },
    3: { gridSize: 4 }, // 4x4 puzzle
    4: { gridSize: 4 },
    5: { gridSize: 5 }, // 5x5 puzzle
  },
  patternMemory: {
    1: { gridSize: 4, patternCount: 5, displayTime: 3000 },
    2: { gridSize: 4, patternCount: 7, displayTime: 2500 },
    3: { gridSize: 5, patternCount: 8, displayTime: 2500 },
    4: { gridSize: 5, patternCount: 10, displayTime: 2000 },
    5: { gridSize: 6, patternCount: 12, displayTime: 2000 },
  },
  sequenceMemory: {
    1: { gridSize: 4, sequenceLength: 4 },
    2: { gridSize: 4, sequenceLength: 5 },
    3: { gridSize: 4, sequenceLength: 6 },
    4: { gridSize: 4, sequenceLength: 7 },
    5: { gridSize: 4, sequenceLength: 8 },
  },
};

export function getDifficultyConfig(gameType: GameType, level: number): DifficultyConfig {
  const configs = difficultyConfigs[gameType];
  return configs[level] || configs[1];
}

interface DifficultyConfig {
  gridSize: number;
  sequenceLength?: number;
  patternCount?: number;
  displayTime?: number;
  timerDuration?: number;
  objectCount?: number;
  memorizeTime?: number;
  recallTime?: number;
}

type GameType = 'cardMatching' | 'slidingPuzzle' | 'patternMemory' | 'sequenceMemory' | 'stroopEffect' | 'memoryTest';

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
  stroopEffect: {
    1: { gridSize: 4, timerDuration: 30000 }, // 30 seconds
    2: { gridSize: 4, timerDuration: 25000 }, // 25 seconds
    3: { gridSize: 4, timerDuration: 20000 }, // 20 seconds
    4: { gridSize: 4, timerDuration: 18000 }, // 18 seconds
    5: { gridSize: 4, timerDuration: 15000 }, // 15 seconds
  },
  memoryTest: {
    1: { gridSize: 4, objectCount: 10, memorizeTime: 10, recallTime: 25 },
    2: { gridSize: 4, objectCount: 12, memorizeTime: 10, recallTime: 23 },
    3: { gridSize: 4, objectCount: 15, memorizeTime: 9,  recallTime: 20 },
    4: { gridSize: 4, objectCount: 18, memorizeTime: 8,  recallTime: 18 },
    5: { gridSize: 4, objectCount: 20, memorizeTime: 6,  recallTime: 15 },
  },
};

export function getDifficultyConfig(gameType: GameType, level: number): DifficultyConfig {
  const configs = difficultyConfigs[gameType];
  return configs[level] || configs[1];
}

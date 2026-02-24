export type Difficulty = 'easy' | 'hard';
export type WordCategory = 'animals' | 'fruits' | 'dailyUse';

export interface WordEntry {
  word: string;
  category: WordCategory;
  difficulty: Difficulty;
}

// Easy words: 3-5 letters
const easyAnimals = ['cat', 'dog', 'cow', 'hen', 'pig', 'fox', 'owl', 'bee', 'ant', 'bat', 'rat', 'elk'];
const easyFruits = ['fig', 'plum', 'lime', 'pear', 'kiwi', 'date', 'guava', 'mango', 'grape', 'peach', 'lemon', 'melon'];
const easyDailyUse = ['book', 'pen', 'cup', 'bag', 'key', 'door', 'lamp', 'desk', 'soap', 'comb', 'fork', 'bowl'];

// Hard words: 6+ letters
const hardAnimals = ['elephant', 'giraffe', 'dolphin', 'penguin', 'leopard', 'cheetah', 'gorilla', 'hamster', 'panther', 'buffalo', 'ostrich', 'peacock'];
const hardFruits = ['apricot', 'avocado', 'coconut', 'papaya', 'mango', 'pineapple', 'blueberry', 'raspberry', 'strawberry', 'watermelon', 'pomegranate', 'dragonfruit'];
const hardDailyUse = ['blanket', 'kitchen', 'cabinet', 'curtain', 'pillow', 'mirror', 'bottle', 'scissors', 'umbrella', 'calendar', 'notebook', 'backpack'];

export const wordDatabase = {
  easy: {
    animals: easyAnimals,
    fruits: easyFruits,
    dailyUse: easyDailyUse,
  },
  hard: {
    animals: hardAnimals,
    fruits: hardFruits,
    dailyUse: hardDailyUse,
  },
};

export function getAllWords(difficulty: Difficulty): string[] {
  const db = wordDatabase[difficulty];
  return [...db.animals, ...db.fruits, ...db.dailyUse];
}

export function getRandomWord(difficulty: Difficulty): string {
  const words = getAllWords(difficulty);
  return words[Math.floor(Math.random() * words.length)];
}

export function getRandomWordFromAll(): string {
  const allWords = [...getAllWords('easy'), ...getAllWords('hard')];
  return allWords[Math.floor(Math.random() * allWords.length)];
}

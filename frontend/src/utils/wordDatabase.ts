export const easyWords = [
  'cat', 'dog', 'sun', 'run', 'hat', 'bat', 'map', 'cup', 'pen', 'box',
  'ant', 'bee', 'cow', 'egg', 'fan', 'gem', 'hen', 'ink', 'jam', 'key',
  'lip', 'mud', 'net', 'oak', 'pig', 'rat', 'sea', 'tin', 'urn', 'van',
];

export const hardWords = [
  'elephant', 'giraffe', 'dolphin', 'penguin', 'leopard', 'panther',
  'butterfly', 'crocodile', 'kangaroo', 'flamingo', 'porcupine', 'chameleon',
  'strawberry', 'pineapple', 'blueberry', 'watermelon', 'raspberry', 'blackberry',
  'umbrella', 'calendar', 'computer', 'keyboard', 'notebook', 'telephone',
];

export const allWords = [...new Set([...easyWords, ...hardWords])];

/**
 * Weighted random word selection:
 * - easy: 80% from easyWords, 20% from hardWords
 * - hard: 70% from hardWords, 30% from easyWords
 */
export function getRandomWord(difficulty: 'easy' | 'hard'): string {
  const rand = Math.random();
  let list: string[];

  if (difficulty === 'easy') {
    list = rand < 0.8 ? easyWords : hardWords;
  } else {
    list = rand < 0.7 ? hardWords : easyWords;
  }

  return list[Math.floor(Math.random() * list.length)];
}

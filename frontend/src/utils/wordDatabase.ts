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

export function getRandomWord(difficulty: 'easy' | 'hard'): string {
  const list = difficulty === 'easy' ? easyWords : hardWords;
  return list[Math.floor(Math.random() * list.length)];
}

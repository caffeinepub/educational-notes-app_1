export interface SentenceEntry {
  text: string;
  answer: string;
  category: string;
}

export const sentenceDatabase: SentenceEntry[] = [
  // Animals
  { text: 'The ___ is the king of the jungle.', answer: 'lion', category: 'animals' },
  { text: 'A ___ has a very long neck.', answer: 'giraffe', category: 'animals' },
  { text: 'The ___ is the largest land animal.', answer: 'elephant', category: 'animals' },
  { text: 'A ___ can change its color to blend in.', answer: 'chameleon', category: 'animals' },
  { text: 'The ___ is known for its black and white stripes.', answer: 'zebra', category: 'animals' },
  { text: 'A ___ sleeps hanging upside down in caves.', answer: 'bat', category: 'animals' },
  { text: 'The ___ is the fastest land animal.', answer: 'cheetah', category: 'animals' },
  { text: 'A ___ builds a dam in rivers.', answer: 'beaver', category: 'animals' },
  // Fruits
  { text: 'A ___ a day keeps the doctor away.', answer: 'apple', category: 'fruits' },
  { text: 'The ___ is a tropical fruit with a spiky skin.', answer: 'pineapple', category: 'fruits' },
  { text: 'A ___ is a yellow curved fruit.', answer: 'banana', category: 'fruits' },
  { text: 'The ___ is a large green fruit with red flesh inside.', answer: 'watermelon', category: 'fruits' },
  { text: 'A ___ is a small red fruit often used in pies.', answer: 'cherry', category: 'fruits' },
  { text: 'The ___ is a citrus fruit that is very sour.', answer: 'lemon', category: 'fruits' },
  { text: 'A ___ is a purple fruit that grows in clusters.', answer: 'grape', category: 'fruits' },
  { text: 'The ___ is a fuzzy fruit with a pit inside.', answer: 'peach', category: 'fruits' },
  // Daily Use
  { text: 'We use a ___ to write on paper.', answer: 'pen', category: 'daily use' },
  { text: 'We read a ___ to learn new things.', answer: 'book', category: 'daily use' },
  { text: 'We use a ___ to cut paper.', answer: 'scissors', category: 'daily use' },
  { text: 'We carry things in a ___.', answer: 'bag', category: 'daily use' },
  { text: 'We use a ___ to brush our teeth.', answer: 'toothbrush', category: 'daily use' },
  { text: 'We look at our reflection in a ___.', answer: 'mirror', category: 'daily use' },
  { text: 'We use an ___ when it rains.', answer: 'umbrella', category: 'daily use' },
  { text: 'We sleep on a soft ___ at night.', answer: 'pillow', category: 'daily use' },
];

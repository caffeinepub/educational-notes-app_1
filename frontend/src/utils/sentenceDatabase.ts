export interface Sentence {
  text: string;
  answer: string;
}

export const sentences: Sentence[] = [
  { text: 'The ___ is a man\'s best friend.', answer: 'dog' },
  { text: 'The ___ gives us milk.', answer: 'cow' },
  { text: 'A ___ has a very long neck.', answer: 'giraffe' },
  { text: 'The ___ is the king of the jungle.', answer: 'lion' },
  { text: 'We eat ___ for breakfast.', answer: 'eggs' },
  { text: 'An ___ a day keeps the doctor away.', answer: 'apple' },
  { text: 'The ___ is a large grey animal with a trunk.', answer: 'elephant' },
  { text: 'A ___ has black and white stripes.', answer: 'zebra' },
  { text: 'We use a ___ to write.', answer: 'pen' },
  { text: 'The ___ shines during the day.', answer: 'sun' },
  { text: 'Fish live in the ___.', answer: 'water' },
  { text: 'Birds have ___ to fly.', answer: 'wings' },
  { text: 'We read ___ to learn.', answer: 'books' },
  { text: 'The ___ is a fruit that is yellow and curved.', answer: 'banana' },
  { text: 'A ___ is a small animal that hops.', answer: 'frog' },
  { text: 'We use ___ to cut paper.', answer: 'scissors' },
  { text: 'The ___ is the largest planet.', answer: 'Jupiter' },
  { text: 'A ___ is a place where we borrow books.', answer: 'library' },
  { text: 'We breathe ___ to survive.', answer: 'air' },
  { text: 'The ___ is a cold season.', answer: 'winter' },
  { text: 'A ___ is a vehicle with two wheels.', answer: 'bicycle' },
  { text: 'We use ___ to tell time.', answer: 'clock' },
  { text: 'The ___ is a red fruit.', answer: 'strawberry' },
  { text: 'A ___ is a place where we swim.', answer: 'pool' },
];

export function getRandomSentence(): Sentence {
  return sentences[Math.floor(Math.random() * sentences.length)];
}

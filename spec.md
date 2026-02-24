# Specification

## Summary
**Goal:** Add a new "Memory Test" game to the existing Brain Training app, where players memorize 10 objects and then recall them from memory.

**Planned changes:**
- Add `memoryTest` as a new GameType variant in the backend, with support for saving game state and high scores
- Create a `useMemoryTest` custom hook managing game phases: `memorize` (10 objects shown for 10 seconds) → `recall` (25-second countdown with text input) → `won` / `lost`
- Create a `MemoryTestGame` page at `/memory-test` showing a grid of 10 emoji+label object cards during memorize phase, then a search/input bar during recall phase, and a win/loss result screen on completion
- Save game results to the backend via `useCompleteLevel` on game end
- Register `/memory-test` route in `App.tsx`
- Add a Memory Test `GameCard` to the `HomePage` below all existing game cards
- Add `memoryTest` difficulty config in `difficultyConfig.ts` with 5 levels (level 1: 10 objects, 10s memorize, 25s recall)

**User-visible outcome:** Users can play a new Memory Test game where they study 10 everyday objects for 10 seconds, then type back as many as they can remember within 25 seconds to win.

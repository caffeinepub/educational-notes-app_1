# Specification

## Summary
**Goal:** Add short programmatic sound effects to all games in the Memory Increase app using the Web Audio API.

**Planned changes:**
- Create a `useSoundEffects` hook at `frontend/src/hooks/useSoundEffects.ts` that exposes `playClick()`, `playSuccess()`, and `playError()` functions, all generated via Web Audio API (no audio files needed), with graceful fallback if AudioContext is unavailable
- Integrate sound effects into all Section A games: CardMatchingGame, MemoryTestGame, PatternMemoryGame, SequenceMemoryGame, SlidingPuzzleGame, StroopEffectGame, and SpeedTypingGame — playing click on interactions, success on correct answers/completion, and error on wrong answers/game-over
- Integrate sound effects into all Section B games: MissingLetterGame, WordScrambleGame, and FillInTheBlanksGame — playing click on button presses/submissions, success on correct answers, and error on wrong answers

**User-visible outcome:** Every game now provides immediate audio feedback — a soft click on button/tile interactions, a cheerful chime on correct answers or level completion, and a short buzz on wrong answers or game-over states.

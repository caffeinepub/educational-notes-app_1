import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ScienceNote {
    importantPoints: Array<string>;
    content: string;
    chapterNumber: bigint;
    chapterTitle: string;
    definitions: Array<string>;
    examples: Array<string>;
}
export interface GameState {
    score: bigint;
    currentLevel: bigint;
    timeTaken: bigint;
    unlockedPuzzles: Array<string>;
}
export interface HighScore {
    player: string;
    level: bigint;
    score: bigint;
    timeTaken: bigint;
}
export interface backendInterface {
    completeLevel(player: string, level: bigint, startTime: bigint, correctAnswers: bigint, totalQuestions: bigint): Promise<void>;
    getAllChapters(): Promise<Array<ScienceNote>>;
    getChapter(chapterNumber: bigint): Promise<ScienceNote | null>;
    getPlayerGameState(player: string): Promise<GameState | null>;
    getPlayerHighScores(player: string): Promise<Array<HighScore>>;
    initializeChapters(): Promise<void>;
    startTimer(): Promise<bigint>;
}

import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface MemoryTestState {
    streak: bigint;
    hintsRemaining: bigint;
    correctAnswers: bigint;
    gameOver: boolean;
    currentLevel: bigint;
    timeTaken: bigint;
}
export interface MemoryTestHighScore {
    streak: bigint;
    player: string;
    date: bigint;
    level: bigint;
    score: bigint;
    correctAnswers: bigint;
    timeTaken: bigint;
}
export interface AnalyticsView {
    gamePlayCounts: Array<[string, bigint]>;
    totalVisitors: bigint;
    totalSessions: bigint;
}
export interface HighScore {
    player: string;
    level: bigint;
    score: bigint;
    gameType: GameType;
    timeTaken: bigint;
}
export interface ScienceNote {
    importantPoints: Array<string>;
    content: string;
    chapterNumber: bigint;
    chapterTitle: string;
    definitions: Array<string>;
    examples: Array<string>;
}
export interface GameState {
    memoryTestRecords?: Array<MemoryTestHighScore>;
    score: bigint;
    memoryTestState?: MemoryTestState;
    gameType: GameType;
    currentLevel: bigint;
    timeTaken: bigint;
    unlockedPuzzles: Array<string>;
}
export interface UserProfile {
    name: string;
    avatarUrl?: string;
}
export enum GameType {
    sequenceMemory = "sequenceMemory",
    slidingPuzzle = "slidingPuzzle",
    stroopEffect = "stroopEffect",
    patternMemory = "patternMemory",
    cardMatching = "cardMatching",
    memoryTest = "memoryTest"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    completeLevel(player: string, gameType: GameType, level: bigint, startTime: bigint, correctAnswers: bigint, totalQuestions: bigint): Promise<void>;
    completeMemoryTest(player: string, level: bigint, correctAnswers: bigint, streak: bigint, hintsUsed: bigint, timeTaken: bigint, score: bigint): Promise<boolean>;
    getAllChapters(): Promise<Array<ScienceNote>>;
    getAnalytics(password: string): Promise<AnalyticsView | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getChapter(chapterNumber: bigint): Promise<ScienceNote | null>;
    getMemoryTestHighScores(): Promise<Array<MemoryTestHighScore>>;
    getPlayerGameState(player: string): Promise<GameState | null>;
    getPlayerHighScores(player: string): Promise<Array<HighScore>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initializeChapters(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    recordGamePlay(gameName: string): Promise<void>;
    recordVisit(): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    startTimer(): Promise<bigint>;
}

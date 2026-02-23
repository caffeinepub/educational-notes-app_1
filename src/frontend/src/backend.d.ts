import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type ClassLevel = bigint;
export interface Note {
    topic: string;
    content: string;
    subject: string;
    classLevel: ClassLevel;
}
export interface backendInterface {
    addNote(classLevel: ClassLevel, subject: string, topic: string, content: string): Promise<bigint>;
    getAllNotes(): Promise<Array<Note>>;
    getNote(id: bigint): Promise<Note | null>;
    getNotesByClass(classLevel: ClassLevel): Promise<Array<Note>>;
    getNotesBySubject(subject: string): Promise<Array<Note>>;
}

import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Note } from '../backend';

export function useGetAllNotes() {
  const { actor, isFetching } = useActor();

  return useQuery<Note[]>({
    queryKey: ['notes', 'all'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllNotes();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetNotesByClass(classLevel: number) {
  const { actor, isFetching } = useActor();

  return useQuery<Note[]>({
    queryKey: ['notes', 'class', classLevel],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNotesByClass(BigInt(classLevel));
    },
    enabled: !!actor && !isFetching && classLevel >= 6 && classLevel <= 12,
  });
}

export function useGetNotesBySubject(subject: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Note[]>({
    queryKey: ['notes', 'subject', subject],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNotesBySubject(subject);
    },
    enabled: !!actor && !isFetching && !!subject,
  });
}

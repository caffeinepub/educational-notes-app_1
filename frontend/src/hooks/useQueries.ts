import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { GameType } from '../backend';

export function useGetPlayerGameState(player: string) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['playerGameState', player],
    queryFn: async () => {
      if (!actor || !player) return null;
      return actor.getPlayerGameState(player);
    },
    enabled: !!actor && !isFetching && !!player,
  });
}

export function useGetPlayerHighScores(player: string) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['playerHighScores', player],
    queryFn: async () => {
      if (!actor || !player) return [];
      return actor.getPlayerHighScores(player);
    },
    enabled: !!actor && !isFetching && !!player,
  });
}

export function useCompleteLevel() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      player,
      gameType,
      level,
      startTime,
      correctAnswers,
      totalQuestions,
    }: {
      player: string;
      gameType: GameType;
      level: bigint;
      startTime: bigint;
      correctAnswers: bigint;
      totalQuestions: bigint;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.completeLevel(player, gameType, level, startTime, correctAnswers, totalQuestions);
    },
    onSuccess: (_, { player }) => {
      queryClient.invalidateQueries({ queryKey: ['playerGameState', player] });
      queryClient.invalidateQueries({ queryKey: ['playerHighScores', player] });
    },
  });
}

export function useCompleteMemoryTest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      player,
      level,
      correctAnswers,
      streak,
      hintsUsed,
      timeTaken,
      score,
    }: {
      player: string;
      level: bigint;
      correctAnswers: bigint;
      streak: bigint;
      hintsUsed: bigint;
      timeTaken: bigint;
      score: bigint;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.completeMemoryTest(player, level, correctAnswers, streak, hintsUsed, timeTaken, score);
    },
    onSuccess: (_, { player }) => {
      queryClient.invalidateQueries({ queryKey: ['playerGameState', player] });
      queryClient.invalidateQueries({ queryKey: ['playerHighScores', player] });
    },
  });
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: { name: string; avatarUrl?: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

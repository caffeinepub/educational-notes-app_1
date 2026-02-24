import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { GameState, HighScore } from '../backend';

export function useGetPlayerGameState(player: string) {
  const { actor, isFetching } = useActor();

  return useQuery<GameState | null>({
    queryKey: ['gameState', player],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getPlayerGameState(player);
    },
    enabled: !!actor && !isFetching && !!player,
  });
}

export function useGetPlayerHighScores(player: string) {
  const { actor, isFetching } = useActor();

  return useQuery<HighScore[]>({
    queryKey: ['highScores', player],
    queryFn: async () => {
      if (!actor) return [];
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
      level,
      startTime,
      correctAnswers,
      totalQuestions,
    }: {
      player: string;
      level: bigint;
      startTime: bigint;
      correctAnswers: bigint;
      totalQuestions: bigint;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.completeLevel(player, level, startTime, correctAnswers, totalQuestions);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['gameState', variables.player] });
      queryClient.invalidateQueries({ queryKey: ['highScores', variables.player] });
    },
  });
}

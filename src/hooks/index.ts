import { ObjectId } from "mongodb";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

type GolfCourse = {
  courseName: string;
  par: string;
  location: string;
  _id: ObjectId;
  img: string;
};
export type AllScores = {
  course: string;
  date: string;
  isMajor: boolean;
  scores: { player: string; gross: number; hcp: number; net: number }[];
  _id: ObjectId;
};

export type Player = {
  player: string;
  netPoints: number;
  grossPoints: number;
  handicap: number;
  img: string;
  _id: ObjectId;
};

export type Round = {
  course: string;
  date: Date;
  scores: { player: string; gross: number; hcp: number; net: number }[];
};

const fetchGolfCourses = async (): Promise<GolfCourse[]> => {
  const response = await fetch("/.netlify/functions/getGolfCourses");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const fetchScores = async (): Promise<AllScores[]> => {
  const response = await fetch("/.netlify/functions/getScores");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  return data.sort(
    (a: AllScores, b: AllScores) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};

const fetchPlayers = async (): Promise<Player[]> => {
  const response = await fetch("/.netlify/functions/getPlayers");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export function useGetGolfCourses() {
  const { data: golfCourses = [] } = useQuery({
    queryKey: ["golfCourses"],
    queryFn: fetchGolfCourses,
  });

  return golfCourses;
}

export function useGetScores() {
  const queryClient = useQueryClient();
  const {
    data: scores = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["scores"],
    queryFn: fetchScores,
  });

  return {
    scores,
    fetchScores: refetch,
    isLoading,
  };
}

export function useGetPlayers() {
  const queryClient = useQueryClient();
  const {
    data: players = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["players"],
    queryFn: fetchPlayers,
  });

  return {
    players,
    fetchPlayers: refetch,
    isLoading,
  };
}

export function usePostScores() {
  const postScores = async (round: Round) => {
    try {
      const response = await fetch("/.netlify/functions/addScores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(round),
      });

      if (!response.ok) {
        console.error("Error submitting scores:", response.statusText);
        return;
      }

      const data = await response.json();
      if (data) {
        console.log("Scores submitted successfully:", data);
      }
    } catch (error) {
      console.error("Error submitting scores:", error);
    }
  };

  return postScores;
}

export function calculatePoints(
  scores: { player: string; score: number }[],
  isMajor: boolean = false
) {
  const sortedScores = scores
    .map((s) => ({ player: s.player, score: s.score }))
    .sort((a, b) => a.score - b.score);

  const scoreValues = sortedScores.map((s) => s.score);
  const uniqueScores = new Set(scoreValues);
  const allPlayersTied = uniqueScores.size === 1;

  let points = {};
  const multiplier = isMajor ? 2 : 1;

  if (allPlayersTied) {
    sortedScores.forEach((s) => {
      points[s.player] = 10 * multiplier;
    });
  } else if (uniqueScores.size === scoreValues.length) {
    points[sortedScores[0].player] = 20 * multiplier;
    points[sortedScores[1].player] = 10 * multiplier;
    points[sortedScores[2].player] = 0;
  } else if (scoreValues[0] === scoreValues[1]) {
    points[sortedScores[0].player] = 15 * multiplier;
    points[sortedScores[1].player] = 15 * multiplier;
    points[sortedScores[2].player] = 0;
  } else if (scoreValues[1] === scoreValues[2]) {
    points[sortedScores[0].player] = 20 * multiplier;
    points[sortedScores[1].player] = 5 * multiplier;
    points[sortedScores[2].player] = 5 * multiplier;
  }

  return points;
}

export function useUpdatePlayerPoints() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (round: {
      scores: { player: string; net: number; gross: number }[];
      isMajor: boolean;
    }) => {
      const netScores = round.scores.map((s) => ({
        player: s.player,
        score: s.net,
      }));
      const grossScores = round.scores.map((s) => ({
        player: s.player,
        score: s.gross,
      }));

      const netPoints = calculatePoints(netScores, round.isMajor);
      const grossPoints = calculatePoints(grossScores, round.isMajor);

      const response = await fetch("/.netlify/functions/updatePlayerPoints", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          netPoints,
          grossPoints,
          isMajor: round.isMajor,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update player points");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["players"] });
    },
  });

  return mutation.mutate;
}

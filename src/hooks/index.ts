import { useEffect, useState } from "react";
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
  const { data: scores = [], refetch } = useQuery({
    queryKey: ["scores"],
    queryFn: fetchScores,
  });

  return {
    scores,
    fetchScores: refetch,
  };
}

export function useGetPlayers() {
  const queryClient = useQueryClient();
  const { data: players = [], refetch } = useQuery({
    queryKey: ["players"],
    queryFn: fetchPlayers,
  });

  return {
    players,
    fetchPlayers: refetch,
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

export function calculatePoints(scores) {
  const sortedScores = scores
    .map((s) => ({ player: s.player, score: s.score }))
    .sort((a, b) => a.score - b.score);

  const scoreValues = sortedScores.map((s) => s.score);
  const uniqueScores = new Set(scoreValues);
  const allPlayersTied = uniqueScores.size === 1;

  let points = {};

  if (allPlayersTied) {
    sortedScores.forEach((s) => {
      points[s.player] = 10;
    });
  } else if (uniqueScores.size === scoreValues.length) {
    points[sortedScores[0].player] = 20;
    points[sortedScores[1].player] = 10;
    points[sortedScores[2].player] = 0;
  } else if (scoreValues[0] === scoreValues[1]) {
    points[sortedScores[0].player] = 15;
    points[sortedScores[1].player] = 15;
    points[sortedScores[2].player] = 0;
  } else if (scoreValues[1] === scoreValues[2]) {
    points[sortedScores[0].player] = 20;
    points[sortedScores[1].player] = 5;
    points[sortedScores[2].player] = 5;
  }

  return points;
}

export function useUpdatePlayerPoints() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (round: {
      scores: { player: string; net: number; gross: number }[];
    }) => {
      const netScores = round.scores.map((s) => ({
        player: s.player,
        score: s.net,
      }));
      const grossScores = round.scores.map((s) => ({
        player: s.player,
        score: s.gross,
      }));

      const netPoints = calculatePoints(netScores);
      const grossPoints = calculatePoints(grossScores);

      const response = await fetch("/.netlify/functions/updatePlayerPoints", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          netPoints,
          grossPoints,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update player points");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch players data after successful update
      queryClient.invalidateQueries({ queryKey: ["players"] });
    },
  });

  return mutation.mutate;
}

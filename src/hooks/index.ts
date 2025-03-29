import { useEffect, useState } from "react";
import { ObjectId } from "mongodb";

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
  img: string;
  _id: ObjectId;
};

export type Round = {
  course: string;
  date: Date;
  scores: { player: string; gross: number; hcp: number; net: number }[];
};

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

export function useGetGolfCourses() {
  const [golfCourses, setGolfCourses] = useState<GolfCourse[]>([]);

  useEffect(() => {
    const fetchGolfCourses = async () => {
      try {
        const response = await fetch("/.netlify/functions/getGolfCourses");
        const data = await response.json();
        setGolfCourses(data);
      } catch (error) {
        console.error("Error fetching golf courses:", error);
      }
    };
    fetchGolfCourses();
  }, []);

  return golfCourses;
}

export function useGetScores() {
  const [scores, setScores] = useState<AllScores[]>([]);
  const fetchScores = async () => {
    try {
      const response = await fetch("/.netlify/functions/getScores");
      const data = await response.json();
      const sortedScores = data.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setScores(sortedScores);
      console.log("Scores fetched successfully:", sortedScores);
    } catch (error) {
      console.error("Error fetching scores:", error);
    }
  };

  useEffect(() => {
    const getScores = async () => {
      await fetchScores();
    };
    getScores();
  }, []);

  return { scores, fetchScores };
}

export function useUpdatePlayerPoints() {
  const updatePlayerPoints = async (round) => {
    const calculatePoints = (scores) => {
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
    };

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

    console.log("Net Points:", netPoints);
    console.log("Gross Points:", grossPoints);

    try {
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
        console.error(
          "Failed to update winners:",
          response.status,
          response.statusText
        );
        return;
      }

      const data = await response.json();
    } catch (error) {
      console.error("Error updating winners:", error);
    }
  };

  return updatePlayerPoints;
}

export function useGetPlayers() {
  const [players, setPlayers] = useState<Player[]>([]);
  const fetchPlayers = async () => {
    try {
      const response = await fetch("/.netlify/functions/getPlayers");
      const data = await response.json();
      setPlayers(data);
    } catch (error) {
      console.error("Error fetching players:", error);
    }
  };

  useEffect(() => {
    const getPlayers = async () => {
      await fetchPlayers();
    };
    getPlayers();
  }, []);

  return { players, fetchPlayers };
}

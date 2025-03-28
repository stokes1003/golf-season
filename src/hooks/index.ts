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
  netWins: number;
  grossWins: number;
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

export function useUpdateWinners() {
  const updateWinners = async (round) => {
    const netMin = Math.min(...round.scores.map((s) => s.net));
    const netWinners = round.scores.filter((s) => s.net === netMin);

    const grossMin = Math.min(...round.scores.map((s) => s.gross));
    const grossWinners = round.scores.filter((s) => s.gross === grossMin);

    try {
      const response = await fetch("/.netlify/functions/updatePlayerWins", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          netWinners: netWinners.map((w) => w.player),
          grossWinners: grossWinners.map((w) => w.player),
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
      if (data) {
        console.log("Winners updated successfully:", data);
      }
    } catch (error) {
      console.error("Error updating winners:", error);
    }
  };

  return updateWinners;
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

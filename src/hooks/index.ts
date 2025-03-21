import { useEffect, useState } from "react";

type GolfCourse = {
  courseName: string;
  par: string;
  location: string;
  id: string;
  img: string;
};
export type AllScores = {
  course: string;
  date: string;
  scores: { player: string; gross: number; hcp: number; net: number }[];
  id: string;
};

export type Player = {
  player: string;
  netWins: number;
  grossWins: number;
  img: string;
  id: string;
};

export type Round = {
  course: string;
  date: Date;
  scores: { player: string; gross: number; hcp: number; net: number }[];
};

export function usePostScores(
  setRefreshTrigger: React.Dispatch<React.SetStateAction<number>>
) {
  const updateWinners = useUpdateWinners(setRefreshTrigger);

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
      console.log("Scores submitted successfully:", data);

      updateWinners(round);
      setRefreshTrigger((prev) => prev + 1);
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

export function useGetPlayers(refreshTrigger: number) {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch("/.netlify/functions/getPlayers");
        const data = await response.json();
        setPlayers(data);
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    };
    fetchPlayers();
  }, [refreshTrigger]);

  return players;
}

export function useGetScores(refreshTrigger: number): AllScores[] {
  const [allScores, setAllScores] = useState<AllScores[]>([]);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await fetch("/.netlify/functions/getScores");
        const data = await response.json();
        const sortedScores = data.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setAllScores(sortedScores);
      } catch (error) {
        console.error("Error fetching scores:", error);
      }
    };
    fetchScores();
  }, [refreshTrigger]);

  return allScores;
}

export function useUpdateWinners(
  setRefreshTrigger: React.Dispatch<React.SetStateAction<number>>
) {
  const updateWinners = async (round) => {
    const netWinner = round.scores.reduce((prev, current) =>
      current.net <= prev.net ? current : prev
    );

    const grossWinner = round.scores.reduce((prev, current) =>
      current.gross <= prev.gross ? current : prev
    );

    try {
      const response = await fetch("/.netlify/functions/updatePlayerWins", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          netWinner: netWinner.player,
          grossWinner: grossWinner.player,
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
      console.log("Winners updated successfully:", data);
      setRefreshTrigger((prev) => prev + 1); //
    } catch (error) {
      console.error("Error updating winners:", error);
    }
  };

  return updateWinners;
}

import { useEffect, useState } from "react";

type GolfCourse = {
  courseName: string;
  par: string;
  location: string;
};
export type AllScores = {
  course: string;
  date: string;
  scores: { player: string; gross: number; hcp: number; net: number }[];
  id: string;
};

export type AllScoresProps = {
  allScores: AllScores[];
};
export type Player = {
  player: string;
  netWins: number;
  grossWins: number;
  img: string;
};

export type PlayerProps = {
  players: Player[];
};

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

export function useGetPlayers(refreshScores: boolean) {
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
  }, [refreshScores]);
  return players;
}
export function useGetScores(refreshScores: boolean): AllScores[] {
  const [allScores, setAllScores] = useState<AllScores[]>([]);
  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await fetch("/.netlify/functions/getScores");
        const data = await response.json();
        const sortedScores = data.sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        setAllScores(sortedScores);
      } catch (error) {
        console.error("Error fetching scores:", error);
      }
    };
    fetchScores();
  }, [refreshScores]);
  return allScores;
}

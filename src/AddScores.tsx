import { Button, Group, Input, Select, Stack, Text } from "@mantine/core";
import React, { useState, useEffect } from "react";

export const AddScores = ({ players, setPlayers, allScores, setAllScores }) => {
  const golfCourses = ["MoWilly", "Lions", "Jimmy Clay", "Roy Kizer"];
  const [golfCourse, setGolfCourse] = useState<string | null>(null);
  const [isScore, setIsScore] = useState(false);
  const [isGolfCourse, setIsGolfCourse] = useState(false);
  const [isAddScore, setIsAddScore] = useState(true);
  const [playerCounter, setPlayerCounter] = useState(0);
  const [playerScores, setPlayerScores] = useState([
    { player: "Travis", gross: "", hcp: "" },
    { player: "Stokes", gross: "", hcp: "" },
    { player: "JP", gross: "", hcp: "" },
  ]);
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch("/.netlify/functions/getPlayers");
        const data = await response.json();
        setPlayers(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    };
    fetchPlayers();
  }, []);

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
  }, [allScores.length]);

  const handleSubmitScores = () => {
    if (playerCounter === 2) {
      setPlayerCounter(0);
      postScores({
        course: golfCourse,
        date: new Date(),
        scores: playerScores.map((player) => ({
          player: player.player,
          gross: parseInt(player.gross, 10),
          hcp: parseInt(player.hcp, 10),
          net: parseInt(player.gross, 10) - parseInt(player.hcp, 10),
        })),
      });

      setIsAddScore((prev) => !prev);
      setIsScore((prev) => !prev);
    } else {
      setPlayerCounter((prev) => prev + 1);
    }
  };

  const postScores = async (round) => {
    try {
      const response = await fetch("/.netlify/functions/addScores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(round),
      });

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error submitting scores:", error);
    }
  };
  return (
    <Stack>
      {isGolfCourse && (
        <Stack gap="md" align="center">
          <Stack gap="xs">
            <Text fw={600}> Select Golf Course</Text>
            <Select
              data={golfCourses}
              value={golfCourse}
              onChange={setGolfCourse}
            />
          </Stack>

          <Button
            w={150}
            onClick={() => {
              setIsScore((prev) => !prev);
              setIsGolfCourse((prev) => !prev);
            }}
          >
            Submit Course
          </Button>
        </Stack>
      )}

      {isScore && (
        <Stack align="center">
          <Group>
            <Stack key={players[playerCounter].player} align="center" gap="xs">
              <Text fw={700}>{players[playerCounter].player}</Text>
              <Input
                placeholder={`${players[playerCounter].player}'s HCP`}
                w={150}
                value={playerScores[playerCounter].hcp}
                onChange={(e) => {
                  const updatedScores = [...playerScores];
                  updatedScores[playerCounter].hcp = e.target.value;
                  setPlayerScores(updatedScores);
                }}
              />
              <Input
                placeholder={`${players[playerCounter].player}'s Gross`}
                w={150}
                value={playerScores[playerCounter].gross}
                onChange={(e) => {
                  const updatedScores = [...playerScores];
                  updatedScores[playerCounter].gross = e.target.value;
                  setPlayerScores(updatedScores);
                }}
              />
            </Stack>
          </Group>
          <Button w={150} onClick={handleSubmitScores}>
            {playerCounter === 2 ? "Submit Scores" : "Next Player"}
          </Button>
        </Stack>
      )}

      {isAddScore && (
        <Button
          w={150}
          onClick={() => {
            setIsGolfCourse((prev) => !prev);
            setIsAddScore((prev) => !prev);
          }}
        >
          Add Scores
        </Button>
      )}
    </Stack>
  );
};

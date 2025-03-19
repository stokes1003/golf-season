import { Button, Group, Input, Select, Stack, Text } from "@mantine/core";
import React, { useState, useEffect } from "react";

export const AddScores = ({ players, setPlayers, setAllScores }) => {
  const golfCourses = ["MoWilly", "Lions", "Jimmy Clay", "Roy Kizer"];
  const [refreshScores, setRefreshScores] = useState(false);
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
  }, [refreshScores]);

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

  const handleSubmitScores = () => {
    const gross = parseInt(playerScores[playerCounter].gross, 10);
    const handicap = parseInt(playerScores[playerCounter].hcp, 10);

    if (
      isNaN(gross) ||
      isNaN(handicap) ||
      gross < 50 ||
      gross > 150 ||
      handicap < 0 ||
      handicap > 36
    ) {
      alert(
        "Invalid scores! Gross should be between 50-150, Handicap should be between 0-36."
      );
      return;
    }

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
      updateWinners({
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

  const updateWinners = async (round) => {
    const netWinner = round.scores.reduce((prev, current) =>
      prev.net > current.net ? prev : current
    );

    const grossWinner = round.scores.reduce((prev, current) =>
      prev.gross > current.gross ? prev : current
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
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error updating winners:", error);
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

      if (data) {
        setRefreshScores((prev) => !prev);
      }
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
              if (golfCourse === null) {
                alert("Please select a golf course");
              } else {
                setIsScore((prev) => !prev);
                setIsGolfCourse((prev) => !prev);
              }
            }}
          >
            Submit Course
          </Button>
          <Button
            w={150}
            variant="outline"
            onClick={() => {
              setIsGolfCourse((prev) => !prev);
              setIsAddScore((prev) => !prev);
            }}
          >
            Cancel
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
          <Button
            w={150}
            variant="outline"
            onClick={() => {
              if (playerCounter === 0) {
                setIsScore((prev) => !prev);
                setIsGolfCourse((prev) => !prev);
              } else setPlayerCounter((prev) => prev - 1);
            }}
          >
            Back
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

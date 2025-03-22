import {
  Button,
  Group,
  Input,
  Select,
  Stack,
  Text,
  Avatar,
} from "@mantine/core";
import React, { useState } from "react";
import {
  useGetGolfCourses,
  useGetPlayers,
  usePostScores,
  useUpdateWinners,
} from "../hooks";

export const AddScores = () => {
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const golfCourses = useGetGolfCourses();
  const [golfCourse, setGolfCourse] = useState<string | null>(null);
  const [isScore, setIsScore] = useState(false);
  const [isGolfCourse, setIsGolfCourse] = useState(false);
  const updateWinners = useUpdateWinners(setRefreshTrigger);

  const postScores = usePostScores(setRefreshTrigger);
  const golfers = useGetPlayers(refreshTrigger);
  const [isAddScore, setIsAddScore] = useState(true);
  const [playerCounter, setPlayerCounter] = useState(0);
  const [playerScores, setPlayerScores] = useState([
    { player: "Travis", gross: "", hcp: "" },
    { player: "Stokes", gross: "", hcp: "" },
    { player: "JP", gross: "", hcp: "" },
  ]);

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
        course: golfCourse!,
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

  return (
    <Stack>
      {isGolfCourse && (
        <Stack gap="md" align="center">
          <Stack gap="xs">
            <Text fw={600}> Select Golf Course</Text>
            <Select
              data={golfCourses.map((course) => ({
                value: course.courseName,
                label: course.courseName,
              }))}
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
            <Stack key={golfers[playerCounter].player} align="center" gap="xs">
              <Group gap="xs">
                <Avatar src={golfers[playerCounter].img} size="sm" />
                <Text fw={700}>{golfers[playerCounter].player}</Text>
              </Group>

              <Input
                placeholder={`${golfers[playerCounter].player}'s HCP`}
                w={150}
                value={playerScores[playerCounter].hcp}
                onChange={(e) => {
                  const updatedScores = [...playerScores];
                  updatedScores[playerCounter].hcp = e.target.value;
                  setPlayerScores(updatedScores);
                }}
              />
              <Input
                placeholder={`${golfers[playerCounter].player}'s Gross`}
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

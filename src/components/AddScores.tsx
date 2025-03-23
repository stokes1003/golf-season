import {
  Button,
  Group,
  Input,
  Select,
  Stack,
  Text,
  Avatar,
  Box,
  Title,
} from "@mantine/core";
import React, { useState } from "react";
import {
  useGetGolfCourses,
  useGetPlayers,
  usePostScores,
  useUpdateWinners,
} from "../hooks";
import { IconX, IconArrowNarrowLeft } from "@tabler/icons-react";

export const AddScores = ({ setIsLeaderboard }) => {
  const golfCourses = useGetGolfCourses();
  const [golfCourse, setGolfCourse] = useState<string | null>(null);
  const [isScore, setIsScore] = useState(false);
  const [isGolfCourse, setIsGolfCourse] = useState(true);
  const updateWinners = useUpdateWinners();
  const postScores = usePostScores();
  const golfers = useGetPlayers();
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
      setIsLeaderboard(true);
    } else {
      setPlayerCounter((prev) => prev + 1);
    }
  };

  return (
    <Stack>
      <Stack align="center" justify="center" gap="xs">
        <Title>Fairway Fleas</Title>
        <Title order={3}>Add A Score</Title>
      </Stack>
      {isGolfCourse && (
        <Stack align="end">
          <Box
            h={24}
            w={24}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.05)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
            style={{ alignContent: "center" }}
          >
            <IconX
              stroke={1}
              cursor={"pointer"}
              onClick={() => {
                setIsLeaderboard(true);
                setIsAddScore((prev) => !prev);
              }}
            />
          </Box>
        </Stack>
      )}

      {isScore && (
        <Group justify="space-between">
          <Box
            h={24}
            w={24}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.05)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
            style={{ alignContent: "center" }}
          >
            <IconArrowNarrowLeft
              stroke={1}
              cursor={"pointer"}
              onClick={() => {
                if (playerCounter === 0) {
                  setIsScore((prev) => !prev);
                  setIsGolfCourse((prev) => !prev);
                } else setPlayerCounter((prev) => prev - 1);
              }}
            />
          </Box>
          <Box
            h={24}
            w={24}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.05)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
            style={{ alignContent: "center" }}
          >
            <IconX
              stroke={1}
              cursor={"pointer"}
              onClick={() => {
                setIsScore((prev) => !prev);
                setIsAddScore((prev) => !prev);
                setIsLeaderboard(true);
              }}
            />
          </Box>
        </Group>
      )}

      {isGolfCourse && (
        <Stack gap="md" align="center">
          <Stack gap="xs">
            <Text fw={600}> Select Golf Course</Text>
            <Select
              w={200}
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
                w={200}
                value={playerScores[playerCounter].hcp}
                onChange={(e) => {
                  const updatedScores = [...playerScores];
                  updatedScores[playerCounter].hcp = e.target.value;
                  setPlayerScores(updatedScores);
                }}
              />
              <Input
                placeholder={`${golfers[playerCounter].player}'s Gross`}
                w={200}
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
    </Stack>
  );
};

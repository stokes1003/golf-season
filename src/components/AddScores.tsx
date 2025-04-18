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
  useUpdatePlayerPoints,
  useGetScores,
} from "../hooks";
import { IconX, IconArrowNarrowLeft } from "@tabler/icons-react";

export const AddScores = ({ setIsLeaderboard }) => {
  const golfCourses = useGetGolfCourses();
  const [golfCourse, setGolfCourse] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState("selectGolfCourse");
  const updatePlayerPoints = useUpdatePlayerPoints();
  const postScores = usePostScores();
  const { players, fetchPlayers } = useGetPlayers();
  const { fetchScores } = useGetScores();
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);

  const [scoresByPlayer, setScoresByPlayer] = useState([
    { player: "Travis", gross: "", hcp: "" },
    { player: "Stokes", gross: "", hcp: "" },
    { player: "JP", gross: "", hcp: "" },
  ]);

  const handleSubmitScores = async () => {
    const gross = parseInt(scoresByPlayer[currentPlayerIndex].gross, 10);
    const handicap = parseInt(scoresByPlayer[currentPlayerIndex].hcp, 10);

    if (
      isNaN(gross) ||
      isNaN(handicap) ||
      gross < 50 ||
      gross > 150 ||
      handicap < 0 ||
      handicap > 54
    ) {
      alert(
        "Invalid scores! Gross should be between 50-150, Handicap should be between 0-54."
      );
      return;
    }

    if (currentPlayerIndex === players.length - 1) {
      try {
        const roundData = {
          course: golfCourse!,
          date: new Date(),
          scores: scoresByPlayer.map((player) => ({
            player: player.player,
            gross: parseInt(player.gross, 10),
            hcp: parseInt(player.hcp, 10),
            net: parseInt(player.gross, 10) - parseInt(player.hcp, 10),
          })),
        };

        // First, post the scores
        await postScores(roundData);

        // Then update player points
        await updatePlayerPoints({
          scores: roundData.scores,
        });

        // Finally, refresh both scores and players data
        await Promise.all([fetchScores(), fetchPlayers()]);

        // Reset the form and return to leaderboard
        setCurrentPlayerIndex(0);
        setCurrentStep("selectGolfCourse");
        setIsLeaderboard(true);
      } catch (error) {
        console.error("Error submitting scores:", error);
        alert("There was an error submitting the scores. Please try again.");
      }
    } else {
      setCurrentPlayerIndex((prev) => prev + 1);
    }
  };

  return (
    <Stack>
      <Stack align="center" justify="center" gap="xs">
        <Title>Fairway Fleas</Title>
        <Title order={3}>Add A Score</Title>
      </Stack>

      {currentStep === "selectGolfCourse" && (
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
              }}
            />
          </Box>
        </Stack>
      )}

      {currentStep === "enterPlayerScores" && (
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
                if (currentPlayerIndex === 0) {
                  setCurrentStep("selectGolfCourse");
                } else setCurrentPlayerIndex((prev) => prev - 1);
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
                setCurrentStep("selectGolfCourse");
                setIsLeaderboard(true);
              }}
            />
          </Box>
        </Group>
      )}

      {currentStep === "selectGolfCourse" && (
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
                setCurrentStep("enterPlayerScores");
              }
            }}
          >
            Submit Course
          </Button>
        </Stack>
      )}

      {currentStep === "enterPlayerScores" && (
        <Stack align="center">
          <Group>
            <Stack
              key={players[currentPlayerIndex].player}
              align="center"
              gap="xs"
            >
              <Group gap="xs">
                <Avatar src={players[currentPlayerIndex].img} size="sm" />
                <Text fw={700}>{players[currentPlayerIndex].player}</Text>
              </Group>

              <Input
                placeholder={`${players[currentPlayerIndex].player}'s HCP`}
                w={200}
                value={scoresByPlayer[currentPlayerIndex].hcp}
                onChange={(e) => {
                  const updatedScores = [...scoresByPlayer];
                  updatedScores[currentPlayerIndex].hcp = e.target.value;
                  setScoresByPlayer(updatedScores);
                }}
              />
              <Input
                placeholder={`${players[currentPlayerIndex].player}'s Gross`}
                w={200}
                value={scoresByPlayer[currentPlayerIndex].gross}
                onChange={(e) => {
                  const updatedScores = [...scoresByPlayer];
                  updatedScores[currentPlayerIndex].gross = e.target.value;
                  setScoresByPlayer(updatedScores);
                }}
              />
            </Stack>
          </Group>
          <Button w={150} onClick={handleSubmitScores}>
            {currentPlayerIndex === players.length - 1
              ? "Submit Scores"
              : "Next Player"}
          </Button>
        </Stack>
      )}
    </Stack>
  );
};

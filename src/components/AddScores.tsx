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
  Tabs,
  Tooltip,
  Modal,
} from "@mantine/core";
import { useMediaQuery, useDisclosure } from "@mantine/hooks";
import React, { useState } from "react";
import {
  useGetGolfCourses,
  useGetPlayers,
  usePostScores,
  useUpdatePlayerPoints,
  useGetScores,
} from "../hooks";
import {
  IconX,
  IconArrowNarrowLeft,
  IconInfoCircle,
  IconTrophy,
} from "@tabler/icons-react";

export const AddScores = ({ setIsLeaderboard }) => {
  const golfCourses = useGetGolfCourses();
  const [golfCourse, setGolfCourse] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState("selectGolfCourse");
  const updatePlayerPoints = useUpdatePlayerPoints();
  const postScores = usePostScores();
  const { players, fetchPlayers } = useGetPlayers();
  const { fetchScores } = useGetScores();
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [isMajor, setIsMajor] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)") ?? false;
  const [opened, { open, close }] = useDisclosure(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [scoresByPlayer, setScoresByPlayer] = useState([
    { player: "Travis", gross: "", hcp: "" },
    { player: "Stokes", gross: "", hcp: "" },
    { player: "JP", gross: "", hcp: "" },
  ]);

  const handleIsMajor = (value: string | null) => {
    setIsMajor(value === "yes");
  };
  console.log(isMajor);

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
      open();
    } else {
      setCurrentPlayerIndex((prev) => prev + 1);
    }
  };

  const submitRound = async () => {
    try {
      setIsSubmitting(true);
      const roundData = {
        course: golfCourse!,
        date: new Date(),
        isMajor: isMajor,
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
        isMajor: roundData.isMajor,
      });

      // Finally, refresh both scores and players data
      await Promise.all([fetchScores(), fetchPlayers()]);

      // Reset the form and return to leaderboard
      setCurrentPlayerIndex(0);
      setCurrentStep("selectGolfCourse");
      close();
      setIsLeaderboard(true);
    } catch (error) {
      console.error("Error submitting scores:", error);
      alert("There was an error submitting the scores. Please try again.");
    } finally {
      setIsSubmitting(false);
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
        <Stack gap="xl" align="center">
          <Stack gap="xl">
            <Stack gap="xs" align="center">
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
            <Stack align="center" gap={5}>
              <Group gap={2}>
                <Text fw={600}>Is this round a Major?</Text>
                <Tooltip
                  label="Major rounds double all points."
                  position="right"
                  events={{
                    hover: !isMobile,
                    focus: isMobile,
                    touch: isMobile,
                  }}
                >
                  <IconInfoCircle style={{ cursor: "pointer" }} stroke={2} />
                </Tooltip>
              </Group>

              <Tabs defaultValue="no" onChange={handleIsMajor}>
                <Group gap="xs">
                  <Tabs.Tab value="yes">Yes</Tabs.Tab>
                  <Tabs.Tab value="no">No</Tabs.Tab>
                </Group>
              </Tabs>
            </Stack>
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

      <Modal
        opened={opened}
        onClose={close}
        title="Confirm Round Details"
        centered
        size="sm"
      >
        <Stack gap="md" align="center">
          <Stack gap="xs" align="center">
            <Text fw={700}>{golfCourse}</Text>

            {isMajor && (
              <Group gap={5}>
                <Text fw={500}>Major Tournament</Text> <IconTrophy stroke={2} />
              </Group>
            )}
          </Stack>

          <Stack gap="sm">
            <Group gap="xl">
              <Text w={40} fw={600} style={{ textAlign: "center" }}>
                PLR
              </Text>
              <Text w={32} fw={600}>
                GRS
              </Text>
              <Text w={32} fw={600}>
                HCP
              </Text>
              <Text w={32} fw={600}>
                NET
              </Text>
            </Group>
            {scoresByPlayer.map((player, index) => (
              <Group key={player.player} justify="space-between" gap="sm">
                <Stack gap="sm">
                  <Group gap="xl">
                    <Avatar w={40} src={players[index].img} size="md" />
                    <Group gap="xs" align="center">
                      <Text w={32} style={{ textAlign: "center" }}>
                        {player.gross}
                      </Text>
                    </Group>
                    <Group gap="xs" align="center">
                      <Text w={32} style={{ textAlign: "center" }}>
                        {player.hcp}
                      </Text>
                    </Group>
                    <Group gap="xs" align="center">
                      <Text w={32} style={{ textAlign: "center" }}>
                        {parseInt(player.gross) - parseInt(player.hcp)}
                      </Text>
                    </Group>
                  </Group>
                </Stack>
              </Group>
            ))}
          </Stack>
          <Group mt="md" justify="center">
            <Button variant="outline" onClick={close} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={submitRound} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Confirm & Submit"}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
};

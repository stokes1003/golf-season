import { Group, Input, Stack, Button, Text, Avatar } from "@mantine/core";
import React from "react";

type EnterPlayerScoresProps = {
  currentStep: string;
  scoresByPlayer: Array<{ player: string; gross: string; hcp: string }>;
  setScoresByPlayer: (
    scores: Array<{ player: string; gross: string; hcp: string }>
  ) => void;
  players: Array<{ player: string; img?: string }>;
  currentPlayerIndex: number;
  setCurrentPlayerIndex: (value: number | ((prev: number) => number)) => void;
  onSubmit: () => void;
};

export function EnterPlayerScores({
  currentStep,
  scoresByPlayer,
  setScoresByPlayer,
  players,
  currentPlayerIndex,
  setCurrentPlayerIndex,
  onSubmit,
}: EnterPlayerScoresProps) {
  if (currentStep !== "enterPlayerScores") return null;

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

  return (
    <Stack align="center">
      <Group>
        <Stack key={players[currentPlayerIndex].player} align="center" gap="xs">
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
      <Button w={150} onClick={onSubmit}>
        {currentPlayerIndex === players.length - 1
          ? "Submit Scores"
          : "Next Player"}
      </Button>
    </Stack>
  );
}

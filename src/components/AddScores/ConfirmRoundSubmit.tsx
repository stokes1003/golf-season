import React from "react";
import { Modal, Stack, Group, Text, Button, Avatar, Box } from "@mantine/core";
import { IconTrophy } from "@tabler/icons-react";

type Player = {
  player: string;
  img?: string;
};

type PlayerScore = {
  player: string;
  gross: string;
  hcp: string;
};

type ConfirmRoundSubmitProps = {
  golfCourse: string;
  isMajor: boolean;
  majorName?: string;
  submitRound: () => Promise<void>;
  isSubmitting: boolean;
  players: Player[];
  scoresByPlayer: PlayerScore[];
  isOpen: boolean;
  onClose: () => void;
};

export function ConfirmRoundSubmit({
  golfCourse,
  isMajor,
  majorName,
  submitRound,
  isSubmitting,
  players,
  scoresByPlayer,
  isOpen,
  onClose,
}: ConfirmRoundSubmitProps) {
  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title="Confirm Round Details"
      centered
      size="sm"
    >
      <Stack gap="md" align="center">
        <Stack gap="xs" align="center" w="100%">
          {isMajor && (
            <Box bg="green" w="100%" h="36px">
              <Group gap={5} justify="center" align="center" h="100%">
                <IconTrophy stroke={2} color="white" />
                <Text fw={800} c="white">
                  {majorName}
                </Text>
              </Group>
            </Box>
          )}
          <Text fw={700}>{golfCourse}</Text>
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
          {scoresByPlayer.map((score, index) => {
            const player = players.find((p) => p.player === score.player);
            if (!player) return null;

            const netScore = parseInt(score.gross) - parseInt(score.hcp);

            return (
              <Group key={player.player} justify="space-between" gap="sm">
                <Stack gap="sm">
                  <Group gap="xl">
                    <Avatar
                      w={40}
                      src={player.img}
                      size="md"
                      alt={`${player.player}'s avatar`}
                    />
                    <Group gap="xs" align="center">
                      <Text w={32} style={{ textAlign: "center" }}>
                        {score.gross}
                      </Text>
                    </Group>
                    <Group gap="xs" align="center">
                      <Text w={32} style={{ textAlign: "center" }}>
                        {score.hcp}
                      </Text>
                    </Group>
                    <Group gap="xs" align="center">
                      <Text w={32} style={{ textAlign: "center" }}>
                        {netScore}
                      </Text>
                    </Group>
                  </Group>
                </Stack>
              </Group>
            );
          })}
        </Stack>
        <Group mt="md" justify="center">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            color={isMajor ? "green" : "blue"}
          >
            Cancel
          </Button>
          <Button
            onClick={submitRound}
            loading={isSubmitting}
            color={isMajor ? "green" : "blue"}
          >
            Confirm & Submit
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

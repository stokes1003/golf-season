import {
  Stack,
  Text,
  Group,
  Title,
  Modal,
  Tabs,
  ScrollArea,
} from "@mantine/core";
import React, { useState } from "react";
import { useMediaQuery } from "@mantine/hooks";
import { PlayerCard } from "./Leaderboard/PlayerCard";
import { IconInfoCircle } from "@tabler/icons-react";
import { useGetPlayers, useGetScores } from "../hooks";
import { CardSkeleton } from "./LoadingStates/CardSkeleton";

interface LeaderboardProps {
  netSwitch: boolean;
  setNetSwitch: (value: boolean) => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  netSwitch,
  setNetSwitch,
}) => {
  const [modalOpened, setModalOpened] = useState(false);
  const isMobile = useMediaQuery("(max-width: 782px)");
  const { players, isLoading: playersLoading } = useGetPlayers();
  const { scores, isLoading: scoresLoading } = useGetScores();

  const isLoading = playersLoading || scoresLoading;

  return (
    <Stack gap="lg" justify="space-evenly">
      <Stack align="center" justify="center" gap="xs">
        <Title order={3}>2025 Season</Title>
      </Stack>
      <Group align="center" justify="center" gap="xs">
        <Text fw={900}>Leaderboard</Text>
        <IconInfoCircle
          style={{ cursor: "pointer" }}
          stroke={2}
          onClick={() => setModalOpened(true)}
        />
        <Modal
          opened={modalOpened}
          onClose={() => setModalOpened(false)}
          title={
            <Text fw={700} size="lg">
              {netSwitch ? "Net" : "Gross"} Points Scoring System
            </Text>
          }
          size="lg"
          padding="xl"
        >
          <Stack gap="md">
            <Text fw={600}>Points Awarded Per Round:</Text>
            <Stack gap="xs" ml="md">
              <Text>• 20 points for an outright win</Text>
              <Text>• 15 points each for a tie for first place</Text>
              <Text>• 10 points for second place</Text>
              <Text>• 5 points each for a tie for second place</Text>
              <Text>• 10 points each if all players tie</Text>
            </Stack>

            <Text fw={600} mt="md">
              Tiebreaker Rules:
            </Text>
            <Text ml="md">
              If there is a tie in total {netSwitch ? "Net" : "Gross"} Points,
              the tiebreaker is determined by {netSwitch ? "Net" : "Gross"}{" "}
              Average, which is calculated as the player's total{" "}
              {netSwitch ? "net" : "gross"} score divided by the number of
              rounds played. A lower average wins the tiebreaker.
            </Text>

            <Text fw={600} mt="md">
              Best Score:
            </Text>
            <Text ml="md">
              Best {netSwitch ? "Net" : "Gross"} refers to the lowest{" "}
              {netSwitch ? "net" : "gross"} score the player has recorded in a
              single round during the season.
            </Text>
          </Stack>
        </Modal>
      </Group>
      <Stack align="center">
        <Tabs defaultValue="Net">
          <Tabs.List justify="flex-end">
            <Tabs.Tab value="Net" onClick={() => setNetSwitch(true)}>
              Net
            </Tabs.Tab>
            <Tabs.Tab value="Gross" onClick={() => setNetSwitch(false)}>
              Gross
            </Tabs.Tab>
          </Tabs.List>
        </Tabs>
      </Stack>
      <Stack>
        <Stack gap="lg">
          {isMobile ? (
            <ScrollArea w="100vw" type="never">
              <Group justify="center" gap="lg" wrap="nowrap" px="lg">
                {isLoading ? (
                  <>
                    <CardSkeleton />
                    <CardSkeleton />
                    <CardSkeleton />
                  </>
                ) : (
                  <PlayerCard netSwitch={netSwitch} />
                )}
              </Group>
            </ScrollArea>
          ) : (
            <Stack>
              <Group gap="lg" justify="center" align="end">
                {isLoading ? (
                  <>
                    <CardSkeleton />
                    <CardSkeleton />
                    <CardSkeleton />
                  </>
                ) : (
                  <PlayerCard netSwitch={netSwitch} />
                )}
              </Group>
            </Stack>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

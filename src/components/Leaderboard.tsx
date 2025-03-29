import {
  Avatar,
  Stack,
  Text,
  Card,
  Group,
  Box,
  Title,
  Tooltip,
  Tabs,
} from "@mantine/core";
import React, { useState } from "react";
import { useMediaQuery } from "@mantine/hooks";
import { PlayerCard } from "./PlayerCard";
import { IconInfoCircle } from "@tabler/icons-react";

export const Leaderboard = ({}) => {
  const [tooltip, setTooltip] = useState(false);
  const [netSwitch, setNetSwitch] = useState(true);

  const isMobile = useMediaQuery("(max-width: 782px)");

  return (
    <Stack gap="lg" justify="space-evenly">
      <Stack align="center" justify="center" gap="xs">
        <Title order={3}>2025 Season</Title>
      </Stack>
      <Group align="center" justify="center" gap="xs">
        <Text fw={900}>Leaderboard</Text>
        <Tooltip
          multiline
          w={220}
          opened={isMobile ? tooltip : undefined}
          withArrow
          transitionProps={{ duration: 200 }}
          label={
            netSwitch
              ? "Net Points represent a player's net wins, with 3 points awarded for an outright win and 1 point for a tie. If there is a tie in total Net Points, the tiebreaker is determined by Net Average, which is calculated as the player's total net score divided by the number of rounds played. A lower Net Average wins the tiebreaker. Best Net refers to the lowest net score the player has recorded in a single round during the season."
              : "Gross Points represent a player's gross wins, with 3 points awarded for an outright win and 1 point for a tie. If there is a tie in total Gross Points, the tiebreaker is determined by Gross Average, which is calculated as the player's total gross score divided by the number of rounds played. A lower Gross Average wins the tiebreaker. Best Gross refers to the lowest gross score the player has recorded in a single round during the season."
          }
        >
          <IconInfoCircle
            stroke={2}
            onClick={isMobile ? () => setTooltip((o) => !o) : undefined}
          />
        </Tooltip>
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
            <Stack align="center">
              <PlayerCard netSwitch={netSwitch} />
            </Stack>
          ) : (
            <Group gap="lg" style={{ alignItems: "self-end" }}>
              <PlayerCard netSwitch={netSwitch} />
            </Group>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

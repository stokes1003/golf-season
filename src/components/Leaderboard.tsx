import { Avatar, Stack, Text, Card, Group } from "@mantine/core";
import React from "react";
import { useGetPlayers } from "../hooks";

export const Leaderboard = () => {
  const players = useGetPlayers(false);
  return (
    <Stack gap="lg" justify="space-evenly">
      <Stack align="center">
        <Text fw={900}>Leaderboard</Text>
      </Stack>
      <Stack>
        <Group gap="lg">
          <Card shadow="sm" padding="lg" radius="lg" withBorder w={200}>
            <Stack gap="sm" align="center">
              <Text fw={700}>Net Wins</Text>
              {players
                .sort((a, b) => b.netWins - a.netWins)
                .map((player) => (
                  <Group key={player.player} justify="space-between" gap={52}>
                    <Avatar>{player.img}</Avatar>
                    <Text>{player.netWins}</Text>
                  </Group>
                ))}
            </Stack>
          </Card>
          <Card shadow="sm" padding="lg" radius="lg" withBorder w={200}>
            <Stack gap="sm" align="center">
              <Text fw={700}>Gross Wins</Text>
              {players
                .sort((a, b) => b.grossWins - a.grossWins)
                .map((player) => (
                  <Group key={player.player} justify="space-between" gap={52}>
                    <Avatar>{player.img}</Avatar>
                    <Text>{player.netWins}</Text>
                  </Group>
                ))}
            </Stack>
          </Card>
        </Group>
      </Stack>
    </Stack>
  );
};

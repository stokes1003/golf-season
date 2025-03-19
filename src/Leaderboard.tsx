import { Avatar, Grid, Stack, Text } from "@mantine/core";
import React from "react";

export type Player = {
  player: string;
  netWins: number;
  grossWins: number;
  img: string;
};

export type PlayerProps = {
  players: Player[];
};

export const Leaderboard = ({ players }: PlayerProps) => {
  return (
    <Stack gap="sm" w="30%" justify="space-evenly">
      <Text fw={900}>Leaderboard</Text>
      <Grid align="center" gutter="xs">
        <Grid.Col span={6}>
          <Text fw={700}>Player</Text>
        </Grid.Col>
        <Grid.Col span={3} ta="center">
          <Text fw={700}>Net</Text>
        </Grid.Col>
        <Grid.Col span={3} ta="center">
          <Text fw={700}>Gross</Text>
        </Grid.Col>
      </Grid>

      {players.map((player) => (
        <Stack key={player.player}>
          <Grid gutter="xl" align="center">
            <Grid.Col span={3} ta="center" w={64}>
              <Avatar>{player.img}</Avatar>
            </Grid.Col>
            <Grid.Col span={3} w={72}>
              <Text>{player.player}</Text>
            </Grid.Col>
            <Grid.Col span={3} ta="center" w={64}>
              <Text>{player.netWins}</Text>
            </Grid.Col>
            <Grid.Col span={3} ta="center" w={64}>
              <Text>{player.grossWins}</Text>
            </Grid.Col>
          </Grid>
        </Stack>
      ))}
    </Stack>
  );
};

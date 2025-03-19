import { Stack, Text, Grid, Divider } from "@mantine/core";
import React from "react";

export type AllScores = {
  course: string;
  date: string;
  scores: { player: string; gross: number; hcp: number; net: number }[];
  id: string;
};

export type AllScoresProps = {
  allScores: AllScores[];
};

export const OfficialRounds = ({ allScores }: AllScoresProps) => {
  return (
    <Stack gap="sm" w="60%">
      <Text fw={900}>Official Rounds</Text>
      <Grid align="center" gutter="xs">
        <Grid.Col span={2}>
          <Text fw={700}>Player</Text>
        </Grid.Col>
        <Grid.Col span={2} ta="center">
          <Text fw={700}>Course</Text>
        </Grid.Col>
        <Grid.Col span={2} ta="center">
          <Text fw={700}>HCP</Text>
        </Grid.Col>
        <Grid.Col span={2} ta="center">
          <Text fw={700}>Net</Text>
        </Grid.Col>
        <Grid.Col span={2} ta="center">
          <Text fw={700}>Gross</Text>
        </Grid.Col>
        <Grid.Col span={2} ta="center">
          <Text fw={700}>Date</Text>
        </Grid.Col>
      </Grid>
      <Divider />
      {allScores.map((round) =>
        round.scores.map((player) => (
          <Stack key={`${round.id}-${player.player}`}>
            <Grid justify="space-between" gutter="xl" align="center">
              <Grid.Col span={2} w={72}>
                <Text>{player.player}</Text>
              </Grid.Col>
              <Grid.Col span={2} w={72}>
                <Text>{round.course}</Text>
              </Grid.Col>
              <Grid.Col span={2} ta="center" w={64}>
                <Text>{player.hcp}</Text>
              </Grid.Col>
              <Grid.Col span={2} ta="center" w={64}>
                <Text>{player.net}</Text>
              </Grid.Col>
              <Grid.Col span={2} ta="center" w={64}>
                <Text>{player.gross}</Text>
              </Grid.Col>
              <Grid.Col span={2} ta="center" w={72}>
                <Text>{new Date(round.date).toLocaleDateString("en-US")}</Text>
              </Grid.Col>
            </Grid>
            <Divider />
          </Stack>
        ))
      )}
    </Stack>
  );
};

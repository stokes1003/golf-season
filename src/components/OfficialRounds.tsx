import { Stack, Text, Card, Group, Avatar } from "@mantine/core";
import React from "react";
import { useGetScores } from "../hooks";

export const OfficialRounds = () => {
  const allScores = useGetScores(false);

  return (
    <Stack gap="lg" align="center">
      <Stack>
        <Text fw={900}>Official Rounds</Text>
      </Stack>
      <Stack gap="lg">
        {allScores.map((round) => (
          <Card
            key={round.date}
            shadow="sm"
            padding="lg"
            radius="lg"
            withBorder
            w={400}
          >
            <Stack gap="sm" align="center">
              <Stack align="center">
                <Text fw={700}>{round.course}</Text>
                <Text>{new Date(round.date).toLocaleDateString()}</Text>
                <Group gap={52} align="center">
                  <Text>PL</Text>
                  <Text>GR</Text>
                  <Text>NT</Text>
                  <Text>HP</Text>
                </Group>
                {round.scores
                  .slice()
                  .sort((a, b) => a.net - b.net)
                  .map((player) => (
                    <Group key={player.player} align="center" gap={52}>
                      <Avatar>{player.player.charAt(0)}</Avatar>
                      <Text>{player.gross}</Text>
                      <Text>{player.net}</Text>
                      <Text>{player.hcp}</Text>
                    </Group>
                  ))}
              </Stack>
            </Stack>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
};

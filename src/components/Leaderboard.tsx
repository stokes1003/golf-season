import { Avatar, Stack, Text, Card, Group, Box } from "@mantine/core";
import React from "react";
import { useGetPlayers } from "../hooks";
import { useGetScores } from "../hooks";
import {
  IconCircleNumber1Filled,
  IconCircleNumber2Filled,
  IconCircleNumber3Filled,
} from "@tabler/icons-react";

export const Leaderboard = () => {
  const players = useGetPlayers(false);
  const scores = useGetScores(false);

  return (
    <Stack gap="lg" justify="space-evenly">
      <Stack align="center">
        <Text fw={900}>2025 Leaderboard</Text>
      </Stack>
      <Stack>
        <Group gap="lg">
          {players
            .sort((a, b) => b.netWins - a.netWins)
            .map((player, index) => (
              <Card
                shadow="sm"
                padding="lg"
                radius="lg"
                withBorder
                w={240}
                h={260}
                key={player.id}
                style={{
                  boxShadow:
                    index === 0
                      ? "0 0 12px rgba(255, 215, 0, 0.6)"
                      : index === 1
                      ? "0 0 12px rgba(167, 167, 173, 0.6)"
                      : index === 2
                      ? "0 0 12px rgba(167, 112, 68, 0.6)"
                      : "none",

                  transition: "transform 0.2s ease-in-out",
                  transformOrigin: "center",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(0.98)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <Box pos="absolute" top="0" left="0">
                  {index === 0 && (
                    <IconCircleNumber1Filled size="30" color="#D6AF36" />
                  )}
                  {index === 1 && (
                    <IconCircleNumber2Filled size="30" color="#A7A7AD" />
                  )}
                  {index === 2 && (
                    <IconCircleNumber3Filled size="30" color="#A77044" />
                  )}
                </Box>
                <Stack gap="lg" align="center">
                  <Stack align="center" gap="sm">
                    <Avatar size="lg" src={player.img} />
                    <Text fw={800}>{player.player}</Text>
                  </Stack>
                  <Stack>
                    <Group
                      key={player.netWins}
                      justify="space-between"
                      gap={52}
                    >
                      <Text fw={600} w={48}>
                        NWins
                      </Text>
                      <Text>{player.netWins}</Text>
                    </Group>
                    <Group
                      key={player.grossWins}
                      justify="space-between"
                      gap={52}
                    >
                      <Text fw={600} w={48}>
                        GWins
                      </Text>
                      <Text>{player.grossWins}</Text>
                    </Group>
                  </Stack>
                </Stack>
              </Card>
            ))}
        </Group>
      </Stack>
    </Stack>
  );
};

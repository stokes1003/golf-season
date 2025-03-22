import { Avatar, Stack, Text, Card, Group, Box } from "@mantine/core";
import React from "react";
import { useGetPlayers, useGetScores } from "../hooks";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconCircleNumber1Filled,
  IconCircleNumber2Filled,
  IconCircleNumber3Filled,
} from "@tabler/icons-react";

export const Leaderboard = () => {
  const players = useGetPlayers(0);
  const scores = useGetScores(0);
  const isMobile = useMediaQuery("(max-width: 700px)");

  const netAvg = () => {
    if (!scores || scores.length === 0) return [];
    return scores[0]?.scores?.map((_, index) => {
      const total = scores.reduce(
        (sum, score) =>
          score.scores[index] ? sum + score.scores[index].net : sum,
        0
      );
      const avg = total / scores.length;
      return {
        player: scores[0].scores[index].player,
        avg: parseFloat(avg.toFixed(1)),
      };
    });
  };

  return (
    <Stack gap="lg" justify="space-evenly">
      <Stack align="center">
        <Text fw={900}>2025 Leaderboard</Text>
      </Stack>
      <Stack>
        {!isMobile ? (
          <Group gap="lg" style={{ alignItems: "self-end" }}>
            {players
              .sort((a, b) => b.netWins - a.netWins)
              .map((player, index) => (
                <Card
                  shadow="sm"
                  padding="lg"
                  radius="lg"
                  withBorder
                  w={200}
                  h={
                    index === 0
                      ? 280
                      : index === 1
                      ? 260
                      : index === 2
                      ? 240
                      : 180
                  }
                  key={player.player}
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
                    <Stack gap="sm">
                      <Group
                        key={`netWins-${player.player}`}
                        justify="space-between"
                        gap={52}
                      >
                        <Text fw={600} w={48}>
                          NWins:
                        </Text>
                        <Text>{player.netWins}</Text>
                      </Group>
                      <Group
                        key={`grossWins-${player.player}`}
                        justify="space-between"
                        gap={52}
                      >
                        <Text fw={600} w={48}>
                          GWins:
                        </Text>
                        <Text>{player.grossWins}</Text>
                      </Group>
                      <Group
                        key={`netAvg-${player.player}`}
                        justify="space-between"
                        gap={52}
                      >
                        <Text fw={600} w={48}>
                          NAvg:
                        </Text>
                        <Text>
                          {netAvg().find((avg) => avg.player === player.player)
                            ?.avg ?? "N/A"}
                        </Text>
                      </Group>
                    </Stack>
                  </Stack>
                </Card>
              ))}
          </Group>
        ) : (
          <Stack align="center" justify="center">
            {players
              .sort((a, b) => b.netWins - a.netWins)
              .map((player, index) => (
                <Card
                  shadow="sm"
                  padding="lg"
                  radius="lg"
                  withBorder
                  w={260}
                  h={280}
                  key={player.player}
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
                        key={`netWins-${player.player}`}
                        justify="space-between"
                        gap={52}
                      >
                        <Text fw={600} w={48}>
                          NWins
                        </Text>
                        <Text>{player.netWins}</Text>
                      </Group>
                      <Group
                        key={`grossWins-${player.player}`}
                        justify="space-between"
                        gap={52}
                      >
                        <Text fw={600} w={48}>
                          GWins
                        </Text>
                        <Text>{player.grossWins}</Text>
                      </Group>
                      <Group
                        key={`netAvg-${player.player}`}
                        justify="space-between"
                        gap={52}
                      >
                        <Text fw={600} w={48}>
                          NAvg:
                        </Text>
                        <Text>
                          {netAvg().find((avg) => avg.player === player.player)
                            ?.avg ?? "N/A"}
                        </Text>
                      </Group>
                    </Stack>
                  </Stack>
                </Card>
              ))}
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};

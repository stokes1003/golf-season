import {
  Avatar,
  Stack,
  Text,
  Card,
  Group,
  Box,
  Title,
  Tooltip,
  Switch,
} from "@mantine/core";
import React, { useState } from "react";
import { useGetPlayers, useGetScores } from "../hooks";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconCircleNumber1Filled,
  IconCircleNumber2Filled,
  IconCircleNumber3Filled,
  IconInfoCircle,
} from "@tabler/icons-react";

export const Leaderboard = ({
  updateScores,
  updatePlayers,
  setUpdatePlayers,
}) => {
  const [tooltip, setTooltip] = useState(false);
  const [netSwitch, setNetSwitch] = useState(true);
  const players = useGetPlayers(updatePlayers);
  const scores = useGetScores(setUpdatePlayers, updateScores);
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
  const grossAvg = () => {
    if (!scores || scores.length === 0) return [];
    return scores[0]?.scores?.map((_, index) => {
      const total = scores.reduce(
        (sum, score) =>
          score.scores[index] ? sum + score.scores[index].gross : sum,
        0
      );
      const avg = total / scores.length;
      return {
        player: scores[0].scores[index].player,
        avg: parseFloat(avg.toFixed(1)),
      };
    });
  };

  const netSortedPlayers = () => {
    const netAverages = netAvg();
    const netAvgMap = new Map(netAverages.map((p) => [p.player, p.avg]));

    const sorted = [...players].sort((a, b) => {
      if (b.netWins !== a.netWins) {
        return b.netWins - a.netWins;
      }

      const aNetAvg = netAvgMap.get(a.player) || 0;
      const bNetAvg = netAvgMap.get(b.player) || 0;

      if (aNetAvg !== bNetAvg) {
        return aNetAvg - bNetAvg;
      }

      return b.grossWins - a.grossWins;
    });

    return [sorted[1], sorted[0], sorted[2], ...sorted.slice(3)].filter(
      Boolean
    );
  };
  const grossSortedPlayers = () => {
    const grossAverages = grossAvg();
    const grossAvgMap = new Map(grossAverages.map((p) => [p.player, p.avg]));

    const sorted = [...players].sort((a, b) => {
      if (b.grossWins !== a.grossWins) {
        return b.grossWins - a.grossWins;
      }

      const aGrossAvg = grossAvgMap.get(a.player) || 0;
      const bGrossAvg = grossAvgMap.get(b.player) || 0;

      if (aGrossAvg !== bGrossAvg) {
        return aGrossAvg - bGrossAvg;
      }

      return b.netWins - a.netWins;
    });

    return [sorted[1], sorted[0], sorted[2], ...sorted.slice(3)].filter(
      Boolean
    );
  };

  return (
    <Stack gap="lg" justify="space-evenly">
      <Stack align="center" justify="center" gap="xs">
        <Title>Fairway Fleas</Title>
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
          label="Net Points represent a player's net wins, with 3 points awarded for an outright win and 1 point for a tie. If there is a tie in total Net Points, the tiebreaker is determined by Net Average, which is calculated as the player's total net score divided by the number of rounds played. A lower Net Average wins the tiebreaker."
        >
          <IconInfoCircle
            stroke={2}
            onClick={isMobile ? () => setTooltip((o) => !o) : undefined}
          />
        </Tooltip>
      </Group>
      <Stack>
        {!isMobile ? (
          <Stack gap="lg">
            <Group gap="lg" style={{ alignItems: "self-end" }}>
              {(netSwitch ? netSortedPlayers() : grossSortedPlayers()).map(
                (player, index) => (
                  <Card
                    shadow="sm"
                    padding="lg"
                    radius="lg"
                    withBorder
                    w={240}
                    h={
                      index === 1
                        ? 320
                        : index === 0
                        ? 300
                        : index === 2
                        ? 280
                        : 180
                    }
                    key={player.player}
                    style={{
                      boxShadow:
                        index === 1
                          ? "0 0 12px rgba(255, 215, 0, 0.6)"
                          : index === 0
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
                      {index === 1 && (
                        <IconCircleNumber1Filled size="30" color="#D6AF36" />
                      )}
                      {index === 0 && (
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
                          gap={28}
                        >
                          <Text fw={600} w={95} style={{ textAlign: "right" }}>
                            Net Pts:
                          </Text>
                          <Text>{player.netWins}</Text>
                        </Group>
                        <Group
                          key={`grossWins-${player.player}`}
                          justify="space-between"
                          gap={28}
                        >
                          <Text fw={600} w={95} style={{ textAlign: "right" }}>
                            Gross Pts:
                          </Text>
                          <Text>{player.grossWins}</Text>
                        </Group>
                        <Group
                          key={`netAvg-${player.player}`}
                          justify="space-between"
                          gap={28}
                        >
                          <Text fw={600} w={95} style={{ textAlign: "right" }}>
                            Net Avg:
                          </Text>
                          <Text>
                            {netAvg().find(
                              (avg) => avg.player === player.player
                            )?.avg ?? "N/A"}
                          </Text>
                        </Group>
                        <Group
                          key={`grossAvg-${player.player}`}
                          justify="space-between"
                          gap={28}
                        >
                          <Text fw={600} w={95} style={{ textAlign: "right" }}>
                            Gross Avg:
                          </Text>
                          <Text>
                            {grossAvg().find(
                              (avg) => avg.player === player.player
                            )?.avg ?? "N/A"}
                          </Text>
                        </Group>
                      </Stack>
                    </Stack>
                  </Card>
                )
              )}
            </Group>
            <Stack align="end">
              <Switch
                checked={netSwitch}
                label={netSwitch ? "Net Rankings" : "Gross Rankings"}
                onChange={(event) => setNetSwitch(event.currentTarget.checked)}
              />
            </Stack>
          </Stack>
        ) : (
          <Stack>
            <Stack align="center">
              <Switch
                checked={netSwitch}
                label={netSwitch ? "Net Rankings" : "Gross Rankings"}
                onChange={(event) => setNetSwitch(event.currentTarget.checked)}
              />
            </Stack>
            <Stack align="center" justify="center">
              {players
                .sort((a, b) => {
                  return netSwitch
                    ? b.netWins - a.netWins
                    : b.grossWins - a.grossWins;
                })
                .map((player, index) => (
                  <Card
                    shadow="sm"
                    padding="lg"
                    radius="lg"
                    withBorder
                    w={260}
                    h={300}
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
                          <Text fw={600} w={95} style={{ textAlign: "right" }}>
                            Net Pts:
                          </Text>
                          <Text>{player.netWins}</Text>
                        </Group>
                        <Group
                          key={`grossWins-${player.player}`}
                          justify="space-between"
                          gap={52}
                        >
                          <Text fw={600} w={95} style={{ textAlign: "right" }}>
                            Gross Pts:
                          </Text>
                          <Text>{player.grossWins}</Text>
                        </Group>
                        <Group
                          key={`netAvg-${player.player}`}
                          justify="space-between"
                          gap={52}
                        >
                          <Text fw={600} w={95} style={{ textAlign: "right" }}>
                            Net Avg:
                          </Text>
                          <Text>
                            {netAvg().find(
                              (avg) => avg.player === player.player
                            )?.avg ?? "N/A"}
                          </Text>
                        </Group>
                        <Group
                          key={`grossAvg-${player.player}`}
                          justify="space-between"
                          gap={52}
                        >
                          <Text fw={600} w={95} style={{ textAlign: "right" }}>
                            Gross Avg:
                          </Text>
                          <Text>
                            {grossAvg().find(
                              (avg) => avg.player === player.player
                            )?.avg ?? "N/A"}
                          </Text>
                        </Group>
                      </Stack>
                    </Stack>
                  </Card>
                ))}
            </Stack>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};

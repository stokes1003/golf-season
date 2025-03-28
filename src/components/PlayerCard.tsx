import React from "react";
import { Card, Avatar, Text, Stack, Box, Group } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconCircleNumber1Filled,
  IconCircleNumber2Filled,
  IconCircleNumber3Filled,
} from "@tabler/icons-react";
import { useGetPlayers, useGetScores } from "../hooks";

export const PlayerCard = ({ netSwitch }) => {
  const isMobile = useMediaQuery("(max-width: 700px)");
  const { players } = useGetPlayers();
  const { scores } = useGetScores();

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

  const bestNet = () => {
    if (!scores || scores.length === 0) return [];

    const bestScores = new Map();

    scores.forEach((round) => {
      round.scores.forEach(({ player, net }) => {
        if (!bestScores.has(player) || net < bestScores.get(player)) {
          bestScores.set(player, net);
        }
      });
    });

    return Array.from(bestScores, ([player, bestNet]) => ({ player, bestNet }));
  };

  const bestGross = () => {
    if (!scores || scores.length === 0) return [];

    const bestScores = new Map();

    scores.forEach((round) => {
      round.scores.forEach(({ player, gross }) => {
        if (!bestScores.has(player) || gross < bestScores.get(player)) {
          bestScores.set(player, gross);
        }
      });
    });

    return Array.from(bestScores, ([player, bestGross]) => ({
      player,
      bestGross,
    }));
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

    return isMobile
      ? [sorted[0], sorted[1], sorted[2], ...sorted.slice(3)].filter(Boolean)
      : [sorted[1], sorted[0], sorted[2], ...sorted.slice(3)].filter(Boolean);
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

    return isMobile
      ? [sorted[0], sorted[1], sorted[2], ...sorted.slice(3)].filter(Boolean)
      : [sorted[1], sorted[0], sorted[2], ...sorted.slice(3)].filter(Boolean);
  };
  return (
    <>
      {(netSwitch ? netSortedPlayers() : grossSortedPlayers()).map(
        (player, index) => (
          <Card
            shadow="sm"
            padding="lg"
            radius="lg"
            withBorder
            w={isMobile ? 260 : 240}
            h={
              isMobile
                ? 280
                : index === 1
                ? 300
                : index === 0
                ? 280
                : index === 2
                ? 260
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
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
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
                  gap={24}
                >
                  <Text fw={600} w={60} style={{ textAlign: "right" }}>
                    Points
                  </Text>
                  <Text w={60}>
                    {netSwitch ? player.netWins : player.grossWins}
                  </Text>
                </Group>
                <Group
                  key={`netAvg-${player.player}`}
                  justify="space-between"
                  gap={24}
                >
                  <Text fw={600} w={60} style={{ textAlign: "right" }}>
                    AVG
                  </Text>
                  <Text w={60}>
                    {netSwitch
                      ? netAvg().find((avg) => avg.player === player.player)
                          ?.avg ?? "N/A"
                      : grossAvg().find((avg) => avg.player === player.player)
                          ?.avg ?? "N/A"}
                  </Text>
                </Group>
                <Group
                  key={`bestNet-${player.player}`}
                  justify="space-between"
                  gap={24}
                >
                  <Text fw={600} w={60} style={{ textAlign: "right" }}>
                    Best
                  </Text>
                  <Text w={60}>
                    {netSwitch
                      ? bestNet().find((avg) => avg.player === player.player)
                          ?.bestNet ?? "N/A"
                      : bestGross().find((avg) => avg.player === player.player)
                          ?.bestGross ?? "N/A"}
                  </Text>
                </Group>
              </Stack>
            </Stack>
          </Card>
        )
      )}
    </>
  );
};

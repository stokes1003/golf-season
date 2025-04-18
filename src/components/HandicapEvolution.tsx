import React from "react";
import { Card, Stack, Text, Container } from "@mantine/core";
import { LineChart } from "@mantine/charts";
import { useGetScores } from "../hooks";
import { useMediaQuery } from "@mantine/hooks";

const PLAYER_COLORS = {
  Travis: "#FF6B6B", // Red
  Stokes: "#40C057", // Green
  JP: "#228BE6", // Light Blue
} as const;

interface HandicapDataPoint {
  date: string;
  [key: string]: string | number;
}

export const HandicapEvolution = () => {
  const { scores } = useGetScores();
  const isMobile = useMediaQuery("(max-width: 782px)");

  const getHandicapData = (): HandicapDataPoint[] => {
    if (!scores) return [];

    // Sort scores by date
    const sortedScores = [...scores].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Process each round
    return sortedScores.map((round) => {
      const dataPoint: HandicapDataPoint = {
        date: new Date(round.date).toLocaleDateString(),
      };

      // Add each player's handicap
      round.scores.forEach((score) => {
        dataPoint[score.player] = score.hcp;
      });

      return dataPoint;
    });
  };

  const data = getHandicapData();
  if (data.length === 0) return null;

  // Create series for each player
  const series = Object.entries(PLAYER_COLORS).map(([player, color]) => ({
    name: player,
    color: color,
  }));

  return (
    <Container size="lg" px={0}>
      <Card
        shadow="sm"
        padding="lg"
        radius="lg"
        withBorder
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <Stack gap="md" align="center">
          <Text fw={700} ta="center">
            Handicap Evolution
          </Text>
          <LineChart
            h={300}
            w={isMobile ? 344 : 400}
            data={data}
            dataKey="date"
            series={series}
            curveType="monotone"
            connectNulls
            gridAxis="xy"
            tickLine="xy"
            withTooltip
            xAxisProps={{
              tickLine: true,
              style: {
                fontSize: "12px",
                fontWeight: 500,
              },
            }}
            yAxisProps={{
              tickLine: true,
              style: {
                fontSize: "12px",
                fontWeight: 500,
              },
            }}
            tooltipProps={{
              content: ({ payload }) => {
                if (!payload?.length) return null;
                return (
                  <Stack
                    gap={4}
                    p="xs"
                    bg="white"
                    style={{ border: "1px solid #ccc", borderRadius: "4px" }}
                  >
                    <Text fw={500}>{payload[0].payload.date}</Text>
                    {payload.map((entry) => (
                      <Text key={entry.name} c={entry.color} fz="sm">
                        {entry.name}: {entry.value}
                      </Text>
                    ))}
                  </Stack>
                );
              },
            }}
          />
        </Stack>
      </Card>
    </Container>
  );
};

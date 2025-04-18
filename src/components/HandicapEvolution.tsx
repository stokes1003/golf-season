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
        style={{
          transition: "transform 0.2s ease-in-out",
          transformOrigin: "center",
        }}
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
            tickLine="y"
            withTooltip
            withDots
            tooltipAnimationDuration={200}
            dotProps={{
              r: 5,
              strokeWidth: 2,
              style: { fill: "white", cursor: "pointer" },
            }}
            gridProps={{
              strokeDasharray: "5 5",
              stroke: "#e9ecef",
            }}
            xAxisProps={{
              style: {
                fontSize: "12px",
                fontWeight: 500,
              },
              tickMargin: 10,
            }}
            yAxisProps={{
              tickMargin: 15,
              width: 35,
              style: {
                fontSize: "12px",
                fontWeight: 500,
              },
            }}
          />
        </Stack>
      </Card>
    </Container>
  );
};

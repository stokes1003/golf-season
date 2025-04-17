import React from "react";
import { Card, Stack, Text, Container } from "@mantine/core";
import { LineChart } from "@mantine/charts";
import { useGetScores, useGetPlayers } from "../hooks";
import { useMediaQuery } from "@mantine/hooks";

// Fixed colors for each player, matching RankingsChart for consistency
const PLAYER_COLORS = {
  Travis: "#FF6B6B", // Red
  Stokes: "#40C057", // Green
  JP: "#228BE6", // Light Blue
};

export const ScoresChart = ({ netSwitch }) => {
  const { scores } = useGetScores();
  const { players } = useGetPlayers();
  const isMobile = useMediaQuery("(max-width: 782px)");

  const getScoresData = () => {
    if (!scores || !players) return [];

    // Sort scores by date
    const sortedScores = [...scores].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Transform data for the chart
    return sortedScores.map((round) => {
      const roundData = {
        date: new Date(round.date).toLocaleDateString(),
      };

      // Add each player's score to the round data
      round.scores.forEach((playerScore) => {
        const scoreKey = `${playerScore.player}${netSwitch ? "Net" : "Gross"}`;
        roundData[scoreKey] = netSwitch ? playerScore.net : playerScore.gross;
      });

      return roundData;
    });
  };

  const data = getScoresData();
  if (data.length === 0) return null;

  // Create series for each player's scores
  const series = players.map((player) => ({
    name: `${player.player}${netSwitch ? "Net" : "Gross"}`,
    label: player.player,
    color: PLAYER_COLORS[player.player],
  }));

  return (
    <Container size="sm" px={0}>
      <Card shadow="sm" padding="md" radius="lg" withBorder>
        <Stack gap="md">
          <Text fw={700} ta="center">
            {netSwitch ? "Net" : "Gross"} Scores Over Time
          </Text>
          <LineChart
            h={300}
            w={isMobile ? 344 : 352}
            data={data}
            dataKey="date"
            series={series}
            curveType="monotone"
            tickLine="y"
            gridAxis="xy"
            withDots
            withTooltip
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
            yAxisProps={{
              tickMargin: 15,
              width: 35,
              domain: netSwitch ? [65, 90] : [65, 125],
              ticks: netSwitch
                ? [65, 70, 75, 80, 85, 90]
                : [65, 75, 85, 95, 105, 115, 125],
              style: {
                fontSize: "12px",
                fontWeight: 500,
              },
            }}
            xAxisProps={{
              style: {
                fontSize: "12px",
                fontWeight: 500,
              },
              tickMargin: 10,
            }}
          />
        </Stack>
      </Card>
    </Container>
  );
};

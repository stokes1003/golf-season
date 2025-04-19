import React from "react";
import { Card, Stack, Text, Container } from "@mantine/core";
import { BarChart } from "@mantine/charts";
import "@mantine/core/styles.css";
import "@mantine/charts/styles.css";
import { useGetScores, useGetPlayers } from "../../hooks";
import { useMediaQuery } from "@mantine/hooks";

interface PlayerStats {
  total: number;
  count: number;
}

interface CourseStats {
  courseName: string;
  playerScores: {
    [key: string]: PlayerStats;
  };
}

interface CourseAverageData {
  course: string;
  [key: string]: string | number | null;
}

// Fixed colors for each player, matching other charts
const PLAYER_COLORS = {
  Travis: "#FF6B6B", // Red
  Stokes: "#40C057", // Green
  JP: "#228BE6", // Light Blue
} as const;

export const CourseAverages = ({ netSwitch }: { netSwitch: boolean }) => {
  const { scores } = useGetScores();
  const { players } = useGetPlayers();
  const isMobile = useMediaQuery("(max-width: 782px)");

  const getCourseAverages = (): CourseAverageData[] => {
    if (!scores || !players) return [];

    // Create a map to store total scores and count for each course
    const courseData = new Map<string, CourseStats>();

    scores.forEach((round) => {
      if (!courseData.has(round.course)) {
        courseData.set(round.course, {
          courseName: round.course,
          playerScores: Object.fromEntries(
            players.map((player) => [player.player, { total: 0, count: 0 }])
          ) as { [key: string]: PlayerStats },
        });
      }

      const courseStats = courseData.get(round.course)!;
      round.scores.forEach((score) => {
        if (courseStats.playerScores[score.player]) {
          const playerStats = courseStats.playerScores[score.player];
          playerStats.total += netSwitch ? score.net : score.gross;
          playerStats.count += 1;
        }
      });
    });

    // Calculate averages for each course
    return Array.from(courseData.values()).map((courseStats) => {
      const data: CourseAverageData = {
        course: courseStats.courseName,
      };

      // Calculate and add average for each player
      Object.entries(courseStats.playerScores).forEach(([player, stats]) => {
        data[player] =
          stats.count > 0
            ? Math.round((stats.total / stats.count) * 10) / 10
            : null;
      });

      return data;
    });
  };

  const data = getCourseAverages();
  if (data.length === 0) return null;

  // Create series for each player
  const series = players.map((player) => ({
    name: player.player,
    color: PLAYER_COLORS[player.player as keyof typeof PLAYER_COLORS],
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
            {netSwitch ? "Net" : "Gross"} Average by Course
          </Text>
          <BarChart
            h={300}
            w={isMobile ? 344 : 450}
            data={data}
            dataKey="course"
            series={series}
            orientation="horizontal"
            xAxisProps={{
              style: {
                fontSize: "12px",
                fontWeight: 500,
              },
            }}
            yAxisProps={{
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

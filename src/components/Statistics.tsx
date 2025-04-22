import { Stack, Text, Group, Box, Paper, ScrollArea } from "@mantine/core";
import { ScoresChart } from "./Statistics/ScoresChart";
import { CourseAverages } from "./Statistics/CourseAverages";
import { HandicapEvolution } from "./Statistics/HandicapEvolution";
import React from "react";
import { useMediaQuery } from "@mantine/hooks";
import { useGetPlayers, useGetScores } from "../hooks";
import { ChartSkeleton } from "./LoadingStates/ChartSkeleton";

const PLAYER_COLORS = {
  Travis: "#FF6B6B", // Red
  Stokes: "#40C057", // Green
  JP: "#228BE6", // Light Blue
};

interface StatisticsProps {
  netSwitch: boolean;
}

export const Statistics: React.FC<StatisticsProps> = ({ netSwitch }) => {
  const isMobile = useMediaQuery("(max-width: 782px)");
  const { isLoading: playersLoading } = useGetPlayers();
  const { isLoading: scoresLoading } = useGetScores();

  const isLoading = playersLoading || scoresLoading;

  return (
    <Stack gap="lg">
      <Stack align="center" justify="center" gap="xs">
        <Text fw={900}>Statistics</Text>
        <Group justify="center" gap="lg">
          {Object.entries(PLAYER_COLORS).map(([player, color]) => (
            <Group key={player} gap="xs">
              <Box w={15} h={15} style={{ backgroundColor: color }} />
              <Text size="sm">{player}</Text>
            </Group>
          ))}
        </Group>
      </Stack>

      {isMobile ? (
        <ScrollArea w="100vw" type="never">
          <Group justify="center" gap="lg" wrap="nowrap" px="lg">
            <Stack>
              {isLoading ? (
                <ChartSkeleton />
              ) : (
                <ScoresChart netSwitch={netSwitch} />
              )}
            </Stack>
            <Stack>
              {isLoading ? (
                <ChartSkeleton />
              ) : (
                <CourseAverages netSwitch={netSwitch} />
              )}
            </Stack>
            <Stack>
              {isLoading ? <ChartSkeleton /> : <HandicapEvolution />}
            </Stack>
          </Group>
        </ScrollArea>
      ) : (
        <Paper shadow="sm" py="lg" radius="md" withBorder>
          <ScrollArea w="80vw" type="never">
            <Group justify="center" gap="lg" wrap="nowrap" px="lg">
              <Stack>
                {isLoading ? (
                  <ChartSkeleton />
                ) : (
                  <ScoresChart netSwitch={netSwitch} />
                )}
              </Stack>
              <Stack>
                {isLoading ? (
                  <ChartSkeleton />
                ) : (
                  <CourseAverages netSwitch={netSwitch} />
                )}
              </Stack>
              <Stack>
                {isLoading ? <ChartSkeleton /> : <HandicapEvolution />}
              </Stack>
            </Group>
          </ScrollArea>
        </Paper>
      )}
    </Stack>
  );
};

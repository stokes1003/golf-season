import { Stack, Text, Group, Box } from "@mantine/core";
import { ScoresChart } from "./ScoresChart";
import { CourseAverages } from "./CourseAverages";
import React from "react";

const PLAYER_COLORS = {
  Travis: "#FF6B6B", // Red
  Stokes: "#40C057", // Green
  JP: "#228BE6", // Light Blue
};

export const Statistics = ({ netSwitch }) => {
  return (
    <Stack gap="lg" justify="space-evenly">
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
      <Group>
        <ScoresChart netSwitch={netSwitch} />
        <CourseAverages netSwitch={netSwitch} />
      </Group>
    </Stack>
  );
};

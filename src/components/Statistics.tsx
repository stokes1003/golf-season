import { Stack, Text, Group, Box, Paper, ScrollArea } from "@mantine/core";
import { ScoresChart } from "./ScoresChart";
import { CourseAverages } from "./CourseAverages";
import { HandicapEvolution } from "./HandicapEvolution";
import React from "react";
import { useMediaQuery } from "@mantine/hooks";

const PLAYER_COLORS = {
  Travis: "#FF6B6B", // Red
  Stokes: "#40C057", // Green
  JP: "#228BE6", // Light Blue
};

export const Statistics = ({ netSwitch }) => {
  const isMobile = useMediaQuery("(max-width: 782px)");

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
        <ScrollArea w="80vw" type="never">
          <Group justify="center" gap="lg" wrap="nowrap" px="lg">
            <Stack>
              <ScoresChart netSwitch={netSwitch} />
            </Stack>
            <Stack>
              <CourseAverages netSwitch={netSwitch} />
            </Stack>
            <Stack>
              <HandicapEvolution />
            </Stack>
          </Group>
        </ScrollArea>
      ) : (
        <Paper shadow="sm" py="lg" radius="md" withBorder>
          <ScrollArea w="80vw" type="never">
            <Group justify="center" gap="lg" wrap="nowrap" px="lg">
              <Stack>
                <ScoresChart netSwitch={netSwitch} />
              </Stack>
              <Stack>
                <CourseAverages netSwitch={netSwitch} />
              </Stack>
              <Stack>
                <HandicapEvolution />
              </Stack>
            </Group>
          </ScrollArea>
        </Paper>
      )}
    </Stack>
  );
};

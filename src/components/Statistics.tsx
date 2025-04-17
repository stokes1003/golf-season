import { Stack, Text } from "@mantine/core";
import { ScoresChart } from "./ScoresChart";
import React from "react";

export const Statistics = ({ netSwitch }) => {
  return (
    <Stack gap="lg" justify="space-evenly">
      <Stack align="center" justify="center" gap="xs">
        <Text fw={900}>Statistics</Text>
      </Stack>
      <ScoresChart netSwitch={netSwitch} />
    </Stack>
  );
};

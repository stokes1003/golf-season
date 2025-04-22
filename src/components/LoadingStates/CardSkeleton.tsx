import React from "react";
import { Card, Skeleton, Stack, Group } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

export const CardSkeleton = () => {
  const isMobile = useMediaQuery("(max-width: 782px)");

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="lg"
      withBorder
      w={isMobile ? 260 : 240}
      h={280}
    >
      <Stack gap="lg" align="center">
        <Stack align="center" gap="sm">
          <Skeleton height={64} circle />
          <Skeleton height={20} width={100} />
        </Stack>

        <Stack gap="sm" w="100%">
          {[1, 2, 3].map((i) => (
            <Group key={i} justify="space-between" gap={24}>
              <Skeleton height={20} width={60} />
              <Skeleton height={20} width={60} />
            </Group>
          ))}
        </Stack>
      </Stack>
    </Card>
  );
};

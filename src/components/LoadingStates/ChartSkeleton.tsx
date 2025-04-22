import React from "react";
import { Card, Skeleton, Stack, Container } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

export const ChartSkeleton = () => {
  const isMobile = useMediaQuery("(max-width: 782px)");

  return (
    <Container size="lg" px={0}>
      <Card shadow="sm" padding="lg" radius="lg" withBorder>
        <Stack gap="md" align="center">
          <Skeleton height={20} width={200} />
          <Skeleton height={300} width={isMobile ? 344 : 450} radius="sm" />
        </Stack>
      </Card>
    </Container>
  );
};

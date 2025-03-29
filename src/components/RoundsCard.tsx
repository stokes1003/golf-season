import React from "react";
import { Card, Stack, Text, Group, Avatar, Image, Button } from "@mantine/core";
import { useGetGolfCourses, useGetPlayers } from "../hooks";
import { useMediaQuery } from "@mantine/hooks";

export const RoundsCard = ({
  round,
  deleteRoundId,
  setDeleteRoundId,
  openModal,
}) => {
  const { players } = useGetPlayers();
  const golfCourses = useGetGolfCourses();
  const isMobile = useMediaQuery("(max-width: 782px)");
  return (
    <>
      <Card
        shadow="lg"
        pb="lg"
        radius="lg"
        withBorder
        w={isMobile ? 344 : 352}
        onClick={() =>
          setDeleteRoundId((prev) =>
            prev === round._id.toString() ? null : round._id.toString()
          )
        }
        style={{
          transition: "transform 0.2s ease-in-out",
          transformOrigin: "center",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(0.98)";
        }}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <Stack align="center">
          <Card.Section>
            <Image
              w={352}
              h={200}
              src={golfCourses.find((c) => c.courseName === round.course)?.img}
            />
          </Card.Section>
          <Stack gap="xs" align="center">
            <Text fw={800}>{round.course}</Text>
            <Text>{new Date(round.date).toLocaleDateString()}</Text>
          </Stack>
          <Stack align="center">
            <Group gap={48}>
              <Text fw={600} w={40} style={{ textAlign: "center" }}>
                PLR
              </Text>
              <Text fw={600} w={32} style={{ textAlign: "center" }}>
                GRS
              </Text>
              <Text fw={600} w={32} style={{ textAlign: "center" }}>
                NET
              </Text>
              <Text fw={600} w={32} style={{ textAlign: "center" }}>
                HCP
              </Text>
            </Group>
            {round.scores
              .slice()
              .sort((a, b) => a.net - b.net)
              .map((player) => (
                <Group key={player.player} gap={48}>
                  <Avatar
                    src={
                      players.find((p) => p.player === player.player)?.img || ""
                    }
                    w={40}
                  />
                  <Text w={32} style={{ textAlign: "center" }}>
                    {player.gross}
                  </Text>
                  <Text w={32} style={{ textAlign: "center" }}>
                    {player.net}
                  </Text>
                  <Text w={32} style={{ textAlign: "center" }}>
                    {player.hcp}
                  </Text>
                </Group>
              ))}
          </Stack>
          {deleteRoundId === round._id.toString() && (
            <Button
              w={150}
              onClick={(e) => {
                e.stopPropagation();
                openModal(round._id.toString());
              }}
            >
              Delete Round
            </Button>
          )}
        </Stack>
      </Card>
    </>
  );
};

import React from "react";
import {
  Card,
  Stack,
  Text,
  Group,
  Avatar,
  Image,
  Button,
  Box,
  Center,
  ActionIcon,
  Badge,
} from "@mantine/core";
import { useGetGolfCourses, useGetPlayers } from "../hooks";
import { useMediaQuery } from "@mantine/hooks";
import { IconTrophy, IconTrash } from "@tabler/icons-react";

export const RoundsCard = ({
  round,
  deleteRoundId,
  setDeleteRoundId,
  openModal,
}) => {
  const { players } = useGetPlayers();
  const golfCourses = useGetGolfCourses();
  const isMobile = useMediaQuery("(max-width: 782px)");

  const date = new Date(round.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

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
          {/* {round.isMajor && (
            <Box
              pos="absolute"
              top="0"
              left="0"
              bg="green"
              w="45px"
              h="45px"
              style={{
                borderRadius: "50%",
                border: "1px solid white",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <IconTrophy stroke={2} size="30" color="white" />
            </Box>
          )} */}
          {round.isMajor && (
            <Box
              pos="absolute"
              bottom={
                deleteRoundId === round._id.toString() ? "343px" : "290px"
              }
              bg="green"
              w="100%"
              h="32px"
            >
              <Group align="center" gap={5} justify="center" h="100%">
                <Text fw={800} c="white">
                  {round.majorName || "Major"}
                </Text>
              </Group>
            </Box>
          )}
          <Stack gap="xs" align="center">
            <Text fw={800}>{round.course}</Text>
            <Text size="sm" c="dimmed">
              {date}
            </Text>
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
              color={round.isMajor ? "green" : "blue"}
            >
              Delete Round
            </Button>
          )}
        </Stack>
      </Card>
    </>
  );
};

import {
  Stack,
  Text,
  Card,
  Group,
  Avatar,
  Image,
  Button,
  Modal,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import React, { useState } from "react";
import { useGetPlayers, useGetGolfCourses, useGetScores } from "../hooks";

export const OfficialRounds = () => {
  const allScores = useGetScores();
  const players = useGetPlayers();
  const golfCourses = useGetGolfCourses();
  const [deleteRoundId, setDeleteRoundId] = useState<string | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const isMobile = useMediaQuery("(max-width: 500px)");

  const openModal = (roundId: string) => {
    setDeleteRoundId(roundId);
    open();
  };

  const deleteRound = async () => {
    try {
      const response = await fetch("/.netlify/functions/deleteRound", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: deleteRoundId }),
      });
      if (response.ok) {
        close();
        setDeleteRoundId(null);
      }
    } catch (error) {
      console.error("Error deleting round:", error);
    }
  };

  if (!allScores) return <Text>Loading...</Text>;

  return (
    <Stack gap="lg" align="center">
      <Text fw={900}>Official Rounds</Text>
      <Stack gap="lg">
        {allScores.map((round) => (
          <Card
            key={round._id.toString()}
            shadow="lg"
            pt="sm"
            pb="lg"
            radius="lg"
            withBorder
            w={352}
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
              <Image
                w={328}
                h={180}
                radius="md"
                src={
                  golfCourses.find((c) => c.courseName === round.course)?.img
                }
              />
              <Stack gap="xs" align="center">
                <Text fw={800}>{round.course}</Text>
                <Text>{new Date(round.date).toLocaleDateString()}</Text>
              </Stack>
              <Stack align="center">
                <Group gap={52}>
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
                    <Group key={player.player} gap={52}>
                      <Avatar
                        src={
                          players.find((p) => p.player === player.player)
                            ?.img || ""
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
        ))}
      </Stack>
      <Modal
        opened={opened}
        onClose={close}
        title="Delete Round"
        w={340}
        centered
        overlayProps={{
          backgroundOpacity: 0.1,
          blur: 0.3,
        }}
      >
        <Stack gap="lg" align="center">
          <Text>Are you sure you want to delete this round?</Text>
          {isMobile && (
            <Stack>
              <Button variant="outline" onClick={close} w={150}>
                Cancel
              </Button>
              <Button w={150} onClick={deleteRound}>
                Delete
              </Button>
            </Stack>
          )}
          {!isMobile && (
            <Group>
              <Button variant="outline" onClick={close} w={150}>
                Cancel
              </Button>
              <Button w={150} onClick={deleteRound}>
                Delete
              </Button>
            </Group>
          )}
        </Stack>
      </Modal>
    </Stack>
  );
};

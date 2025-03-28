import { Stack, Text, Group, Button, Modal, ScrollArea } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import React, { useState } from "react";
import { useGetScores } from "../hooks";
import { RoundsCard } from "./RoundsCard";

export const OfficialRounds = ({
  updateScores,
  setUpdateScores,
  updatePlayers,
  setUpdatePlayers,
}) => {
  const allScores = useGetScores(setUpdatePlayers, updateScores);

  const [deleteRoundId, setDeleteRoundId] = useState<string | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const isMobile = useMediaQuery("(max-width: 600px)");

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
        setDeleteRoundId(null);
        setUpdateScores((prev: number) => prev + 1);
        close();
      }
    } catch (error) {
      console.error("Error deleting round:", error);
    }
  };

  if (!allScores) return <Text>Loading...</Text>;

  return (
    <Stack gap="lg" align="center">
      <Text fw={900}>Official Rounds</Text>
      {!isMobile ? (
        <Stack gap="lg">
          {allScores.map((round) => (
            <RoundsCard
              key={round._id.toString()}
              updatePlayers={updatePlayers}
              updateScores={updateScores}
              round={round}
              deleteRoundId={deleteRoundId}
              setDeleteRoundId={setDeleteRoundId}
              openModal={openModal}
            />
          ))}
        </Stack>
      ) : (
        <ScrollArea w={400}>
          <Group wrap="nowrap" gap="lg">
            {allScores.map((round) => (
              <RoundsCard
                key={round._id.toString()}
                updatePlayers={updatePlayers}
                updateScores={updateScores}
                round={round}
                deleteRoundId={deleteRoundId}
                setDeleteRoundId={setDeleteRoundId}
                openModal={openModal}
              />
            ))}
          </Group>
        </ScrollArea>
      )}

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

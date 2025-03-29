import { Stack, Text, Group, Button, Modal, ScrollArea } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import React, { useState } from "react";
import { useGetScores, useGetPlayers } from "../hooks";
import { RoundsCard } from "./RoundsCard";

export const OfficialRounds = ({}) => {
  const { scores, fetchScores } = useGetScores();
  const { fetchPlayers } = useGetPlayers();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteRoundId, setDeleteRoundId] = useState<string | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const isMobile = useMediaQuery("(max-width: 420px)");

  const openModal = (roundId: string) => {
    setDeleteRoundId(roundId);
    open();
  };

  const deleteRound = async () => {
    try {
      setIsDeleting(true);
      const response = await fetch("/.netlify/functions/deleteRound", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: deleteRoundId }),
      });
      if (response.ok) {
        setDeleteRoundId(null);
        await fetchScores();
        await fetchPlayers();

        close();
      }
    } catch (error) {
      console.error("Error deleting round:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!scores) return <Text>Loading...</Text>;

  return (
    <Stack gap="lg" align="center">
      <Text fw={900}>Official Rounds</Text>
      {!isMobile ? (
        <Stack gap="lg">
          {scores.map((round) => (
            <RoundsCard
              key={round._id.toString()}
              round={round}
              deleteRoundId={deleteRoundId}
              setDeleteRoundId={setDeleteRoundId}
              openModal={openModal}
            />
          ))}
        </Stack>
      ) : (
        <ScrollArea w={420}>
          <Group wrap="nowrap" gap="lg" mx="lg" grow>
            {scores.map((round) => (
              <RoundsCard
                key={round._id.toString()}
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
              <Button
                variant="outline"
                onClick={close}
                w={150}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button w={150} onClick={deleteRound} disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </Stack>
          )}
          {!isMobile && (
            <Group>
              <Button
                variant="outline"
                onClick={close}
                w={150}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button w={150} onClick={deleteRound} disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </Group>
          )}
        </Stack>
      </Modal>
    </Stack>
  );
};

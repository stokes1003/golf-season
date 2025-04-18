import {
  Stack,
  Text,
  Group,
  Button,
  Modal,
  ScrollArea,
  Pagination,
  Tabs,
  Paper,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import React, { useState, useMemo } from "react";
import { useGetScores, useGetPlayers } from "../hooks";
import { RoundsCard } from "./RoundsCard";

export const OfficialRounds = ({}) => {
  const { scores, fetchScores } = useGetScores();
  const { fetchPlayers } = useGetPlayers();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteRoundId, setDeleteRoundId] = useState<string | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [activePage, setActivePage] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState<string | null>("all");
  const isMobile = useMediaQuery("(max-width: 620px)");

  const groupedRounds = useMemo(() => {
    if (!scores) return new Map();

    const grouped = new Map();
    scores.forEach((round) => {
      const date = new Date(round.date);
      const monthYear = date.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });
      if (!grouped.has(monthYear)) {
        grouped.set(monthYear, []);
      }
      grouped.get(monthYear).push(round);
    });

    // Sort rounds within each month by date (newest first)
    grouped.forEach((rounds) => {
      rounds.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    });

    return grouped;
  }, [scores]);

  const currentRounds = useMemo(() => {
    if (!scores) return [];
    if (selectedMonth === "all") {
      return [...scores].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    }
    if (!selectedMonth || !groupedRounds.has(selectedMonth)) return [];
    return groupedRounds.get(selectedMonth);
  }, [selectedMonth, groupedRounds, scores]);

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

  const ITEMS_PER_PAGE = 5;
  const totalPages = Math.ceil((currentRounds?.length || 0) / ITEMS_PER_PAGE);
  const paginatedRounds = currentRounds.slice(
    (activePage - 1) * ITEMS_PER_PAGE,
    activePage * ITEMS_PER_PAGE
  );

  // Reset pagination when changing months
  const handleMonthChange = (value: string | null) => {
    setSelectedMonth(value);
    setActivePage(1);
  };

  return (
    <Stack gap="lg" align="center">
      <Text fw={900}>Official Rounds</Text>

      <Tabs
        value={selectedMonth}
        onChange={handleMonthChange}
        defaultValue="all"
      >
        <Tabs.List>
          <Tabs.Tab value="all">All Rounds</Tabs.Tab>
          {Array.from(groupedRounds.keys()).map((month) => (
            <Tabs.Tab key={month} value={month}>
              {month}
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs>

      {isMobile ? (
        <ScrollArea w="100vw" type="never">
          <Group wrap="nowrap" gap="lg" px="lg">
            {paginatedRounds.map((round) => (
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
      ) : (
        <Paper shadow="sm" py="md" radius="md" withBorder>
          <ScrollArea w="80vw" type="never">
            <Group wrap="nowrap" gap="lg" px="lg">
              {paginatedRounds.map((round) => (
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
        </Paper>
      )}

      {totalPages > 1 && (
        <Pagination
          total={totalPages}
          value={activePage}
          onChange={setActivePage}
          mt="md"
        />
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

import { Stack, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React, { useState } from "react";
import {
  useGetGolfCourses,
  useGetPlayers,
  usePostScores,
  useUpdatePlayerPoints,
  useGetScores,
} from "../hooks";
import { ConfirmRoundSubmit } from "./AddScores/ConfirmRoundSubmit";
import { ScoresFormHeader } from "./AddScores/ScoresFormHeader";
import { SelectGolfCourse } from "./AddScores/SelectGolfCourse";
import { EnterPlayerScores } from "./AddScores/EnterPlayerScores";
export const AddScores = ({ setIsLeaderboard }) => {
  const golfCourses = useGetGolfCourses();
  const [golfCourse, setGolfCourse] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState("selectGolfCourse");
  const updatePlayerPoints = useUpdatePlayerPoints();
  const postScores = usePostScores();
  const { players, fetchPlayers } = useGetPlayers();
  const { fetchScores } = useGetScores();
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [isMajor, setIsMajor] = useState(false);

  const [opened, { open, close }] = useDisclosure(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [scoresByPlayer, setScoresByPlayer] = useState([
    { player: "Travis", gross: "", hcp: "" },
    { player: "Stokes", gross: "", hcp: "" },
    { player: "JP", gross: "", hcp: "" },
  ]);

  const handleSubmitScores = () => {
    const gross = parseInt(scoresByPlayer[currentPlayerIndex].gross, 10);
    const handicap = parseInt(scoresByPlayer[currentPlayerIndex].hcp, 10);

    if (
      isNaN(gross) ||
      isNaN(handicap) ||
      gross < 50 ||
      gross > 150 ||
      handicap < 0 ||
      handicap > 54
    ) {
      alert(
        "Invalid scores! Gross should be between 50-150, Handicap should be between 0-54."
      );
      return;
    }

    if (currentPlayerIndex === players.length - 1) {
      open();
    } else {
      setCurrentPlayerIndex((prev) => prev + 1);
    }
  };

  const submitRound = async () => {
    try {
      setIsSubmitting(true);
      const roundData = {
        course: golfCourse!,
        date: new Date(),
        isMajor: isMajor,
        scores: scoresByPlayer.map((player) => ({
          player: player.player,
          gross: parseInt(player.gross, 10),
          hcp: parseInt(player.hcp, 10),
          net: parseInt(player.gross, 10) - parseInt(player.hcp, 10),
        })),
      };

      // First, post the scores
      await postScores(roundData);

      // Then update player points
      await updatePlayerPoints({
        scores: roundData.scores,
        isMajor: roundData.isMajor,
      });

      // Finally, refresh both scores and players data
      await Promise.all([fetchScores(), fetchPlayers()]);

      // Reset the form and return to leaderboard
      setCurrentPlayerIndex(0);
      setCurrentStep("selectGolfCourse");
      close();
      setIsLeaderboard(true);
    } catch (error) {
      console.error("Error submitting scores:", error);
      alert("There was an error submitting the scores. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Stack>
      <Stack align="center" justify="center" gap="xs">
        <Title>Fairway Fleas</Title>
        <Title order={3}>Add A Score</Title>
      </Stack>

      <ScoresFormHeader
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        setIsLeaderboard={setIsLeaderboard}
        currentPlayerIndex={currentPlayerIndex}
        setCurrentPlayerIndex={setCurrentPlayerIndex}
      />

      <SelectGolfCourse
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        golfCourses={golfCourses}
        golfCourse={golfCourse}
        setGolfCourse={setGolfCourse}
        setIsMajor={setIsMajor}
      />

      <EnterPlayerScores
        currentStep={currentStep}
        scoresByPlayer={scoresByPlayer}
        setScoresByPlayer={setScoresByPlayer}
        players={players}
        currentPlayerIndex={currentPlayerIndex}
        setCurrentPlayerIndex={setCurrentPlayerIndex}
        onSubmit={handleSubmitScores}
      />

      <ConfirmRoundSubmit
        submitRound={submitRound}
        isSubmitting={isSubmitting}
        isMajor={isMajor}
        isOpen={opened}
        onClose={close}
        golfCourse={golfCourse!}
        players={players}
        scoresByPlayer={scoresByPlayer}
      />
    </Stack>
  );
};

import { Stack } from "@mantine/core";
import { OfficialRounds } from "./components/OfficialRounds";
import { Leaderboard } from "./components/Leaderboard";
import { AddScores } from "./components/AddScores";
import { HeaderMenu } from "./components/Header";
import { useState } from "react";

function App() {
  const [isLeaderboard, setIsLeaderboard] = useState(true);
  const [updateScores, setUpdateScores] = useState(0);
  return (
    <Stack mb="xl" align="center" gap="xl">
      <HeaderMenu setIsLeaderboard={setIsLeaderboard} />
      {isLeaderboard ? (
        <Stack gap="xl">
          <Leaderboard updateSores={updateScores} />
          <OfficialRounds
            updateScores={updateScores}
            setUpdateScores={setUpdateScores}
          />
        </Stack>
      ) : (
        <AddScores
          setIsLeaderboard={setIsLeaderboard}
          updateScores={updateScores}
          setUpdateScores={setUpdateScores}
        />
      )}
    </Stack>
  );
}

export default App;

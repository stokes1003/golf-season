import { Stack } from "@mantine/core";
import { OfficialRounds } from "./components/OfficialRounds";
import { Leaderboard } from "./components/Leaderboard";
import { AddScores } from "./components/AddScores";
import { HeaderMenu } from "./components/Header";
import { useState } from "react";

function App() {
  const [isLeaderboard, setIsLeaderboard] = useState(true);
  const [updateScores, setUpdateScores] = useState(0);
  const [updatePlayers, setUpdatePlayers] = useState(0);
  return (
    <Stack mb="xl" align="center" gap="xl">
      <HeaderMenu setIsLeaderboard={setIsLeaderboard} />
      {isLeaderboard ? (
        <Stack gap="xl">
          <Leaderboard
            updateScores={updateScores}
            updatePlayers={updatePlayers}
            setUpdatePlayers={setUpdatePlayers}
          />
          <OfficialRounds
            updateScores={updateScores}
            setUpdateScores={setUpdateScores}
            setUpdatePlayers={setUpdatePlayers}
            updatePlayers={updatePlayers}
          />
        </Stack>
      ) : (
        <AddScores
          setIsLeaderboard={setIsLeaderboard}
          updateScores={updateScores}
          setUpdateScores={setUpdateScores}
          updatePlayers={updatePlayers}
          setUpdatePlayers={setUpdatePlayers}
        />
      )}
    </Stack>
  );
}

export default App;

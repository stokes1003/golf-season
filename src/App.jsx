import { Stack } from "@mantine/core";
import { OfficialRounds } from "./components/OfficialRounds";
import { Leaderboard } from "./components/Leaderboard";
import { AddScores } from "./components/AddScores";
import { HeaderMenu } from "./components/Header";
import { useState } from "react";

function App() {
  const [isLeaderboard, setIsLeaderboard] = useState(true);

  return (
    <Stack mb="xl" align="center" gap="xl">
      <HeaderMenu setIsLeaderboard={setIsLeaderboard} />
      {isLeaderboard ? (
        <Stack gap="xl">
          <Leaderboard />
          <OfficialRounds />
        </Stack>
      ) : (
        <AddScores setIsLeaderboard={setIsLeaderboard} />
      )}
    </Stack>
  );
}

export default App;

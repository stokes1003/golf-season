import { Stack } from "@mantine/core";
import { OfficialRounds } from "./components/OfficialRounds";
import { Leaderboard } from "./components/Leaderboard";
import { AddScores } from "./components/AddScores";
import { HeaderMenu } from "./components/Header";
import { Statistics } from "./components/Statistics";
import { useState } from "react";

function App() {
  const [isLeaderboard, setIsLeaderboard] = useState(true);
  const [netSwitch, setNetSwitch] = useState(true);

  return (
    <Stack mb="xl" align="center" gap="xl">
      <HeaderMenu setIsLeaderboard={setIsLeaderboard} />
      {isLeaderboard ? (
        <Stack gap="xl">
          <Leaderboard netSwitch={netSwitch} setNetSwitch={setNetSwitch} />
          <Statistics netSwitch={netSwitch} />
          <OfficialRounds />
        </Stack>
      ) : (
        <AddScores setIsLeaderboard={setIsLeaderboard} />
      )}
    </Stack>
  );
}

export default App;

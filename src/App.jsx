import { Stack, Title } from "@mantine/core";

import { useState } from "react";
import { OfficialRounds } from "./OfficialRounds";
import { Leaderboard } from "./Leaderboard";
import { AddScores } from "./AddScores";

function App() {
  const [players, setPlayers] = useState([]);
  const [allScores, setAllScores] = useState([]);

  return (
    <Stack my="md" align="center" justify="center" gap="xl">
      <Stack>
        <Title>Fairway Fleas Country Club</Title>
      </Stack>
      <AddScores
        players={players}
        setPlayers={setPlayers}
        allScores={allScores}
        setAllScores={setAllScores}
      />
      <Leaderboard players={players} />
      <OfficialRounds allScores={allScores} />
    </Stack>
  );
}

export default App;

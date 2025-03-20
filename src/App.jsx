import { Stack, Title } from "@mantine/core";
import { OfficialRounds } from "./components/OfficialRounds";
import { Leaderboard } from "./components/Leaderboard";
import { AddScores } from "./components/AddScores";

function App() {
  return (
    <Stack my="md" align="center" justify="center" gap="xl">
      <Stack>
        <Title>Fairway Fleas Country Club</Title>
      </Stack>
      <Leaderboard />
      <AddScores />
      <OfficialRounds />
    </Stack>
  );
}

export default App;

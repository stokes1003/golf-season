import { Stack, Title } from "@mantine/core";
import { OfficialRounds } from "./components/OfficialRounds";
import { Leaderboard } from "./components/Leaderboard";
import { AddScores } from "./components/AddScores";

function App() {
  return (
    <Stack my="xl" align="center" gap="xl">
      <Stack align="center" justify="center" gap="xs">
        <Title>Fairway Fleas</Title>
        <Title order={3}>2025 Season</Title>
      </Stack>
      <Leaderboard />
      <AddScores />
      <OfficialRounds />
    </Stack>
  );
}

export default App;

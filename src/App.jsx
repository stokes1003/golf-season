import {
  Stack,
  Text,
  Title,
  Button,
  Avatar,
  Grid,
  Input,
  Group,
  Select,
} from "@mantine/core";

import { useState } from "react";

function App() {
  const players = [
    { name: "Travis", netWins: 1, grossWins: 0, image: "TV" },
    { name: "Stokes", netWins: 0, grossWins: 1, image: "SS" },
    { name: "JP", netWins: 0, grossWins: 0, image: "JP" },
  ];
  const golfCourses = ["MoWilly", "Lions", "Jimmy Clay", "Roy Kizer"];
  const [value, setValue] = useState("golfcourses");
  const [isScore, setIsScore] = useState(false);
  const [isGolfCourse, setIsGolfCourse] = useState(false);
  const [isAddScore, setIsAddScore] = useState(true);

  return (
    <Stack my="md" align="center" justify="center" gap="xl">
      <Stack>
        <Title>Fairway Fleas Country Club</Title>
      </Stack>

      {isGolfCourse && (
        <Stack gap="md" align="center">
          <Stack gap="xs">
            <Text fw={600}> Select Golf Course</Text>
            <Select data={golfCourses} value={value} onChange={setValue} />
          </Stack>

          <Button
            w={150}
            onClick={() => {
              setIsScore((prev) => !prev);
              setIsGolfCourse((prev) => !prev);
            }}
          >
            Submit Course
          </Button>
        </Stack>
      )}

      {isScore && (
        <Stack align="center">
          <Group>
            {players.map((player) => (
              <Stack key={player.name} align="center" gap="xs">
                <Text fw={700}>{player.name}</Text>
                <Input placeholder={`${player.name}'s Net`} w={150} />
                <Input placeholder={`${player.name}'s HCP`} w={150} />
                <Input placeholder={`${player.name}'s Gross`} w={150} />
              </Stack>
            ))}
          </Group>
          <Button
            w={150}
            onClick={() => {
              setIsAddScore((prev) => !prev);
              setIsScore((prev) => !prev);
            }}
          >
            Submit Scores
          </Button>
        </Stack>
      )}
      {isAddScore && (
        <Button
          w={150}
          onClick={() => {
            setIsGolfCourse((prev) => !prev);
            setIsAddScore((prev) => !prev);
          }}
        >
          Add Scores
        </Button>
      )}

      <Grid align="center" gutter="xs">
        <Grid.Col span={5}>
          <Text fw={700}>Player</Text>
        </Grid.Col>
        <Grid.Col span={3} ta="center">
          <Text fw={700}>Net</Text>
        </Grid.Col>
        <Grid.Col span={3} ta="center">
          <Text fw={700}>Gross</Text>
        </Grid.Col>
      </Grid>
      {players.map((player) => (
        <Grid
          key={player.name}
          justify="space-between"
          gutter="xl"
          align="center"
        >
          <Grid.Col span={3}>
            <Avatar>{player.image}</Avatar>
          </Grid.Col>
          <Grid.Col span={3}>
            <Text>{player.name}</Text>
          </Grid.Col>
          <Grid.Col span={3} ta="center">
            <Text>{player.netWins}</Text>
          </Grid.Col>
          <Grid.Col span={3} ta="center">
            <Text>{player.grossWins}</Text>
          </Grid.Col>
        </Grid>
      ))}
    </Stack>
  );
}

export default App;

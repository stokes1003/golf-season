import {
  Stack,
  Text,
  Title,
  Button,
  Divider,
  Grid,
  Input,
  Group,
  Select,
  Avatar,
} from "@mantine/core";

import { useState } from "react";

function App() {
  const [stokesNetWins, setStokesNetWins] = useState(0);
  const [stokesGrossWins, setStokesGrossWins] = useState(0);
  const [jpNetWins, setJpNetWins] = useState(0);
  const [jpGrossWins, setJpGrossWins] = useState(0);
  const [travisGrossWins, setTravisGrossWins] = useState(0);
  const [travisNetWins, setTravisNetWins] = useState(0);

  const players = [
    {
      name: "Travis",
      image: "TV",
      netWins: travisNetWins,
      grossWins: travisGrossWins,
    },
    {
      name: "Stokes",
      image: "SS",
      netWins: stokesNetWins,
      grossWins: stokesGrossWins,
    },
    {
      name: "JP",
      image: "JP",
      netWins: jpNetWins,
      grossWins: jpGrossWins,
    },
  ];

  const rounds = [
    {
      id: 0,
      course: "MoWilly",
      date: "2024-10-01",
      scores: [
        { player: "Travis", net: 72, gross: 78, hcp: 10 },
        { player: "Stokes", net: 72, gross: 78, hcp: 10 },
        { player: "JP", net: 72, gross: 78, hcp: 10 },
      ],
    },
  ];

  const postScores = () => {
    fetch("/.netlify/functions/addScore", {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        course: golfCourse,
        date: new Date().toISOString(),
      }),
    })
      .then((response) => response.json())
      .then((data) => console.log("success", data))
      .catch((error) => {
        console.error("Error posting scores:", error);
      });
  };

  const golfCourses = ["MoWilly", "Lions", "Jimmy Clay", "Roy Kizer"];
  const [golfCourse, setGolfCourse] = useState("golfcourses");
  const [isScore, setIsScore] = useState(false);
  const [isGolfCourse, setIsGolfCourse] = useState(false);
  const [isAddScore, setIsAddScore] = useState(true);
  const [playerCounter, setPlayerCounter] = useState(0);

  return (
    <Stack my="md" align="center" justify="center" gap="xl">
      <Stack>
        <Title>Fairway Fleas Country Club</Title>
      </Stack>

      {isGolfCourse && (
        <Stack gap="md" align="center">
          <Stack gap="xs">
            <Text fw={600}> Select Golf Course</Text>
            <Select
              data={golfCourses}
              value={golfCourse}
              onChange={setGolfCourse}
            />
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
            <Stack key={players[playerCounter].name} align="center" gap="xs">
              <Text fw={700}>{players[playerCounter].name}</Text>
              <Input
                placeholder={`${players[playerCounter].name}'s HCP`}
                w={150}
              />
              <Input
                placeholder={`${players[playerCounter].name}'s Gross`}
                w={150}
              />
            </Stack>
          </Group>
          <Button
            w={150}
            onClick={() => {
              if (playerCounter === 2) {
                setPlayerCounter(0);
                postScores();
                setIsAddScore((prev) => !prev);
                setIsScore((prev) => !prev);
              }
              setPlayerCounter((prev) => prev + 1);
            }}
          >
            {playerCounter === 2 ? "Submit Scores" : "Next Player"}
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

      <Stack gap="sm" w="30%" justify="space-evenly">
        <Text fw={900}>Leaderboard</Text>
        <Grid align="center" gutter="xs">
          <Grid.Col span={6} align="center">
            <Text fw={700}>Player</Text>
          </Grid.Col>
          <Grid.Col span={3} ta="center" align="center">
            <Text fw={700}>Net</Text>
          </Grid.Col>
          <Grid.Col span={3} ta="center" align="center">
            <Text fw={700}>Gross</Text>
          </Grid.Col>
        </Grid>

        {players.map((player) => (
          <Stack key={player.name}>
            <Grid gutter="xl" align="center">
              <Grid.Col span={3} ta="center" w={64}>
                <Avatar>{player.image}</Avatar>
              </Grid.Col>
              <Grid.Col span={3} w={72}>
                <Text>{player.name}</Text>
              </Grid.Col>
              <Grid.Col span={3} ta="center" w={64}>
                <Text>{player.netWins}</Text>
              </Grid.Col>
              <Grid.Col span={3} ta="center" w={64}>
                <Text>{player.grossWins}</Text>
              </Grid.Col>
            </Grid>
          </Stack>
        ))}
      </Stack>

      <Stack gap="sm" w="60%">
        <Text fw={900}>Official Rounds</Text>
        <Grid align="center" gutter="xs">
          <Grid.Col span={2} align="center">
            <Text fw={700}>Player</Text>
          </Grid.Col>
          <Grid.Col span={2} ta="center" align="center">
            <Text fw={700}>Course</Text>
          </Grid.Col>
          <Grid.Col span={2} ta="center" align="center">
            <Text fw={700}>HCP</Text>
          </Grid.Col>
          <Grid.Col span={2} ta="center" align="center">
            <Text fw={700}>Net</Text>
          </Grid.Col>
          <Grid.Col span={2} ta="center" align="center">
            <Text fw={700}>Gross</Text>
          </Grid.Col>
          <Grid.Col span={2} ta="center" align="center">
            <Text fw={700}>Date</Text>
          </Grid.Col>
        </Grid>
        <Divider />
        {rounds.map((round) =>
          round.scores.map((player) => (
            <Stack key={`${round.id}-${player.player}`}>
              <Grid justify="space-between" gutter="xl" align="center">
                <Grid.Col span={2} w={72}>
                  <Text>{player.player}</Text>
                </Grid.Col>
                <Grid.Col span={2} w={72}>
                  <Text>{round.course}</Text>
                </Grid.Col>
                <Grid.Col span={2} ta="center" w={64}>
                  <Text>{player.hcp}</Text>
                </Grid.Col>
                <Grid.Col span={2} ta="center" w={64}>
                  <Text>{player.net}</Text>
                </Grid.Col>
                <Grid.Col span={2} ta="center" w={64}>
                  <Text>{player.gross}</Text>
                </Grid.Col>
                <Grid.Col span={2} ta="center" w={72}>
                  <Text>{round.date}</Text>
                </Grid.Col>
              </Grid>
              <Divider />
            </Stack>
          ))
        )}
      </Stack>
    </Stack>
  );
}

export default App;

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
  const golfCourses = ["MoWilly", "Lions", "Jimmy Clay", "Roy Kizer"];
  const [golfCourse, setGolfCourse] = useState("golfcourses");
  const [isScore, setIsScore] = useState(false);
  const [isGolfCourse, setIsGolfCourse] = useState(false);
  const [isAddScore, setIsAddScore] = useState(true);
  const [playerCounter, setPlayerCounter] = useState(0);
  const [playerScores, setPlayerScores] = useState([
    { player: "Travis", gross: "", hcp: "" },
    { player: "Stokes", gross: "", hcp: "" },
    { player: "JP", gross: "", hcp: "" },
  ]);

  const players = [
    {
      name: "Travis",
      image: "TV",
      netWins: 2,
      grossWins: 1,
    },
    {
      name: "Stokes",
      image: "SS",
      netWins: 3,
      grossWins: 2,
    },
    {
      name: "JP",
      image: "JP",
      netWins: 1,
      grossWins: 2,
    },
  ];

  const rounds = [
    {
      course: "MoWilly",
      date: "2024-10-01",
      scores: [
        { player: "Travis", net: 72, gross: 78, hcp: 10 },
        { player: "Stokes", net: 72, gross: 78, hcp: 10 },
        { player: "JP", net: 72, gross: 78, hcp: 10 },
      ],
    },
  ];
  const handleSubmitScores = () => {
    if (playerCounter === 2) {
      setPlayerCounter(0);
      postScores({
        course: golfCourse,
        date: new Date().toISOString(),
        scores: playerScores.map((player) => ({
          player: player.player,
          gross: parseInt(player.gross, 10),
          hcp: parseInt(player.hcp, 10),
          net: parseInt(player.gross, 10) - parseInt(player.hcp, 10),
        })),
      });

      setIsAddScore((prev) => !prev);
      setIsScore((prev) => !prev);
    } else {
      setPlayerCounter((prev) => prev + 1);
    }
  };

  const postScores = async (round) => {
    try {
      const response = await fetch("/.netlify/functions/addScores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(round),
      });

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error submitting scores:", error);
    }
  };

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
                value={playerScores[playerCounter].hcp}
                onChange={(e) => {
                  const updatedScores = [...playerScores];
                  updatedScores[playerCounter].hcp = e.target.value;
                  setPlayerScores(updatedScores);
                }}
              />
              <Input
                placeholder={`${players[playerCounter].name}'s Gross`}
                w={150}
                value={playerScores[playerCounter].gross}
                onChange={(e) => {
                  const updatedScores = [...playerScores];
                  updatedScores[playerCounter].gross = e.target.value;
                  setPlayerScores(updatedScores);
                }}
              />
            </Stack>
          </Group>
          <Button w={150} onClick={handleSubmitScores}>
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

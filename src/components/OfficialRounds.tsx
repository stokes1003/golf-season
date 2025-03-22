import { Stack, Text, Card, Group, Avatar, Center } from "@mantine/core";
import React from "react";
import { useGetScores } from "../hooks";
import { useGetPlayers } from "../hooks";

export const OfficialRounds = () => {
  const allScores = useGetScores(false);
  const players = useGetPlayers(false);

  return (
    <Stack gap="lg" align="center">
      <Stack>
        <Text fw={900}>Official Rounds</Text>
      </Stack>
      <Stack gap="lg">
        {allScores.map((round, index) => (
          <Card
            key={index}
            shadow="lg"
            py="xl"
            radius="lg"
            withBorder
            w={400}
            h={325}
            style={{
              transition: "transform 0.2s ease-in-out",
              transformOrigin: "center",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(0.98)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <Stack align="center">
              <Stack gap="xs" align="center">
                <Text fw={800}>{round.course}</Text>
                <Text>{new Date(round.date).toLocaleDateString()}</Text>
              </Stack>
              <Stack align="center">
                <Group gap={52}>
                  <Text
                    fw={600}
                    w={40}
                    style={{ textAlign: "center", textAlignLast: "center" }}
                  >
                    PLR
                  </Text>
                  <Text
                    fw={600}
                    w={32}
                    style={{ textAlign: "center", textAlignLast: "center" }}
                  >
                    GRS
                  </Text>
                  <Text
                    fw={600}
                    w={32}
                    style={{ textAlign: "center", textAlignLast: "center" }}
                  >
                    NET
                  </Text>
                  <Text
                    fw={600}
                    w={32}
                    style={{ textAlign: "center", textAlignLast: "center" }}
                  >
                    HCP
                  </Text>
                </Group>
                {round.scores
                  .slice()
                  .sort((a, b) => a.net - b.net)
                  .map((player, index) => (
                    <Group key={index} gap={52}>
                      <Avatar
                        src={
                          players.find((p) => p.player === player.player)
                            ?.img || ""
                        }
                        w={40}
                      />

                      <Text w={32} style={{ textAlignLast: "center" }}>
                        {player.gross}
                      </Text>
                      <Text w={32} style={{ textAlignLast: "center" }}>
                        {player.net}
                      </Text>
                      <Text w={32} style={{ textAlignLast: "center" }}>
                        {player.hcp}
                      </Text>
                    </Group>
                  ))}
              </Stack>
            </Stack>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
};

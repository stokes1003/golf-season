import { Stack, Box, Group } from "@mantine/core";
import { IconX, IconArrowNarrowLeft } from "@tabler/icons-react";
import React from "react";

export function ScoresFormHeader({
  currentStep,
  setCurrentStep,
  setIsLeaderboard,
  currentPlayerIndex,
  setCurrentPlayerIndex,
}) {
  return (
    <>
      {currentStep === "selectGolfCourse" && (
        <Stack align="end">
          <Box
            h={24}
            w={24}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.05)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
            style={{ alignContent: "center" }}
          >
            <IconX
              stroke={1}
              cursor={"pointer"}
              onClick={() => {
                setIsLeaderboard(true);
              }}
            />
          </Box>
        </Stack>
      )}

      {currentStep === "enterPlayerScores" && (
        <Group justify="space-between">
          <Box
            h={24}
            w={24}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.05)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
            style={{ alignContent: "center" }}
          >
            <IconArrowNarrowLeft
              stroke={1}
              cursor={"pointer"}
              onClick={() => {
                if (currentPlayerIndex === 0) {
                  setCurrentStep("selectGolfCourse");
                } else setCurrentPlayerIndex((prev) => prev - 1);
              }}
            />
          </Box>
          <Box
            h={24}
            w={24}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.05)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
            style={{ alignContent: "center" }}
          >
            <IconX
              stroke={1}
              cursor={"pointer"}
              onClick={() => {
                setCurrentStep("selectGolfCourse");
                setIsLeaderboard(true);
              }}
            />
          </Box>
        </Group>
      )}
    </>
  );
}

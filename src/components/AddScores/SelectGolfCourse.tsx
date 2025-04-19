import {
  Stack,
  Text,
  Tooltip,
  Select,
  Button,
  Group,
  Tabs,
} from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import React from "react";

export function SelectGolfCourse({
  currentStep,
  setCurrentStep,
  golfCourses,
  golfCourse,
  setGolfCourse,

  setIsMajor,
}) {
  const handleIsMajor = (value: string | null) => {
    setIsMajor(value === "yes");
  };

  return (
    <>
      {currentStep === "selectGolfCourse" && (
        <Stack gap="xl" align="center">
          <Stack gap="xl">
            <Stack gap="xs" align="center">
              <Text fw={600}> Select Golf Course</Text>
              <Select
                w={200}
                data={golfCourses.map((course) => ({
                  value: course.courseName,
                  label: course.courseName,
                }))}
                value={golfCourse}
                onChange={setGolfCourse}
              />
            </Stack>
            <Stack align="center" gap={5}>
              <Group gap={2}>
                <Text fw={600}>Is this round a Major?</Text>
                <Tooltip
                  label="Major rounds double all points."
                  position="right"
                >
                  <IconInfoCircle style={{ cursor: "pointer" }} stroke={2} />
                </Tooltip>
              </Group>

              <Tabs defaultValue="no" onChange={handleIsMajor}>
                <Group gap="xs">
                  <Tabs.Tab value="yes">Yes</Tabs.Tab>
                  <Tabs.Tab value="no">No</Tabs.Tab>
                </Group>
              </Tabs>
            </Stack>
          </Stack>

          <Button
            w={150}
            onClick={() => {
              if (golfCourse === null) {
                alert("Please select a golf course");
              } else {
                setCurrentStep("enterPlayerScores");
              }
            }}
          >
            Submit Course
          </Button>
        </Stack>
      )}
    </>
  );
}

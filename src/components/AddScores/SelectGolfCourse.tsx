import {
  Stack,
  Text,
  Tooltip,
  Select,
  Button,
  Group,
  Tabs,
  TextInput,
} from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import React from "react";

export function SelectGolfCourse({
  currentStep,
  setCurrentStep,
  golfCourses,
  golfCourse,
  setGolfCourse,
  isMajor,
  setIsMajor,
  majorName,
  setMajorName,
}) {
  const handleIsMajor = (value: string | null) => {
    setIsMajor(value === "yes");
    if (value !== "yes") {
      setMajorName("");
    }
  };

  const majorTooltip = (
    <Stack gap={5} align="center">
      <Text fw={600}>Major = double points</Text>
      <Text>Use this for high-stakes rounds you want to count extra.</Text>
    </Stack>
  );

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
                  label={majorTooltip}
                  position="bottom-end"
                  events={{ hover: true, focus: true, touch: true }}
                  multiline
                  w={220}
                >
                  <IconInfoCircle style={{ cursor: "pointer" }} stroke={2} />
                </Tooltip>
              </Group>

              <Tabs defaultValue="no" onChange={handleIsMajor}>
                <Group gap="xs">
                  <Tabs.Tab value="yes" color={isMajor ? "green" : "blue"}>
                    Yes
                  </Tabs.Tab>
                  <Tabs.Tab value="no" color={isMajor ? "green" : "blue"}>
                    No
                  </Tabs.Tab>
                </Group>
              </Tabs>

              {isMajor && (
                <TextInput
                  placeholder="Enter major name"
                  value={majorName}
                  onChange={(e) => setMajorName(e.target.value)}
                  w={200}
                  required
                />
              )}
            </Stack>
          </Stack>

          <Button
            w={150}
            onClick={() => {
              if (golfCourse === null) {
                alert("Please select a golf course");
              } else if (isMajor && !majorName) {
                alert("Please enter a name for the major");
              } else {
                setCurrentStep("enterPlayerScores");
              }
            }}
            color={isMajor ? "green" : "blue"}
          >
            Submit Course
          </Button>
        </Stack>
      )}
    </>
  );
}

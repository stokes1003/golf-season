import React from "react";
import { Burger, Container, Group, Text, Box } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import classes from "../HeaderMenu.module.css";

const links = ["Add Scores", "Leaderboard"];

export function HeaderMenu({ setIsLeaderboard }) {
  const [opened, { toggle }] = useDisclosure(false);
  const isMobile = useMediaQuery("(max-width: 767px)");

  const items = links.map((link) => (
    <a
      key={link}
      href="#"
      className={classes.link}
      onClick={(event) => {
        event.preventDefault();
        if (link === "Leaderboard") {
          setIsLeaderboard(true);
        }
        if (link === "Add Scores") {
          setIsLeaderboard(false);
        }
        toggle();
      }}
    >
      {link}
    </a>
  ));

  return (
    <header
      className={classes.header}
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <Container size="md">
        <Box className={classes.inner}>
          <Group align="center" justify="space-between" w="100%">
            <Box
              style={{ cursor: "pointer" }}
              onClick={() => setIsLeaderboard(true)}
            >
              <Text fw={800}>Fairway Fleas</Text>
            </Box>

            <Group gap={5} visibleFrom="sm">
              {items}
            </Group>
            {isMobile && (
              <>
                <Burger
                  opened={opened}
                  onClick={toggle}
                  size="sm"
                  hiddenFrom="sm"
                />

                {opened && <Box className={classes.mobileMenu}>{items}</Box>}
              </>
            )}
          </Group>
        </Box>
      </Container>
    </header>
  );
}

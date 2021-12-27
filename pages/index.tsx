import { Button } from "@chakra-ui/button";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { Box, Center, Flex, Heading, Stack } from "@chakra-ui/layout";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
} from "@chakra-ui/menu";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";

const Home: NextPage = () => {
  const router = useRouter();
  const [mode, setMode] = useState("single");
  const showMode = () => {
    let result = "Game Mode: ";
    switch (mode) {
      case "b-3":
        result += "Best of 3";
        break;
      case "b-5":
        result += "Best of 5";
        break;
      case "b-10":
        result += "Best of 10";
        break;
      default:
        result += "Single Game";
        break;
    }
    return result;
  };
  return (
    <Box w="100vw" h="100vh">
      <Head>
        <title>Tic Tac Toe Game | Homepage</title>
      </Head>
      <Flex
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        w="100%"
        h="100%"
      >
        <Heading size="xl" mb={10}>
          Tic Tac Toe Game
        </Heading>
        <Menu closeOnSelect={true}>
          <MenuButton as={Button} _expanded={{ bg: "blue.400" }}>
            {showMode()} <ChevronDownIcon />
          </MenuButton>
          <MenuList minWidth="240px">
            <MenuOptionGroup
              defaultValue="single"
              title="Game Mode"
              type="radio"
            >
              <MenuItemOption value="single" onClick={() => setMode("single")}>
                Single Game
              </MenuItemOption>
              <MenuItemOption value="b-3" onClick={() => setMode("b-3")}>
                Best of 3
              </MenuItemOption>
              <MenuItemOption value="b-5" onClick={() => setMode("b-5")}>
                Best of 5
              </MenuItemOption>
              <MenuItemOption value="b-10" onClick={() => setMode("b-10")}>
                Best of 10
              </MenuItemOption>
            </MenuOptionGroup>
          </MenuList>
        </Menu>
        <Button
          size="lg"
          mt={5}
          onClick={() => {
            router.push({
              pathname: "/game",
              query: { mode: mode },
            });
          }}
        >
          Play Game
        </Button>
      </Flex>
    </Box>
  );
};

export default Home;

import { Button } from "@chakra-ui/button";
import { Box, VStack, Text, Heading, Flex, Center } from "@chakra-ui/layout";
import type { NextPage } from "next";
import { NextRouter, withRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import React, { FC, useState } from "react";

type GameMode = "single" | "b-3" | "b-5" | "b-10";
type GameType = "X" | "O" | null;
const squares: Array<GameType> = Array(9).fill(null);
interface RouterProps {
  router: NextRouter;
}
interface BoardProps {
  mode: string | string[] | undefined;
}
interface SquareProps {
  index: number;
  onClick: (index: number) => void;
}
const Square: FC<SquareProps> = (props) => {
  return (
    <Flex
      size="md"
      height="100px"
      width="100px"
      borderWidth="medium"
      justifyContent="center"
      fontSize="xl"
      alignItems="center"
      borderTop={props.index > 5 ? "4px" : "none"}
      borderBottom={props.index < 3 ? "4px" : "none"}
      // hardcoded the values coz i couldn't think of anything better
      borderLeft={
        props.index === 2 || props.index === 5 || props.index === 8
          ? "4px"
          : "none"
      }
      borderRight={props.index % 3 === 0 ? "4px" : "none"}
      onClick={() => props.onClick(props.index)}
    >
      {squares[props.index]}
    </Flex>
  );
};
const Board: FC<BoardProps> = () => {
  let [winner, setWinner] = useState<GameType>(null);
  const [isX, changeX] = useState(true);
  const handleClick = (index: number): void => {
    if (squares[index] === null && winner === null) {
      squares[index] = isX ? "X" : "O";
      changeX(!isX);
    }
    calculateWinner();
  };
  const calculateWinner = () => {
    const winningLines = [
      [0, 1, 2],
      [0, 3, 6],
      [1, 4, 7],
      [6, 7, 8],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let index = 0; index < winningLines.length; index++) {
      const [a, b, c] = winningLines[index];
      if (
        squares[a] === squares[b] &&
        squares[b] === squares[c] &&
        squares[a] !== null
      ) {
        setWinner(squares[a]);
      }
    }
  };
  const renderSquare = (index: number) => {
    return <Square index={index} onClick={handleClick} />;
  };
  const resetBoard = () => {
    for (let index = 0; index < squares.length; index++) {
      squares[index] = null;
    }
    changeX(true);
    setWinner(null);
  };
  return (
    <Box>
      <Text mb={10} textAlign="center">
        The Current Player is {isX ? "X" : "O"}
      </Text>
      <Flex>
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </Flex>
      <Flex>
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </Flex>
      <Flex>
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </Flex>
      {winner !== null ? (
        <Text textAlign="center" mt={10}>
          The winner is {winner}
        </Text>
      ) : null}
      <Center>
        <Button onClick={resetBoard} mt={10}>
          Reset Game
        </Button>
      </Center>
    </Box>
  );
};

const Game: NextPage<RouterProps> = ({ router }) => {
  console.log(router.query);
  return (
    <VStack>
      <Heading size="md" mt={10}>
        Tic Tac Toe Game
      </Heading>
      <Board mode={router.query.mode} />
    </VStack>
  );
};

export default withRouter(Game);

import { Button } from "@chakra-ui/button";
import { Box, VStack, Text, Heading, Flex, Center } from "@chakra-ui/layout";
import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/table";
import type { NextPage } from "next";
import { NextRouter, withRouter } from "next/router";
import React, { FC, useState } from "react";

type GameMode = "single" | "b-3" | "b-5" | "b-10";
type GameType = "X" | "O" | null;
type GameScore = 1 | 0 | "-";
const squares: Array<GameType> = Array(9).fill(null);
interface RouterProps {
  router: NextRouter;
}
interface BoardProps {
  mode: GameMode;
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
const Board: FC<BoardProps> = ({ mode }) => {
  const [winner, setWinner] = useState<GameType>(null);
  var numberOfGames = 1;
  const [currentGame, setCurrentGame] = useState(0);
  const [isDraw, setDraw] = useState(false);
  const isSingle = mode === "single";
  if (!isSingle) {
    switch (mode) {
      case "b-3":
        numberOfGames = 3;
        break;
      case "b-5":
        numberOfGames = 5;
        break;
      case "b-10":
        numberOfGames = 10;
        break;
    }
  }
  const [scores, updateScore] = useState(
    Array<GameScore[]>(numberOfGames).fill(["-", "-"])
  );
  const [isX, changeX] = useState(true);
  const handleClick = (index: number): void => {
    if (squares[index] === null && winner === null && !isDraw) {
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
      [3, 4, 5],
    ];
    for (let index = 0; index < winningLines.length; index++) {
      const [a, b, c] = winningLines[index];
      if (
        squares[a] === squares[b] &&
        squares[b] === squares[c] &&
        squares[a] !== null &&
        winner === null
      ) {
        if (squares[a] === "X") {
          if (currentGame % 2 === 0) {
            scores[currentGame] = [1, 0];
          } else {
            scores[currentGame] = [0, 1];
          }
        } else {
          if (currentGame % 2 === 0) {
            scores[currentGame] = [0, 1];
          } else {
            scores[currentGame] = [1, 0];
          }
        }
        updateScore(scores);
        setWinner(squares[a]);
      } else if (squares.find((element) => element === null) === undefined) {
        scores[currentGame] = [0, 0];
        updateScore(scores);
        setDraw(true);
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
    setCurrentGame(currentGame + 1);
    changeX(true);
    setWinner(null);
    setDraw(false);
  };
  const showScore = () => {
    return scores.map((val, _, __) => {
      return (
        <Tr key={_}>
          <Td textAlign="center">{val[0]}</Td>
          <Td textAlign="center">{val[1]}</Td>
        </Tr>
      );
    });
  };
  const showTable = () => {
    return (
      <Table mt={10} variant="simple">
        <Thead>
          <Tr>
            <Th textAlign="center">
              Player 1 ({currentGame % 2 === 0 ? "X" : "O"})
            </Th>
            <Th textAlign="center">
              Player 2 ({currentGame % 2 === 1 ? "X" : "O"})
            </Th>
          </Tr>
        </Thead>
        <Tbody>{showScore()}</Tbody>
      </Table>
    );
  };
  const nextGame = () => {
    for (let index = 0; index < squares.length; index++) {
      squares[index] = null;
    }
    if (currentGame < numberOfGames - 1) {
      setCurrentGame(currentGame + 1);
      changeX(true);
      setWinner(null);
      setDraw(false);
    }
  };
  return (
    <Box>
      <Text mb={10} textAlign="center">
        The Current Player is{" "}
        {isX
          ? currentGame % 2 === 0
            ? "Player 1 (X)"
            : "Player 2 (X)"
          : currentGame % 2 === 0
          ? "Player 2 (O)"
          : "Player 1 (O)"}
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
      {isDraw ? (
        <Text textAlign="center" mt={10}>
          It's a Draw
        </Text>
      ) : null}
      {isDraw || winner !== null ? (
        <Center mt={5}>
          <Button onClick={nextGame}>Go to the Next Game</Button>
        </Center>
      ) : null}
      <Center>
        <Button
          onClick={() => {
            resetBoard();
            setWinner(null);
            setCurrentGame(0);
            updateScore(Array<GameScore[]>(numberOfGames).fill(["-", "-"]));
          }}
          mt={10}
        >
          Reset Game
        </Button>
      </Center>
      {!isSingle ? showTable() : null}
    </Box>
  );
};

const Game: NextPage<RouterProps> = ({ router }) => {
  return (
    <VStack>
      <Heading size="md" mt={10}>
        Tic Tac Toe Game
      </Heading>
      <Board mode={router.query.mode as GameMode} />
    </VStack>
  );
};

// This fixes a bug in NextJS where the query dissappears for a while
export async function getServerSideProps() {
  return {
    props: {}, // will be passed to the page component as props
  };
}

export default withRouter(Game);

import {
  Box,
  Center,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";

export default function Count() {
  const calculateTimeLeft = () => {
    const difference = +new Date("2024-04-01T20:00:00.000Z") - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState();

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  return (
    <>
      <Box bg={"gray.900"} color={"white"}>
        <Center minH={"70vh"}>
          {timeLeft && (
            <Stack align={"center"} spacing={8}>
              <Heading size={{ base: "2xl", md: "4xl" }}>
                {timeLeft.days || 0}d {timeLeft.hours || 0}h{" "}
                {timeLeft.minutes || 0}m {timeLeft.seconds || 0}s
              </Heading>

              <Text fontSize={{ base: "md", md: "xl" }}>
                Para o lançamento do servidor!
              </Text>
            </Stack>
          )}
        </Center>
      </Box>
    </>
  );
}

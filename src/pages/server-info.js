import { AuthContext } from "@/context/AuthContext";
import {
  Box,
  Center,
  Container,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
  Grid,
  GridItem,
  VStack,
  Badge,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect } from "react";
import { TbPokeball } from "react-icons/tb";
import { TbWorld } from "react-icons/tb";
import { AiOutlineTrophy } from "react-icons/ai";
import { PlayerModal } from "@/components/PlayerModal";

const ServerInfo = () => {
  const { currentUser } = React.useContext(AuthContext);
  const [topPlayers, setTopPlayers] = React.useState([]);
  const [playerModalOpen, setPlayerModalOpen] = React.useState(false);
  const [selectedPlayer, setSelectedPlayer] = React.useState({});
  const [lastCaught, setLastCaught] = React.useState({});
  const [loadingTopLvl, setLoadingTopLvl] = React.useState(false);
  const [loadingCaught, setLoadingCaught] = React.useState(false);

  const getTopLevel = () => {
    setLoadingTopLvl(true);
    axios
      .get("/api/character/list-top-level")
      .then((res) => {
        setLoadingTopLvl(false);
        setTopPlayers(res.data);
      })
      .catch((err) => {
        setLoadingTopLvl(false);
      });
  };

  const getLastCaught = () => {
    setLoadingCaught(true);
    axios
      .get("/api/character/get-last-caught")
      .then((res) => {
        setLoadingCaught(false);
        setLastCaught(res.data);
      })
      .catch((err) => {
        setLoadingCaught(false);
      });
  };

  useEffect(() => {
    if (currentUser) {
      getTopLevel();
      getLastCaught();
    }
  }, [currentUser]);

  const handleOpenPlayerModal = (player) => {
    setPlayerModalOpen(!playerModalOpen);
    setSelectedPlayer(player);
  };

  return (
    <>
      <Box bg="gray.800">
        <Container maxW={"8xl"} minH={"calc(100vh - 100px)"}>
          <Flex pt={10} justify={"center"}>
            <Heading color={"whitesmoke"}>Informações do servidor</Heading>
          </Flex>
          <Grid
            templateColumns={"repeat(4, 1fr)"}
            spacing={10}
            mt={20}
            columnGap={7}
          >
            <GridItem
              bg="white"
              p={4}
              borderRadius={"lg"}
              colSpan={{ base: 4, md: 3 }}
            >
              <Flex direction={"column"} gap={5} align={"center"}>
                <Heading size={"lg"} color="#19b9d9">
                  Como entrar no jogo:
                </Heading>
                <Text>
                  1️⃣ - Crie sua conta e seu personagem no site; <br />
                  2️⃣ - Baixe nosso cliente e logue no jogo: DOWNLOAD CLIENTE{" "}
                  <br />
                  3️⃣ - Selecione um local para instalação, e também de
                  preferencia <br />
                  Selecione "Criar atalho na area de trabalho",
                  <br /> será criado em sua area de trabalho o icone Legends of
                  Unknown, Abra o cliente, e bom jogo.
                </Text>
                <Center w="full">
                  <video height="600" width="600" controls>
                    <source src="https://www.youtube.com/watch?v=6itMpEwVB9Q&embeds_referring_euri=https%3A%2F%2Fwww.legendsofunknown.com.br%2F&feature=emb_imp_woyt" />
                  </video>
                </Center>
              </Flex>
            </GridItem>
            <GridItem
              colSpan={{ base: 0, md: 1 }}
              display={{ base: "none", md: "initial" }}
            >
              <Flex direction={"column"} gap={5}>
                <Stack
                  // display="none"
                  borderRadius={"md"}
                  spacing={0}
                  bg={"gray.300"}
                >
                  <Flex
                    borderTopRadius={"md"}
                    py={2}
                    bg="gray.400"
                    color="whitesmoke"
                    align={"center"}
                    justify="center"
                    gap={2}
                  >
                    <TbWorld fontSize={"20px"} color={"black"} />
                    <Text color={"gray.900"}>Status do servidor</Text>
                  </Flex>
                  <VStack bg="whitesmoke" borderBottomRadius={"md"}>
                    <Flex
                      py={2}
                      w="full"
                      align={"center"}
                      justify={"center"}
                      gap={2}
                      bg={"gray.300"}
                    >
                      <Text>O servidor está:</Text>
                      <Badge align="center" variant="solid" colorScheme="green">
                        ONLINE
                      </Badge>
                    </Flex>
                    <Flex display="none" direction="column" gap={2} w="full" py={2}>
                      <Flex
                        w="full"
                        align={"center"}
                        justify={"space-between"}
                        px={4}
                      >
                        <Text>Treinadores Online:</Text>
                        <Text>0/1000</Text>
                      </Flex>
                      <Flex
                        w="full"
                        align={"center"}
                        justify={"space-between"}
                        px={4}
                      >
                        <Text>Staff Online:</Text>
                        <Text>0</Text>
                      </Flex>
                    </Flex>
                  </VStack>
                </Stack>
                <Stack borderRadius={"md"} spacing={0} bg={"gray.300"}>
                  <Flex
                    borderTopRadius={"md"}
                    py={2}
                    bg="gray.400"
                    color="whitesmoke"
                    align={"center"}
                    justify="center"
                    gap={2}
                  >
                    <AiOutlineTrophy fontSize={"20px"} color={"black"} />
                    <Text color={"gray.900"}>Top Level</Text>
                  </Flex>
                  <PlayerModal
                    width="full"
                    selectedPlayer={selectedPlayer}
                    open={playerModalOpen}
                    setOpen={setPlayerModalOpen}
                  />
                  <VStack bg="whitesmoke" spacing={0} borderBottomRadius={"md"}>
                    {loadingTopLvl ? (
                      <Center p={8}>
                        <Spinner
                          thickness="4px"
                          speed="0.65s"
                          emptyColor="gray.200"
                          color="blue.500"
                          size="xl"
                        />
                      </Center>
                    ) : (
                      topPlayers.map((player) => {
                        return (
                          <Flex
                            key={player.id}
                            w="full"
                            align={"center"}
                            justify={"space-between"}
                            borderBottom="1px solid black"
                            p={2}
                          >
                            <Text
                              onClick={() => handleOpenPlayerModal(player)}
                              cursor={"pointer"}
                              overflowX={"hidden"}
                              whiteSpace={"nowrap"}
                              textOverflow={"ellipsis"}
                              maxW="70%"
                              _hover={{
                                color: "#19b9d9",
                                textDecoration: "underline",
                                textDecorationColor: "#19b9d9",
                              }}
                            >
                              {player.name}
                            </Text>

                            <Badge
                              borderRadius={"lg"}
                              px={3}
                              align="center"
                              variant="solid"
                              colorScheme="green"
                            >
                              {player.level}
                            </Badge>
                          </Flex>
                        );
                      })
                    )}
                  </VStack>
                </Stack>
                <Stack borderRadius={"md"} spacing={0} bg={"gray.300"} mb={4}>
                  <Flex
                    borderTopRadius={"md"}
                    py={2}
                    bg="gray.400"
                    color="whitesmoke"
                    align={"center"}
                    justify="center"
                    gap={2}
                  >
                    <TbPokeball fontSize={"20px"} color={"black"} />
                    <Text color={"gray.900"}>Última Captura (Shiny/Raro)</Text>
                  </Flex>
                  {loadingCaught ? (
                    <Center p={8}>
                      <Spinner
                        thickness="4px"
                        speed="0.65s"
                        emptyColor="gray.200"
                        color="blue.500"
                        size="xl"
                      />
                    </Center>
                  ) : (
                    <>
                      <Center w="full" py={2} bg="whitesmoke">
                        <Flex direction={"row"} gap={2}>
                          <Text>Capturado por:</Text>
                          <Text
                            cursor={"pointer"}
                            onClick={() =>
                              handleOpenPlayerModal(lastCaught.player)
                            }
                            _hover={{
                              color: "#19b9d9",
                              textDecoration: "underline",
                              textDecorationColor: "#19b9d9",
                            }}
                          >
                            {lastCaught?.player?.name}
                          </Text>
                        </Flex>
                      </Center>
                      <Flex
                        justify={"center"}
                        align={"start"}
                        height={"180px"}
                        background={
                          "url('/utils/Grass.png') no-repeat center center"
                        }
                        backgroundSize={"60% 60%"}
                      >
                        <Image
                          h="130px"
                          minW="100px"
                          maxW="3xs"
                          src={
                            process.env.IMAGE_SHINY_PATH +
                            lastCaught?.pokemon?.wild_id +
                            ".gif"
                          }
                        />
                      </Flex>
                      <Center
                        w="full"
                        py={2}
                        bg="whitesmoke"
                        borderBottomRadius={"lg"}
                      >
                        <Heading fontSize={"lg"}>
                          {lastCaught?.pokemon?.name}
                        </Heading>
                      </Center>
                    </>
                  )}
                </Stack>
              </Flex>
            </GridItem>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default ServerInfo;

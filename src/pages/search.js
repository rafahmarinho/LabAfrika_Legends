import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import {
  Box,
  Center,
  Container,
  Flex,
  Heading,
  IconButton,
  Image,
  Stack,
  Text,
  Grid,
  GridItem,
  VStack,
  Badge,
  HStack,
  Select,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { TbWorld } from "react-icons/tb";
import { AiOutlineTrophy } from "react-icons/ai";
import { TbPokeball } from "react-icons/tb";
import { PlayerModal } from "@/components/PlayerModal";

const MyAccount = () => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [loadingTopLvl, setLoadingTopLvl] = React.useState(false);
  const [loadingCaught, setLoadingCaught] = React.useState(false);
  const [topPlayers, setTopPlayers] = React.useState([]);
  const [playerModalOpen, setPlayerModalOpen] = React.useState(false);
  const [selectedPlayer, setSelectedPlayer] = React.useState({});
  const [lastCaught, setLastCaught] = React.useState({});
  const [characters, setCharacters] = React.useState([]);
  const [count, setCount] = React.useState(0);
  const [page, setPage] = React.useState(0);
  const [perPage, setPerPage] = React.useState(8);
  const [search, setSearch] = React.useState("");

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
    getTopLevel();
    getLastCaught();
  }, []);

  const getData = async () => {
    setLoading(true);
    await axios
      .get(`/api/character/search-character`, {
        params: { search: router.query.search, page, perPage },
      })
      .then((res) => {
        setCharacters(res.data.characters);
        setCount(res.data.count);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getData();
  }, [page, perPage, router.query.search]);

  const handleOpenPlayerModal = (player) => {
    setPlayerModalOpen(!playerModalOpen);
    setSelectedPlayer(player);
  };

  return (
    <>
      <Box bg="gray.800">
        <Container maxW={"8xl"} minH={"calc(100vh - 100px)"}>
          <Flex pt={10} justify={"center"}>
            <Heading color={"whitesmoke"}>Busca</Heading>
          </Flex>
          <Grid
            templateColumns={"repeat(4, 1fr)"}
            spacing={10}
            mt={20}
            columnGap={7}
          >
            <GridItem colSpan={{ base: 4, md: 3 }} mb={10}>
              <Box
                minH={{ base: "lg", md: "sm" }}
                bg="whitesmoke"
                borderTopRadius={"lg"}
              >
                {loading ? (
                  <Flex
                    minH="sm"
                    align={"center"}
                    justify={"center"}
                    direction={"column"}
                    gap={4}
                  >
                    <Image src="/utils/ash.gif" w="100px" />
                    <Text> Carregando... </Text>
                  </Flex>
                ) : (
                  characters?.map((player) => {
                    return (
                      <Flex
                        flexWrap={{ base: "wrap", md: "nowrap" }}
                        key={player.id}
                        justifyContent={"space-between"}
                        align={"center"}
                        p={4}
                        borderBottom={
                          characters.length > 1 ? "1px solid black" : null
                        }
                        gap={4}
                      >
                        <Heading
                          w="100%"
                          fontSize={"2xl"}
                          overflowX={"hidden"}
                          whiteSpace={"nowrap"}
                          overflowY={"hidden"}
                          textOverflow={"ellipsis"}
                          maxW="100%"
                          onClick={() => handleOpenPlayerModal(player)}
                          cursor={"pointer"}
                          _hover={{
                            color: "#19b9d9",
                            textDecoration: "underline",
                            textDecorationColor: "#19b9d9",
                          }}
                        >
                          {player.name}
                        </Heading>
                        <Box
                          w="60%"
                          overflowY={"hidden"}
                          display={{ base: "none", md: "block" }}
                        >
                          <Badge
                            borderRadius={"lg"}
                            px={3}
                            variant={"subtle"}
                            textAlign="center"
                            colorScheme={"blue"}
                          >
                            {"Mundo: " + player.world_id}
                          </Badge>
                        </Box>

                        <HStack
                          overflowY={"hidden"}
                          w={{ base: "fit-content", md: "100%" }}
                        >
                          <Text>Level:</Text>
                          <Badge
                            borderRadius={"lg"}
                            px={3}
                            w="fit-content"
                            background={"gray.300"}
                            color={"black"}
                          >
                            {player.level}
                          </Badge>
                        </HStack>
                        <HStack
                          overflowY={"hidden"}
                          w="100%"
                          display={{ base: "none", md: "block" }}
                        >
                          <Badge
                            borderRadius={"lg"}
                            px={3}
                            background={"gray.300"}
                            color={"black"}
                          >
                            Treinador Pokemon
                          </Badge>
                        </HStack>
                        <HStack
                          overflowY={"hidden"}
                          w="100%"
                          display={{ base: "none", md: "block" }}
                        >
                          <Text>Guild:</Text>
                          {player.guildnick ? (
                            <Badge
                              borderRadius={"lg"}
                              px={3}
                              background={"gray.300"}
                              color={"black"}
                            >
                              {player.guildnick}
                            </Badge>
                          ) : (
                            <Text> -- </Text>
                          )}
                        </HStack>
                      </Flex>
                    );
                  })
                )}
              </Box>
              <Flex
                borderBottomRadius={"lg"}
                bg="gray.400"
                gap={3}
                p={4}
                w={"full"}
                alignItems={"center"}
                justify={"end"}
              >
                <Text whiteSpace={"nowrap"} color={"whitesmoke"}>
                  Pagina: {page + 1} de {Math.ceil(count / perPage)}
                </Text>

                <Flex gap={2}>
                  <IconButton
                    icon={<ArrowLeftIcon />}
                    aria-label={""}
                    isDisabled={page === 0}
                    onClick={() => setPage((page) => page - 1)}
                  />
                  <IconButton
                    icon={<ArrowRightIcon />}
                    aria-label={""}
                    isDisabled={page + 1 === Math.ceil(count / perPage)}
                    onClick={() => setPage((page) => page + 1)}
                  />
                  <Select
                    bg="whitesmoke"
                    onChange={(e) => {
                      setPage(0);
                      setPerPage(Number(e.target.value));
                    }}
                    value={perPage}
                  >
                    <option value={8}>8</option>
                    <option value={16}>16</option>
                    <option value={32}>32</option>
                    <option value={64}>64</option>
                  </Select>
                </Flex>
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

export default MyAccount;

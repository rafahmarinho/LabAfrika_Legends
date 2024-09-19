import { AuthContext } from "@/context/AuthContext";
import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import {
  Box,
  Center,
  Container,
  Flex,
  Heading,
  IconButton,
  Image,
  Input,
  Stack,
  Text,
  Grid,
  GridItem,
  VStack,
  Badge,
  HStack,
  Select,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect } from "react";
import { TbShield } from "react-icons/tb";
import { TbWorld, TbSearch } from "react-icons/tb";
import { AiOutlineTrophy } from "react-icons/ai";
import { TbPokeball } from "react-icons/tb";
import { PlayerModal } from "@/components/PlayerModal";
import { GuildModal } from "@/components/GuildModal";

const Guilds = () => {
  const [loading, setLoading] = React.useState(false);
  const [topPlayers, setTopPlayers] = React.useState([]);
  const [playerModalOpen, setPlayerModalOpen] = React.useState(false);
  const [selectedPlayer, setSelectedPlayer] = React.useState({});
  const [selectedGuild, setSelectedGuild] = React.useState({});
  const [guildModalOpen, setGuildModalOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(0);
  const [perPage, setPerPage] = React.useState(8);
  const [guilds, setGuilds] = React.useState([]);
  const [count, setCount] = React.useState(0);
  const [lastCaught, setLastCaught] = React.useState({});

  const getData = () => {
    setLoading(true);
    axios
      .get(`/api/guild/list`, { params: { name: search, page, perPage } })
      .then((res) => {
        setGuilds(res.data.guilds);
        setCount(res.data.count);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const getTopLevel = () => {
    axios
      .get("/api/character/list-top-level")
      .then((res) => {
        setTopPlayers(res.data);
      })
      .catch((err) => console.log(err));
  };

  const getLastCaught = () => {
    axios
      .get("/api/character/get-last-caught")
      .then((res) => {
        setLastCaught(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getData();
  }, [search, page, perPage]);

  useEffect(() => {
    getTopLevel();
    getLastCaught();
  }, []);

  const handleOpenGuildModal = (guild) => {
    setGuildModalOpen(!guildModalOpen);
    setSelectedGuild(guild);
  };

  const handleOpenPlayerModal = (player) => {
    setPlayerModalOpen(!playerModalOpen);
    setSelectedPlayer(player);
  };

  return (
    <>
      <Box bg="gray.800">
        <GuildModal
          open={guildModalOpen}
          setOpen={setGuildModalOpen}
          selectedGuild={selectedGuild}
        />
        <Container maxW={"8xl"} minH={"calc(100vh - 100px)"}>
          <Flex pt={10} justify={"center"}>
            <Heading color={"whitesmoke"}>Guilds</Heading>
          </Flex>
          <Grid
            templateColumns={"repeat(4, 1fr)"}
            spacing={10}
            mt={20}
            columnGap={7}
          >
            <GridItem colSpan={{ base: 4, md: 3 }}>
              <Flex direction={"column"} gap={5}>
                <Box
                  bg="whitesmoke"
                  borderRadius={"md"}
                  borderBottomRadius={"none"}
                >
                  <Box borderTopRadius={"md"} w="full" bg="gray.400">
                    <Flex align="center" justify="center" gap={4} py={4}>
                      <TbShield fontSize={"20px"} color={"black"} />
                      <Heading fontSize={"xl"} color={"gray.900"}>
                        Guilds
                      </Heading>
                    </Flex>
                  </Box>
                  <Box w="full" p={4}>
                    <InputGroup>
                      <Input
                        maxW="50%"
                        onChange={(e) => {
                          setPage(0);
                          setPerPage(8);
                          setSearch(e.target.value);
                        }}
                        placeholder="Pesquisar..."
                      />
                      <InputLeftElement children={<TbSearch />} />
                    </InputGroup>
                  </Box>
                  <Flex
                    maxH="xl"
                    minH={{ base: "md", md: "sm" }}
                    overflowY={"auto"}
                    direction={"column"}
                    sx={{
                      "&::-webkit-scrollbar": {
                        width: "10px",
                      },
                      "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "gray.400",
                        borderRadius: "full",
                      },
                      "&::-webkit-scrollbar-track": {
                        borderRadius: "full",
                        backgroundColor: "gray.200",
                      },
                    }}
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
                      guilds.map((guild) => {
                        return (
                          <Flex
                            key={guild.id}
                            justifyContent={"space-between"}
                            align={"center"}
                            p={4}
                            borderBottom={"1px solid black"}
                            gap={4}
                          >
                            <Heading
                              cursor={"pointer"}
                              w="80%"
                              fontSize={{ base: "lg", md: "xl" }}
                              overflow={"hidden"}
                              whiteSpace={"nowrap"}
                              textOverflow={"ellipsis"}
                              maxW="100%"
                              onClick={() => handleOpenGuildModal(guild)}
                              _hover={{
                                color: "#19b9d9",
                                textDecoration: "underline",
                                textDecorationColor: "#19b9d9",
                              }}
                            >
                              {guild.name}
                            </Heading>

                            <Box
                              w="60%"
                              display={{ base: "none", md: "block" }}
                            >
                              <Badge
                                overflowY={"hidden"}
                                borderRadius={"lg"}
                                px={3}
                                variant={"subtle"}
                                textAlign="center"
                                colorScheme={"blue"}
                              >
                                {guild.world_id === 1 ? "Mundo 1" : "Mundo 2"}
                              </Badge>
                            </Box>

                            <HStack w="100%">
                              <Text>Líder:</Text>
                              <Text
                                overflow={"hidden"}
                                whiteSpace={"nowrap"}
                                textOverflow={"ellipsis"}
                                cursor={"pointer"}
                                _hover={{
                                  color: "#19b9d9",
                                  textDecoration: "underline",
                                  textDecorationColor: "#19b9d9",
                                }}
                                onClick={() =>
                                  handleOpenPlayerModal(guild.owner)
                                }
                                fontSize={"lg"}
                              >
                                {guild.owner.name}
                              </Text>
                            </HStack>
                          </Flex>
                        );
                      })
                    )}
                  </Flex>
                </Box>
              </Flex>
              <Flex
                borderBottomRadius={"lg"}
                bg="gray.400"
                gap={3}
                p={4}
                w={"full"}
                alignItems={"center"}
                justify={"end"}
                mb={6}
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
                    {topPlayers.map((player) => {
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
                    })}
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
                  <Center w="full" py={2} bg="whitesmoke">
                    <Flex direction={"row"} gap={2}>
                      <Text>Capturado por:</Text>
                      <Text
                        cursor={"pointer"}
                        onClick={() => handleOpenPlayerModal(lastCaught.player)}
                        _hover={{
                          color: "blue.500",
                          textDecoration: "underline",
                          textDecorationColor: "blue.500",
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
                </Stack>
              </Flex>
            </GridItem>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Guilds;

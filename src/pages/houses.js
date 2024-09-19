import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import {
  Box,
  Center,
  Container,
  Flex,
  FormControl,
  Heading,
  IconButton,
  Image,
  Input,
  Stack,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Grid,
  GridItem,
  VStack,
  Badge,
  Select,
  Spinner,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect } from "react";
import { TbWorld, TbSearch } from "react-icons/tb";
import { AiOutlineTrophy } from "react-icons/ai";
import { TbPokeball } from "react-icons/tb";
import { PlayerModal } from "@/components/PlayerModal";

const Houses = () => {
  const [search, setSearch] = React.useState("");
  const [houses, setHouses] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [loadingTopLvl, setLoadingTopLvl] = React.useState(false);
  const [loadingCaught, setLoadingCaught] = React.useState(false);
  const [topPlayers, setTopPlayers] = React.useState([]);
  const [playerModalOpen, setPlayerModalOpen] = React.useState(false);
  const [selectedPlayer, setSelectedPlayer] = React.useState({});
  const [lastCaught, setLastCaught] = React.useState({});
  const [page, setPage] = React.useState(0);
  const [perPage, setPerPage] = React.useState(8);
  const [count, setCount] = React.useState(0);
  const [town, setTown] = React.useState("");

  const getData = async () => {
    setLoading(true);
    await axios
      .get(`/api/admin/list-houses`, {
        params: { page, perPage, search, town },
      })
      .then((res) => {
        setHouses(res.data.houses);
        setCount(res.data.count);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const checkCity = (cityId) => {
    switch (cityId) {
      case 2:
        return "Pallet";
      case 3:
        return "Viridian";
      case 4:
        return "Pewter";
      case 5:
        return "Cerulean";
      case 6:
        return "Vermilion";
      case 7:
        return "Lavender";
      case 8:
        return "Celadon";
      case 9:
        return "Fuchsia";
      case 10:
        return "Saffron";
      case 11:
        return "Cinnabar";
      case 12:
        return "Seafoam Island";
    }
  };

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
    getData();
  }, [page, perPage, search, town]);

  useEffect(() => {
    getTopLevel();
    getLastCaught();
  }, []);

  const handleOpenPlayerModal = (player) => {
    setPlayerModalOpen(!playerModalOpen);
    setSelectedPlayer(player);
  };

  return (
    <>
      <Box bg="gray.800">
        <Container maxW={"8xl"} minH={"calc(100vh - 100px)"}>
          <Flex pt={10} justify={"center"}>
            <Heading color={"whitesmoke"}>Casas</Heading>
          </Flex>
          <Grid
            templateColumns={"repeat(4, 1fr)"}
            spacing={10}
            mt={20}
            columnGap={7}
          >
            <GridItem colSpan={{ base: 4, md: 3 }}>
              <Stack
                minH={"sm"}
                bg="whitesmoke"
                borderRadius={"lg"}
                borderBottomRadius={"none"}
                p={5}
                spacing={10}
              >
                <Flex gap={8}>
                  <FormControl>
                    <InputGroup>
                      <Input
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Pesquisar..."
                      />
                      <InputLeftElement children={<TbSearch />} />
                    </InputGroup>
                  </FormControl>
                  <Select
                    onChange={(e) => {
                      setTown(e.target.value);
                      setPage(0);
                      setPerPage(8);
                    }}
                  >
                    <option value={""}>Selecione uma cidade</option>
                    <option value={2}>Pallet</option>
                    <option value={3}>Viridian</option>
                    <option value={4}>Pewter</option>
                    <option value={5}>Cerulean</option>
                    <option value={6}>Vermilion</option>
                    <option value={7}>Lavender</option>
                    <option value={8}>Celadon</option>
                    <option value={9}>Fuchsia</option>
                    <option value={10}>Saffron</option>
                    <option value={11}>Cinnabar</option>
                    <option value={12}>Seafoam Island</option>
                  </Select>
                </Flex>

                <TableContainer>
                  <Table variant="striped">
                    <Thead>
                      <Tr bg="gray.800" borderTopRadius={"lg"}>
                        <Th color={"white"}>#</Th>
                        <Th color={"white"}>Casa</Th>
                        <Th color={"white"}>Dono</Th>
                        <Th color={"white"}>Cidade</Th>
                        <Th color={"white"}>Valor</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {houses.map((house) => {
                        return (
                          <Tr key={house.id}>
                            <Td>{house.id}</Td>
                            <Td>{house.name}</Td>
                            <Td>
                              {house.owner === 0 ? (
                                "Disponível"
                              ) : (
                                <Text
                                  onClick={() =>
                                    handleOpenPlayerModal(house.owner)
                                  }
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
                                  {house.owner.name}
                                </Text>
                              )}
                            </Td>
                            <Td>{checkCity(house.town)}</Td>
                            <Td>
                              ${" "}
                              {Number(house.price).toLocaleString({
                                style: "currency",
                                currency: "USD",
                              })}
                            </Td>
                          </Tr>
                        );
                      })}
                    </Tbody>
                  </Table>
                </TableContainer>
              </Stack>
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

export default Houses;

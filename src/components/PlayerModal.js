import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Text,
  Flex,
  ModalCloseButton,
  SimpleGrid,
  Image,
  Stack,
  Badge,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Divider,
  Skeleton,
  Center,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaClipboardUser } from "react-icons/fa6";
import { AiTwotoneExperiment } from "react-icons/ai";
import { TbWorld, TbShield, TbPencilPlus, TbLogin2 } from "react-icons/tb";

export const PlayerModal = ({ selectedPlayer, open, setOpen }) => {
  const { isOpen, onClose } = useDisclosure({
    isOpen: open,
    onClose() {
      setOpen(!open);
    },
  });
  const [team, setTeam] = useState([]);
  const [pokedex, setPokedex] = useState([]);
  const [loadingTeam, setLoadingTeam] = useState(false);
  const [loadingDex, setLoadingDex] = useState(false);

  const getTeam = () => {
    setLoadingTeam(true);
    axios
      .get(`/api/pokemon/get-team`, {
        params: { playerId: selectedPlayer.id },
      })
      .then((res) => {
        setTeam(res.data);
      })
      .catch((err) => {})
      .finally(() => {
        setLoadingTeam(false);
      });
  };

  const getPokedex = () => {
    setLoadingDex(true);
    axios
      .get(`/api/pokemon/get-pokedex`, {
        params: { playerId: selectedPlayer.id },
      })
      .then((res) => {
        setPokedex(res.data);
      })
      .catch((err) => {})
      .finally(() => {
        setLoadingDex(false);
      });
  };

  useEffect(() => {
    if (selectedPlayer && selectedPlayer.id && isOpen) {
      getTeam();
      getPokedex();
    }
  }, [selectedPlayer, isOpen]);

  const getColorByPokemonType = (type) => {
    const colors = {
      Normal: "#a8a878",
      Fighting: "#c03028",
      Flying: "#a890f0",
      Poison: "#a040a0",
      Ground: "#e0c068",
      Rock: "#b8a038",
      Bug: "#a8b820",
      Ghost: "#705898",
      Steel: "#b8b8d0",
      Stellar: "#7cc7b2",
      Fire: "#f08030",
      Water: "#6890f0",
      Grass: "#78c850",
      Electric: "#f8d030",
      Psychic: "#f85888",
      Ice: "#98d8d8",
      Dragon: "#7038f8",
      Dark: "#705848",
      Fairy: "#ee99ac",
    };

    return colors[type] || "#ffffff";
  };

  const adjustDate = (date) => {
    if (date?.split(",")[0] === "31/12/1969") {
      return "";
    }

    if (date) {
      return date?.split(",")[0];
    }
  };

  const checkValue = (value) => {
    switch (value) {
      case "1":
        return "0-0.png";

      case "2":
        return "1-0.png";

      case "3":
        return "0-1.png";

      case "4":
        return "1-0.png";

      case "5":
        return "0-1.png";

      case "6":
        return "1-1.png";

      case "7":
        return "1-1.png";
    }
  };

  return (
    <>
      <Modal isCentered isOpen={isOpen} onClose={onClose} size={"3xl"}>
        <ModalOverlay />
        <ModalContent bg="gray.800">
          <ModalHeader></ModalHeader>
          <ModalCloseButton color={"white"} />
          <ModalBody mt={2}>
            <Tabs isFitted>
              <TabList>
                <Tab bg="gray.300" borderTopLeftRadius={"lg"}>
                  Geral
                </Tab>
                <Tab bg="gray.300">Time</Tab>
                <Tab bg="gray.300" borderTopRightRadius={"lg"}>
                  Pokedex
                </Tab>
              </TabList>
              <TabPanels>
                <TabPanel minH="sm">
                  <Flex
                    w={{ base: "100%" }}
                    direction={"column"}
                    borderRadius={"lg"}
                    borderLeftRadius={{ base: "lg", md: "none" }}
                    bg="gray.300"
                    h="25rem"
                  >
                    <Flex
                      w="full"
                      align="center"
                      justify="space-between"
                      border="1px solid black"
                      flex={1}
                    >
                      <Flex
                        h="100%"
                        align={"center"}
                        gap={2}
                        w="17rem"
                        p={1}
                        pl={2}
                        borderRight={"1px solid black"}
                        bg="gray.400"
                      >
                        <FaClipboardUser fontSize={"20px"} />
                        <Text>Personagem:</Text>
                      </Flex>
                      <Flex
                        w="100%"
                        direction={"column"}
                        alignItems={"center"}
                        p={1}
                      >
                        <Text>{selectedPlayer?.name}</Text>
                      </Flex>
                    </Flex>

                    <Flex
                      w="full"
                      align="center"
                      justify="space-between"
                      border="1px solid black"
                      flex={1}
                    >
                      <Flex
                        h="100%"
                        align={"center"}
                        gap={2}
                        w="17rem"
                        p={1}
                        pl={2}
                        borderRight={"1px solid black"}
                        bg="gray.400"
                      >
                        <AiTwotoneExperiment fontSize={"20px"} />
                        <Text>Level:</Text>
                      </Flex>
                      <Flex
                        w="100%"
                        direction={"column"}
                        alignItems={"center"}
                        p={1}
                      >
                        <Text>{selectedPlayer?.level}</Text>
                      </Flex>
                    </Flex>

                    <Flex
                      w="full"
                      align="center"
                      justify="space-between"
                      border="1px solid black"
                      flex={1}
                    >
                      <Flex
                        h="100%"
                        align={"center"}
                        gap={2}
                        borderRight={"1px solid black"}
                        w="17rem"
                        p={1}
                        pl={2}
                        bg="gray.400"
                      >
                        <TbWorld fontSize={"20px"} />
                        <Text>Mundo:</Text>
                      </Flex>
                      <Flex
                        w="100%"
                        direction={"column"}
                        alignItems={"center"}
                        p={1}
                      >
                        <Text>
                          {selectedPlayer.world_id === 1
                            ? "Mundo 1"
                            : "Mundo 2"}
                        </Text>
                      </Flex>
                    </Flex>

                    <Flex
                      w="full"
                      align="center"
                      justify="space-between"
                      border="1px solid black"
                      flex={1}
                    >
                      <Flex
                        h="100%"
                        align={"center"}
                        gap={2}
                        borderRight={"1px solid black"}
                        w="17rem"
                        p={1}
                        pl={2}
                        bg="gray.400"
                      >
                        <TbShield fontSize={"20px"} />
                        <Text>Guild:</Text>
                      </Flex>
                      <Flex
                        w="100%"
                        direction={"column"}
                        alignItems={"center"}
                        p={1}
                      >
                        <Text>
                          {selectedPlayer.guildnick
                            ? selectedPlayer?.guildnick
                            : "--"}
                        </Text>
                      </Flex>
                    </Flex>

                    <Flex
                      w="full"
                      align="center"
                      justify="space-between"
                      border="1px solid black"
                      flex={1}
                    >
                      <Flex
                        h="100%"
                        align={"center"}
                        gap={2}
                        borderRight={"1px solid black"}
                        w="17rem"
                        p={1}
                        pl={2}
                        bg="gray.400"
                      >
                        <TbPencilPlus fontSize={"20px"} />
                        <Text>Criado em:</Text>
                      </Flex>
                      <Flex
                        w="100%"
                        direction={"column"}
                        alignItems={"center"}
                        p={1}
                      >
                        <Text>{adjustDate(selectedPlayer?.created)}</Text>
                      </Flex>
                    </Flex>

                    <Flex
                      w="full"
                      align="center"
                      justify="space-between"
                      border="1px solid black"
                      flex={1}
                    >
                      <Flex
                        h="100%"
                        align={"center"}
                        gap={2}
                        borderRight={"1px solid black"}
                        w="17rem"
                        p={1}
                        pl={2}
                        bg="gray.400"
                      >
                        <TbLogin2 fontSize={"20px"} />
                        <Text>Ultimo login:</Text>
                      </Flex>
                      <Flex
                        w="100%"
                        direction={"column"}
                        alignItems={"center"}
                        p={1}
                      >
                        <Text>{adjustDate(selectedPlayer?.lastlogin)}</Text>
                      </Flex>
                    </Flex>
                  </Flex>
                </TabPanel>
                <TabPanel minH="sm">
                  {loadingTeam ? (
                    <Flex
                      minH="sm"
                      color="white"
                      w="full"
                      align="center"
                      justify="center"
                      direction="column"
                      gap={4}
                    >
                      <Image src="/utils/ash.gif" w="100px" />
                      <Text>Carregando...</Text>
                    </Flex>
                  ) : (
                    <SimpleGrid columns={3} spacing={6} spacingY={10}>
                      {team.map((pokemon) => {
                        if (pokemon.isShiny === "S") {
                          return (
                            <Flex
                              direction={"column"}
                              align="center"
                              key={pokemon.wild_id}
                            >
                              <Text color="whitesmoke">{`Shiny ${pokemon.pokemon_name} `}</Text>
                              <Popover>
                                <PopoverTrigger>
                                  <Image
                                    cursor="pointer"
                                    minW="100px"
                                    src={
                                      process.env.IMAGE_SHINY_PATH +
                                      pokemon.pokemon_number +
                                      ".gif"
                                    }
                                  />
                                </PopoverTrigger>
                                <PopoverContent border="none" borderRadius="lg">
                                  <PopoverArrow />
                                  <PopoverCloseButton />
                                  <PopoverHeader
                                    bg="gray.400"
                                    border={"none"}
                                    borderTopRadius="lg"
                                  >
                                    {`Shiny ${pokemon.pokemon_name}`}
                                  </PopoverHeader>
                                  <Divider />
                                  <PopoverBody
                                    bg="gray.400"
                                    borderBottomRadius="lg"
                                  >
                                    <Stack>
                                      <Flex gap={2} align="center">
                                        <Text>Tipo:</Text>
                                        <Badge
                                          borderRadius={"lg"}
                                          px={3}
                                          bg={getColorByPokemonType(
                                            pokemon.type1
                                          )}
                                        >
                                          {pokemon.type1}
                                        </Badge>
                                        {pokemon.type2 ? (
                                          <Badge
                                            borderRadius={"lg"}
                                            px={3}
                                            bg={getColorByPokemonType(
                                              pokemon.type2
                                            )}
                                          >
                                            {pokemon.type2}
                                          </Badge>
                                        ) : null}
                                      </Flex>

                                      <Flex gap={2}>
                                        <Text>Nivel:</Text>
                                        <Text>{pokemon.details.lvl}</Text>
                                      </Flex>
                                      <Flex gap={2}>
                                        <Text>Boost:</Text>
                                        <Text>{pokemon.details.boost}</Text>
                                      </Flex>
                                      <Flex gap={2}>
                                        <Text>Nature:</Text>
                                        <Text>{pokemon.details.nature}</Text>
                                      </Flex>
                                      <Flex gap={2}>
                                        <Text>Habilidade Especial:</Text>
                                        <Text>
                                          {pokemon.details.specialAbility}
                                        </Text>
                                      </Flex>
                                      <Flex gap={2} direction={"column"}>
                                        <Text>Valores Individuais (IV):</Text>
                                        <SimpleGrid columns={2}>
                                          <Flex
                                            direction={"column"}
                                            align={"center"}
                                          >
                                            <Text>
                                              Hp: {pokemon.details.Hp}
                                            </Text>
                                            <Text>
                                              Def: {pokemon.details.Def}
                                            </Text>
                                            <Text>
                                              SpDef: {pokemon.details.SpDef}
                                            </Text>
                                          </Flex>
                                          <Flex
                                            direction={"column"}
                                            align={"center"}
                                          >
                                            <Text>
                                              Atk: {pokemon.details.Atk}
                                            </Text>
                                            <Text>
                                              SpAtk: {pokemon.details.SpAtk}
                                            </Text>
                                            <Text>
                                              Speed: {pokemon.details.Speed}
                                            </Text>
                                          </Flex>
                                        </SimpleGrid>
                                      </Flex>
                                    </Stack>
                                  </PopoverBody>
                                </PopoverContent>
                              </Popover>
                            </Flex>
                          );
                        } else {
                          return (
                            <Flex
                              direction={"column"}
                              align="center"
                              key={pokemon.wild_id}
                            >
                              <Text color="whitesmoke">
                                {pokemon.pokemon_name}{" "}
                              </Text>
                              <Popover>
                                <PopoverTrigger>
                                  <Image
                                    cursor="pointer"
                                    minW="100px"
                                    src={
                                      process.env.IMAGE_POKEMON_PATH +
                                      pokemon.pokemon_number +
                                      ".gif"
                                    }
                                  />
                                </PopoverTrigger>
                                <PopoverContent border="none" borderRadius="lg">
                                  <PopoverArrow />
                                  <PopoverCloseButton />
                                  <PopoverHeader
                                    bg="gray.400"
                                    border={"none"}
                                    borderTopRadius="lg"
                                  >
                                    {pokemon.pokemon_name}
                                  </PopoverHeader>
                                  <Divider />
                                  <PopoverBody
                                    bg="gray.400"
                                    borderBottomRadius="lg"
                                  >
                                    <Stack>
                                      <Flex gap={2} align="center">
                                        <Text>Tipo:</Text>
                                        <Badge
                                          borderRadius={"lg"}
                                          px={3}
                                          bg={getColorByPokemonType(
                                            pokemon.type1
                                          )}
                                        >
                                          {pokemon.type1}
                                        </Badge>
                                        {pokemon.type2 ? (
                                          <Badge
                                            borderRadius={"lg"}
                                            px={3}
                                            bg={getColorByPokemonType(
                                              pokemon.type2
                                            )}
                                          >
                                            {pokemon.type2}
                                          </Badge>
                                        ) : null}
                                      </Flex>

                                      <Flex gap={2}>
                                        <Text>Nivel:</Text>
                                        <Text>{pokemon.details.lvl}</Text>
                                      </Flex>
                                      <Flex gap={2}>
                                        <Text>Boost:</Text>
                                        <Text>{pokemon.details.boost}</Text>
                                      </Flex>
                                      <Flex gap={2}>
                                        <Text>Nature:</Text>
                                        <Text>{pokemon.details.nature}</Text>
                                      </Flex>
                                      <Flex gap={2}>
                                        <Text>Habilidade Especial:</Text>
                                        <Text>
                                          {pokemon.details.specialAbility}
                                        </Text>
                                      </Flex>
                                      <Flex gap={2} direction={"column"}>
                                        <Text>Valores Individuais (IV):</Text>
                                        <SimpleGrid columns={2}>
                                          <Flex
                                            direction={"column"}
                                            align={"center"}
                                          >
                                            <Text>
                                              Hp: {pokemon.details.Hp}
                                            </Text>
                                            <Text>
                                              Def: {pokemon.details.Def}
                                            </Text>
                                            <Text>
                                              SpDef: {pokemon.details.SpDef}
                                            </Text>
                                          </Flex>
                                          <Flex
                                            direction={"column"}
                                            align={"center"}
                                          >
                                            <Text>
                                              Atk: {pokemon.details.Atk}
                                            </Text>
                                            <Text>
                                              SpAtk: {pokemon.details.SpAtk}
                                            </Text>
                                            <Text>
                                              Speed: {pokemon.details.Speed}
                                            </Text>
                                          </Flex>
                                        </SimpleGrid>
                                      </Flex>
                                    </Stack>
                                  </PopoverBody>
                                </PopoverContent>
                              </Popover>
                            </Flex>
                          );
                        }
                      })}
                    </SimpleGrid>
                  )}
                </TabPanel>
                <TabPanel minH="sm">
                  {loadingDex ? (
                    <Flex
                      minH="sm"
                      color="white"
                      w="full"
                      align="center"
                      justify="center"
                      direction="column"
                      gap={4}
                    >
                      <Image src="/utils/ash.gif" w="100px" />
                      <Text>Carregando...</Text>
                    </Flex>
                  ) : (
                    <SimpleGrid
                      columns={{ base: 2, md: 3 }}
                      spacing={4}
                      maxH={"md"}
                      overflow={"auto"}
                      sx={{
                        "&::-webkit-scrollbar": {
                          width: "10px",
                        },
                        "&::-webkit-scrollbar-thumb": {
                          backgroundColor: "gray.400",
                          borderRadius: "full",
                        },
                        "&::-webkit-scrollbar-track": {
                          backgroundColor: "gray.200",
                          borderRadius: "full",
                        },
                      }}
                      p={2}
                    >
                      {pokedex.map((item) => {
                        return (
                          <Flex
                            direction={"column"}
                            align={"center"}
                            key={item.id}
                            mb={4}
                            bg="whitesmoke"
                            borderRadius={"lg"}
                            gap={4}
                            py={2}
                          >
                            <Flex direction={"column"} align={"center"}>
                              <Text>{item.dexNumber}</Text>
                              <Text>{item.name}</Text>
                            </Flex>

                            <Flex gap={{ base: 0, md: 3 }} align={"center"}>
                              <Image
                                w={"100px"}
                                src={
                                  process.env.IMAGE_POKEMON_PATH +
                                  item.wild_id +
                                  ".gif"
                                }
                              />
                              <Image
                                h={"28px"}
                                w={"15px"}
                                src={`/utils/${checkValue(item.storageValue)}`}
                              />
                            </Flex>
                          </Flex>
                        );
                      })}
                    </SimpleGrid>
                  )}
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

import { ConfirmModal } from "@/components/ConfirmModal";
import { AuthContext } from "@/context/AuthContext";
import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Image,
  Input,
  Stack,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useToast,
  Tooltip,
  useDisclosure,
  Grid,
  GridItem,
  VStack,
  Badge,
  HStack,
  Textarea,
  Spinner,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useRef, useState } from "react";
import { IoDiamondOutline } from "react-icons/io5";
import { TbShieldPlus, TbShield, TbEdit, TbPokeball } from "react-icons/tb";
import { IoTicketOutline } from "react-icons/io5";
import { TbWorld, TbLinkOff } from "react-icons/tb";
import { AiOutlineTrophy } from "react-icons/ai";
import { Select as ReactSelect } from "chakra-react-select";
import { PlayerModal } from "@/components/PlayerModal";
import { GuildModal } from "@/components/GuildModal";
import { GrStatusCriticalSmall } from "react-icons/gr";
import { RiDeleteBin7Line, RiCoinsLine } from "react-icons/ri";
import Cookies from "js-cookie";

function NewGuildModal({ open, setOpen }) {
  const { isOpen, onClose } = useDisclosure({
    isOpen: open,
    onClose() {
      setOpen(!open);
    },
  });
  const [guildOwner, setGuildOwner] = React.useState("");
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [worldId, setWorldId] = React.useState("");
  const { currentUser } = useContext(AuthContext);
  const [characters, setCharacters] = React.useState([]);
  const toast = useToast();
  let arrOptions = [];
  const getCharacterData = () => {
    axios
      .get(`/api/character/list-character-new-guild`, {
        params: { userId: currentUser?.id },
      })
      .then((res) => {
        setCharacters(res.data);
      })
      .catch((err) => {});
  };

  useEffect(() => {
    characters.forEach((character) => {
      arrOptions.push({
        label: character.name,
        value: character.id,
        world_id: character.world_id,
      });
    });
  }, [characters, arrOptions]);

  const handleNewGuild = () => {
    axios
      .post("/api/guild/create-guild", {
        name,
        description,
        worldId: Number(worldId),
        guildOwner: Number(guildOwner),
      })
      .then((res) => {
        toast({
          title: "Guild criada com sucesso",
          status: "success",
          position: "top-right",
          duration: 9000,
          isClosable: true,
        });
        onClose();
      })
      .catch((err) => {
        toast({
          title: err.response.data ? err.response.data : "Erro ao criar guild",
          status: "error",
          position: "top-right",
          duration: 9000,
          isClosable: true,
        });
        onClose();
      });
  };

  useEffect(() => {
    if (currentUser) {
      getCharacterData();
    }
  }, [currentUser]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Nova Guild</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex direction={"column"} gap={4}>
              <Center>
                <Text as="i">Necessário um personagem level 50 ou mais</Text>
              </Center>
              <Stack spacing={4}>
                <ReactSelect
                  placeholder="Selecione o dono"
                  onChange={(e) => {
                    setGuildOwner(e.value);
                    setWorldId(e.world_id);
                  }}
                  focusBorderColor="#19b9d9"
                  options={arrOptions}
                ></ReactSelect>
                <FormControl isDisabled={!guildOwner}>
                  <FormLabel>Nome da Guild</FormLabel>
                  <Input
                    onChange={(e) => setName(e.target.value)}
                    focusBorderColor="#19b9d9"
                  />
                </FormControl>
                <FormControl isDisabled={!guildOwner}>
                  <FormLabel>Descrição</FormLabel>
                  <Textarea
                    maxLength={250}
                    resize={"none"}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </FormControl>
              </Stack>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              isDisabled={!guildOwner || !name}
              onClick={handleNewGuild}
            >
              Adicionar
            </Button>
            <Button onClick={onClose}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

function EditModal({ open, setOpen, selectedGuild }) {
  const { isOpen, onClose } = useDisclosure({
    isOpen: open,
    onClose() {
      setOpen(!open);
      setFile(null);
      setName("");
      setDescription("");
      setNewFile(false);
    },
  });
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [newFile, setNewFile] = useState(false);
  const [image, setImage] = useState("");
  const [members, setMembers] = React.useState([]);
  const [rankMembers, setRankMembers] = React.useState([]);
  const inputFile = useRef(null);
  const toast = useToast();

  useEffect(() => {
    if (selectedGuild) {
      setName(selectedGuild.name);
      setDescription(selectedGuild.motd);
      setImage(selectedGuild.link ? selectedGuild.link : "404.png");
      setFile(selectedGuild.link);
    } else {
      setName("");
      setDescription("");
      setImage("404.png");
      setFile(null);
    }
  }, [selectedGuild]);

  const handleUpdate = async () => {
    try {
      if (!newFile) {
        await updateGuildData();
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      const guildId = Number(selectedGuild.id);

      const imageUrl = `${process.env.IMAGE_PATH}/api/images/insert/${guildId}`;

      const jwtToken = Cookies.get("token");

      await axios.put(imageUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (name || description) {
        await updateGuildData();
      }

      toast({
        title: "Imagem editada com sucesso!",
        status: "success",
        position: "top-right",
        duration: 9000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        title: "Erro ao editar imagem",
        status: "error",
        position: "top-right",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const updateGuildData = async () => {
    const guildData = {
      guildId: selectedGuild.id,
      name: name,
      description: description,
    };

    await axios
      .put("/api/guild/update-guild", guildData)
      .then((res) => {
        toast({
          title: "Guild editada com sucesso!",
          status: "success",
          position: "top-right",
          duration: 9000,
          isClosable: true,
        });
      })
      .catch((err) => {
        toast({
          title: err.response.data ? err.response.data : "Erro ao editar guild",
          status: "error",
          position: "top-right",
          duration: 9000,
          isClosable: true,
        });
      })
      .finally(() => {
        onClose();
      });
  };

  const handleChange = (event) => {
    event.preventDefault();
    const file = event.target.files[0];

    if (file) {
      const fileSizeKB = file.size / 1024;
      const maxFileSizeKB = 500;
      if (fileSizeKB > maxFileSizeKB) {
        toast({
          description: "A imagem não pode ser superior a 500kb.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      } else {
        setFile(file);
        setNewFile(true);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImage(reader.result);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  useEffect(() => {
    if (selectedGuild && selectedGuild.id) {
      axios
        .get("/api/guild/list-members", {
          params: { guildId: selectedGuild.id },
        })
        .then((res) => {
          setMembers(res.data.allMembers);
          setRankMembers(res.data.rankMembers);
        })
        .catch((err) => console.log(err));
    }
  }, [selectedGuild, isOpen]);

  const checkRank = (guidLevel) => {
    if (guidLevel === "Leader") {
      return "Líder";
    } else if (guidLevel === "Vice-Leader") {
      return "Vice-Lider";
    } else {
      return "Membro";
    }
  };

  const handleRemoveMember = (playerId, guildName) => {
    axios
      .put("/api/guild/remove-member", {
        playerId: playerId,
        guildName: guildName,
      })
      .then((res) => {
        toast({
          title: "Membro removido com sucesso",
          status: "success",
          position: "top-right",
          duration: 9000,
          isClosable: true,
        });
        onClose();
      })
      .catch((err) => {
        toast({
          title: err.response.data
            ? err.response.data
            : "Erro ao remover membro",
          status: "error",
          position: "top-right",
          duration: 9000,
          isClosable: true,
        });
        onClose();
      });
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered size={"2xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedGuild.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Tabs isFitted>
              <TabList>
                <Tab bg="gray.300" borderTopLeftRadius={"lg"}>
                  Dados da guild
                </Tab>
                <Tab bg="gray.300" borderTopRightRadius={"lg"}>
                  Membros
                </Tab>
              </TabList>

              <TabPanels>
                <TabPanel minH="sm">
                  <VStack w="100%" spacing={{ base: 4, md: 8 }}>
                    <FormControl>
                      <FormLabel>Nome da Guild</FormLabel>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Descrição</FormLabel>
                      <Textarea
                        value={description}
                        maxLength={250}
                        resize={"none"}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </FormControl>
                  </VStack>
                  <FormControl>
                    <FormLabel>Imagem</FormLabel>
                    <Flex direction={"column"}>
                      <Center p={4}>
                        <Image maxW="300px" src={image} borderRadius={"lg"} />
                      </Center>

                      <Button
                        w="full"
                        onClick={() => inputFile.current.click()}
                      >
                        Escolher imagem
                      </Button>
                    </Flex>
                    <Input
                      ref={inputFile}
                      type="file"
                      display={"none"}
                      onChange={handleChange}
                      accept="image/jpeg, image/png, image/gif"
                    />
                  </FormControl>
                </TabPanel>

                <TabPanel minH="sm">
                  <Flex
                    bg="whitesmoke"
                    direction={"column"}
                    p={2}
                    gap={4}
                    borderRadius={"lg"}
                    maxH={"sm"}
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
                  >
                    {members.map((member) => {
                      return (
                        <Flex
                          flexWrap={{ base: "wrap", md: "nowrap" }}
                          p={4}
                          key={member.id}
                          justifyContent={"space-between"}
                          align={"center"}
                          borderRadius={"lg"}
                          bg="gray.200"
                        >
                          <Text w="100%" fontSize={"lg"} overflowY={"hidden"}>
                            {member.name}
                          </Text>
                          <Flex
                            gap={2}
                            w={{ base: "30%", md: "100%" }}
                            overflowY={"hidden"}
                          >
                            <Text>Level:</Text>
                            <Text>{member.level}</Text>
                          </Flex>
                          <Box
                            w={{ base: "30%", md: "100%" }}
                            overflowY={"hidden"}
                          >
                            <Badge borderRadius={"lg"} px={3}>
                              {checkRank(member.guild_level)}
                            </Badge>
                          </Box>

                          <Box
                            w={{ base: "10%", md: "100%" }}
                            overflowY={"hidden"}
                          >
                            <GrStatusCriticalSmall
                              color={member.online > 0 ? "green" : "red"}
                            />
                          </Box>
                          <Box>
                            <Popover placement="left">
                              <PopoverTrigger>
                                <IconButton
                                  alignSelf={"end"}
                                  icon={<TbLinkOff fontSize="15px" />}
                                />
                              </PopoverTrigger>
                              <PopoverContent>
                                <PopoverArrow />
                                <PopoverCloseButton />
                                <PopoverHeader>
                                  <Center>Deseja remover este membro?</Center>
                                </PopoverHeader>
                                <PopoverBody>
                                  <Stack spacing={4}>
                                    <Flex
                                      direction={"column"}
                                      gap={2}
                                      align={"center"}
                                    >
                                      <Text as={"i"} fontSize={"14px"}>
                                        Essa operação não pode ser desfeita!
                                      </Text>
                                      <Text as={"i"} fontSize={"14px"}>
                                        Caso remova o líder, a guild será
                                        apagada!
                                      </Text>
                                    </Flex>
                                    <Button
                                      w="full"
                                      colorScheme={"blue"}
                                      onClick={() =>
                                        handleRemoveMember(
                                          member.id,
                                          selectedGuild.name
                                        )
                                      }
                                    >
                                      Remover
                                    </Button>
                                  </Stack>
                                </PopoverBody>
                              </PopoverContent>
                            </Popover>
                          </Box>
                        </Flex>
                      );
                    })}
                  </Flex>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleUpdate}>
              Salvar
            </Button>
            <Button onClick={onClose}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
const MyGuilds = () => {
  const { currentUser } = React.useContext(AuthContext);
  const toast = useToast();
  const [loading, setLoading] = React.useState(false);
  const [topPlayers, setTopPlayers] = React.useState([]);
  const [playerModalOpen, setPlayerModalOpen] = React.useState(false);
  const [selectedPlayer, setSelectedPlayer] = React.useState({});
  const [selectedGuild, setSelectedGuild] = React.useState({});
  const [newGuildModalOpen, setNewGuildModalOpen] = React.useState(false);
  const [guildModalOpen, setGuildModalOpen] = React.useState(false);
  const [guilds, setGuilds] = React.useState([]);
  const [lastCaught, setLastCaught] = React.useState({});
  const [loadingTopLvl, setLoadingTopLvl] = React.useState(false);
  const [loadingCaught, setLoadingCaught] = React.useState(false);
  const [editGuildModalOpen, setEditGuildModalOpen] = React.useState(false);
  const router = useRouter();
  const getData = () => {
    setLoading(true);
    axios
      .get(`/api/guild/list-guild-by-account`, {
        params: { userId: currentUser.id },
      })
      .then((res) => {
        setGuilds(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
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
    if (currentUser) {
      getData();
    }
  }, [currentUser, editGuildModalOpen, newGuildModalOpen]);

  useEffect(() => {
    getTopLevel();
    getLastCaught();
  }, []);

  const handleOpenNewGuildModal = () => {
    setNewGuildModalOpen(!newGuildModalOpen);
  };

  const handleOpenGuildModal = (guild) => {
    setGuildModalOpen(!guildModalOpen);
    setSelectedGuild(guild);
  };

  const handleOpenPlayerModal = (player) => {
    setPlayerModalOpen(!playerModalOpen);
    setSelectedPlayer(player);
  };

  const handleOpenEditGuild = (guild) => {
    setEditGuildModalOpen(!editGuildModalOpen);
    setSelectedGuild(guild);
  };

  const handleDeleteGuild = (guildId) => {
    axios
      .delete(`/api/guild/remove-guild`, { params: { guildId: guildId } })
      .then((res) => {
        toast({
          title: "Guild apagada com sucesso!",
          status: "success",
          position: "top-right",
          duration: 9000,
          isClosable: true,
        });
        getData();
      })
      .catch((err) => {
        toast({
          title: err?.response?.data
            ? err?.response?.data
            : "Erro ao apagar guild",
          status: "error",
          position: "top-right",
          duration: 9000,
          isClosable: true,
        });
      });
  };

  return (
    <>
      <Box bg="gray.800">
        <GuildModal
          open={guildModalOpen}
          setOpen={setGuildModalOpen}
          selectedGuild={selectedGuild}
        />
        <EditModal
          open={editGuildModalOpen}
          setOpen={setEditGuildModalOpen}
          selectedGuild={selectedGuild}
        />
        <Container maxW={"8xl"} minH={"calc(100vh - 100px)"}>
          <Flex pt={10} justify={"center"}>
            <Heading color={"whitesmoke"}>Minhas Guilds</Heading>
          </Flex>
          <Grid
            templateColumns={"repeat(4, 1fr)"}
            spacing={10}
            mt={20}
            columnGap={7}
          >
            <GridItem colSpan={{ base: 4, md: 3 }}>
              <Flex direction={"column"} gap={5}>
                <Stack bg={"whitesmoke"} borderRadius={"md"}>
                  <Flex
                    borderTopRadius={"md"}
                    py={2}
                    bg="gray.400"
                    color="whitesmoke"
                    align={"center"}
                    justify="center"
                    gap={2}
                  >
                    <RiCoinsLine fontSize={"20px"} color={"black"} />
                    <Text color={"gray.900"}>Doe e ajude nosso servidor!</Text>
                  </Flex>
                  <HStack py={2} px={4} spacing={2}>
                    <NewGuildModal
                      open={newGuildModalOpen}
                      setOpen={setNewGuildModalOpen}
                    />

                    <Button
                      bg="gray.400"
                      w="full"
                      leftIcon={<TbShieldPlus fontSize={"20px"} />}
                      justifyItems={"start"}
                      _hover={{ background: "gray.500" }}
                      onClick={() => handleOpenNewGuildModal()}
                    >
                      Criar Guild
                    </Button>

                    <Button
                      bg="gray.400"
                      w="full"
                      leftIcon={<IoTicketOutline fontSize={"20px"} />}
                      _hover={{ background: "gray.500" }}
                      onClick={() => router.push("/my-tickets")}
                    >
                      Meus Tickets
                    </Button>
                  </HStack>
                </Stack>

                <Box bg="whitesmoke" borderRadius={"md"} mb={6}>
                  <Box borderTopRadius={"md"} w="full" bg="gray.400">
                    <Flex align="center" justify="center" gap={4} py={4}>
                      <TbShield fontSize={"20px"} color={"black"} />
                      <Heading fontSize={"xl"} color={"gray.900"}>
                        Guilds
                      </Heading>
                    </Flex>
                  </Box>
                  <Flex
                    minH={{ base: "md", md: "sm" }}
                    maxH="xl"
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
                        backgroundColor: "gray.200",
                        borderRadius: "full",
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
                      guilds?.map((guild) => {
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
                              w="100%"
                              fontSize={"2xl"}
                              overflowY={"hidden"}
                              overflowX={{ base: "none", md: "hidden" }}
                              whiteSpace={"nowrap"}
                              textOverflow={"ellipsis"}
                              maxW="100%"
                              onClick={() => handleOpenGuildModal(guild)}
                              _hover={{
                                color: "blue.500",
                                textDecoration: "underline",
                                textDecorationColor: "blue.500",
                              }}
                            >
                              {guild.name}
                            </Heading>

                            <Box
                              overflowY={"hidden"}
                              w="60%"
                              display={{ base: "none", md: "initial" }}
                            >
                              <Badge
                                borderRadius={"lg"}
                                px={3}
                                variant={"subtle"}
                                textAlign="center"
                                colorScheme={"blue"}
                              >
                                {guild.world_id === 1 ? "Mundo 1" : "Mundo 2"}
                              </Badge>
                            </Box>

                            <Flex
                              overflowY={"hidden"}
                              w="100%"
                              align={"center"}
                              gap={2}
                              display={{ base: "none", md: "flex" }}
                            >
                              <Text>Líder:</Text>
                              <Text fontSize={"xl"}>{guild.owner}</Text>
                            </Flex>

                            <Tooltip label="Editar">
                              <IconButton
                                onClick={() => handleOpenEditGuild(guild)}
                                colorScheme="yellow"
                                icon={<TbEdit fontSize="20px" />}
                              />
                            </Tooltip>
                            <ConfirmModal
                              title={"Deseja realmente apagar sua guild?"}
                              onConfirm={() => handleDeleteGuild(guild.id)}
                            >
                              <Tooltip label="Apagar guild">
                                <IconButton
                                  w="100%"
                                  colorScheme="red"
                                  variant={"solid"}
                                  icon={<RiDeleteBin7Line fontSize={"20px"} />}
                                  aria-label={""}
                                />
                              </Tooltip>
                            </ConfirmModal>
                          </Flex>
                        );
                      })
                    )}
                  </Flex>
                </Box>
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

export default MyGuilds;

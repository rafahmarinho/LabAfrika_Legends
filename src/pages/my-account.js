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
  Select,
  Textarea,
  Spinner,
  SimpleGrid,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { RiDeleteBin7Line } from "react-icons/ri";
import { FaRegUser } from "react-icons/fa";
import { IoDiamondOutline } from "react-icons/io5";
import { MdGroupAdd } from "react-icons/md";
import { TbShieldPlus, TbWorld, TbBrandTwitch } from "react-icons/tb";
import { AiOutlineTrophy } from "react-icons/ai";
import { TbPokeball, TbKey, TbLock } from "react-icons/tb";
import { Select as ReactSelect } from "chakra-react-select";
import { PlayerModal } from "@/components/PlayerModal";
import { ChangePasswordModal } from "@/components/ChangePasswordModal";
import { RecoveryKeyModal } from "@/components/RecoveryKeyModal";
import { DonationModal } from "@/components/DonationModal";
import { CopyIcon } from "@chakra-ui/icons";
import { RiCoinsLine } from "react-icons/ri";

const TwoFactorAuthModal = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [twoFactorAuth, setTwoFactorAuth] = React.useState(null);
  const toast = useToast();
  const router = useRouter();

  const handleUpdateTFAuth = () => {
    axios
      .put(`/api/account/update-two-factor-auth`, {
        userId: currentUser?.id,
        password,
        confirmPassword,
        twoFactorAuth: twoFactorAuth,
      })
      .then((res) => {
        toast({
          title: "Autenticação em dois fatores alterada com sucesso",
          status: "success",
          position: "top-right",
          duration: 9000,
          isClosable: true,
        });
        onClose();
        router.reload();
      })
      .catch((err) => {
        toast({
          title:
            err?.response.data ||
            "Erro na atualização da autenticação em dois fatores",
          status: "error",
          position: "top-right",
          duration: 9000,
          isClosable: true,
        });
      });
  };

  useEffect(() => {
    if (currentUser?.twoFactorAuth === 0) {
      setTwoFactorAuth(1);
    } else if (currentUser?.twoFactorAuth === 1) {
      setTwoFactorAuth(0);
    }
  }, [currentUser]);

  return (
    <>
      <Box onClick={onOpen}>{children}</Box>
      <Modal isCentered isOpen={isOpen} onClose={onClose} size={"xl"}>
        <ModalOverlay />

        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>
            <Center fontSize={"lg"}>
              <Heading size={"md"}>
                {currentUser?.twoFactorAuth === 0
                  ? "Ativar autenticação em dois fatores"
                  : "Desativar autenticação em dois fatores"}
              </Heading>
            </Center>
          </ModalHeader>
          <ModalBody>
            <Stack>
              <FormControl>
                <FormLabel>Senha</FormLabel>
                <Input
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Confirme a senha</FormLabel>
                <Input
                  type="password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Stack w="full" spacing={4}>
              <Button
                w="full"
                onClick={handleUpdateTFAuth}
                colorScheme={"blue"}
              >
                Enviar
              </Button>
              <Stack>
                <Stack align={"center"}>
                  <Heading size="sm" color={"red"}>
                    Atenção!
                  </Heading>
                  <Text fontSize="14px" textAlign={"center"}>
                    o e-mail cadastrado que receberá o código será:
                  </Text>
                  <Text fontSize="14px">{currentUser?.email}</Text>
                </Stack>
              </Stack>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

const TwitchModal = ({ children, characters }) => {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [login, setLogin] = React.useState("");
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState([]);
  const [characterToStream, setCharacterToStream] = useState("");
  const toast = useToast();

  useEffect(() => {
    var arr = [];
    characters.forEach((character) => {
      arr.push({
        label: character.name,
        value: character.name,
      });
    });
    setValues(arr);
  }, [characters]);

  const handleCreateTwitchId = () => {
    setLoading(true);
    axios
      .post("/api/twitch/create-twitch-id", {
        twitchLogin: login,
        userId: currentUser?.id,
        characterToStream: characterToStream,
      })
      .then((res) => {
        setLoading(false);
        setCurrentUser({
          ...currentUser,
          twitchLogin: res.data.twitchLogin,
          characterToStream: res.data.characterToStream,
        });
        toast({
          title: "ID do Twitch vinculado com sucesso",
          status: "success",
          position: "top-right",
          duration: 9000,
          isClosable: true,
        });
        onClose();
      })
      .catch((err) => {
        setLoading(false);
        toast({
          title: err.response.data
            ? err.response.data.split(":")[1]
            : "Erro ao vincular ID do Twitch",
          status: "error",
          position: "top-right",
          duration: 9000,
          isClosable: true,
        });
        onClose();
      });
  };

  useEffect(() => {
    if (currentUser && currentUser.twitchLogin) {
      setLogin(currentUser.twitchLogin);
      setCharacterToStream({
        value: currentUser.characterToStream,
        label: currentUser.characterToStream,
      });
    }
  }, [currentUser, isOpen]);

  return (
    <>
      <Box onClick={onOpen} w="100%">
        {children}
      </Box>
      <Modal isCentered isOpen={isOpen} onClose={onClose} size={"xl"}>
        <ModalOverlay />

        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>
            <Center fontSize={"lg"}>Digite seu login da Twitch</Center>
            <Center fontSize={"sm"}>
              <Text as="i">Deve ser exatamente igual da plataforma</Text>
            </Center>
          </ModalHeader>
          <ModalBody>
            <Stack spacing={4}>
              <FormControl>
                <FormLabel>Login Twitch</FormLabel>
                <Input
                  type="text"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Personagem para streams</FormLabel>
                <ReactSelect
                  placeholder="Selecione o dono"
                  onChange={setCharacterToStream}
                  value={characterToStream}
                  focusBorderColor="#19b9d9"
                  options={values}
                ></ReactSelect>
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button
              w="full"
              onClick={handleCreateTwitchId}
              colorScheme={"blue"}
              isLoading={loading}
            >
              Enviar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

const MyAccount = () => {
  const { currentUser } = React.useContext(AuthContext);
  const toast = useToast();
  const [characters, setCharacters] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [loadingTopLvl, setLoadingTopLvl] = React.useState(false);
  const [loadingCaught, setLoadingCaught] = React.useState(false);
  const [topPlayers, setTopPlayers] = React.useState([]);
  const [playerModalOpen, setPlayerModalOpen] = React.useState(false);
  const [selectedPlayer, setSelectedPlayer] = React.useState({});
  const [guildModalOpen, setGuildModalOpen] = React.useState(false);
  const [lastCaught, setLastCaught] = React.useState({});
  const [donates, setDonates] = React.useState([]);

  const handleCopyRef = (text) => {
    navigator.clipboard.writeText(text);
  };

  const getData = async () => {
    setLoading(true);
    await axios
      .get(`/api/character/list`, { params: { userId: currentUser?.id } })
      .then((res) => {
        setCharacters(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const getDonates = async () => {
    await axios
      .get(`/api/pagbank/list-donations-by-user`, {
        params: { userId: currentUser.id },
      })
      .then((res) => {
        setDonates(res.data);
      })
      .catch((err) => {});
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
      getDonates();
    }
  }, [currentUser, playerModalOpen]);

  useEffect(() => {
    getTopLevel();
    getLastCaught();
  }, []);

  const handleDelete = (id) => {
    axios
      .put("/api/character/delete", { playerId: id })
      .then(() => {
        toast({
          title: "Personagem apagado com sucesso",
          status: "success",
          position: "top-right",
          duration: 9000,
          isClosable: true,
        });
        getData();
      })
      .catch((err) => {
        toast({
          title: err.response.data
            ? err.response.data
            : "Erro ao apagar personagem",
          status: "warning",
          position: "top-right",
          duration: 9000,
          isClosable: true,
        });
      });
  };

  function NewCharacterModal() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [gender, setGender] = React.useState("");
    const [name, setName] = React.useState("");

    const handleNewCharacter = () => {
      axios
        .post("/api/character/create-character", {
          name,
          gender: Number(gender),
          accountId: Number(currentUser?.id),
        })
        .then((res) => {
          toast({
            title: "Personagem criado com sucesso",
            status: "success",
            position: "top-right",
            duration: 9000,
            isClosable: true,
          });
          getData();
          onClose();
        })
        .catch((err) => {
          toast({
            title: err.response.data
              ? err.response.data
              : "Erro ao criar personagem",
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
        <Button
          onClick={onOpen}
          colorScheme={"green"}
          w="full"
          leftIcon={<MdGroupAdd fontSize={"20px"} />}
          _hover={{ background: "gray.500" }}
          px={{ base: 10, md: 0 }}
        >
          Novo Personagem
        </Button>

        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Novo Personagem</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack spacing={4}>
                <FormControl>
                  <FormLabel>Nome</FormLabel>
                  <Input
                    onChange={(e) => setName(e.target.value)}
                    focusBorderColor="#19b9d9"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Gênero</FormLabel>
                  <Select
                    onChange={(e) => setGender(e.target.value)}
                    focusBorderColor="#19b9d9"
                  >
                    <option value="">Selecione um gênero</option>
                    <option value="1">Masculino</option>
                    <option value="0">Feminino</option>
                  </Select>
                </FormControl>
              </Stack>
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                isDisabled={!name || !gender}
                onClick={handleNewCharacter}
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
    const [characterOptions, setCharacterOptions] = React.useState([]);
    const [worldId, setWorldId] = React.useState("");

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
          getData();
          onClose();
        })
        .catch((err) => {
          toast({
            title: err.response.data
              ? err.response.data
              : "Erro ao criar guild",
            status: "error",
            position: "top-right",
            duration: 9000,
            isClosable: true,
          });
          onClose();
        });
    };

    const changeSelectOption = () => {
      if (!characters) return;
      const selectOptions = characters?.filter((character) => {
        return character.level >= "50" && !character.guildnick;
      });
      var arr = [];
      selectOptions.forEach((character) => {
        arr.push({
          label: character.name,
          value: character.id,
          world_id: character.world_id,
        });
      });
      setCharacterOptions(arr);
    };

    useEffect(() => {
      changeSelectOption();
    }, []);

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
                    options={characterOptions}
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

  const handleOpenGuildModal = () => {
    setGuildModalOpen(!guildModalOpen);
  };

  const handleOpenPlayerModal = (player) => {
    setPlayerModalOpen(!playerModalOpen);
    setSelectedPlayer(player);
  };

  const checkStatusDonate = (value) => {
    if (value === 0) {
      return { status: "Pendente", color: "gray.200" };
    } else {
      return { status: "Aprovado", color: "green.200" };
    }
  };

  function convertValue(amount) {
    if (amount.length < 3) {
      return "Erro: A string fornecida deve ter pelo menos 3 dígitos.";
    }

    const centavos = 100;

    const valorInteiro = parseInt(amount);

    const valorCorrigido = valorInteiro / centavos;

    return valorCorrigido.toFixed(2).replace(".", ",");
  }

  return (
    <>
      <Box bg="gray.800">
        <Container maxW={"8xl"} minH={"calc(100vh - 100px)"}>
          <Flex pt={10} justify={"center"}>
            <Heading color={"whitesmoke"}>Minha Conta</Heading>
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
                  <Flex
                    py={2}
                    px={4}
                    gap={2}
                    direction={{ base: "column", md: "row" }}
                  >
                    <NewCharacterModal />
                    <NewGuildModal
                      open={guildModalOpen}
                      setOpen={setGuildModalOpen}
                    />
                    <Button
                      bg="gray.400"
                      w="full"
                      leftIcon={<TbShieldPlus fontSize={"20px"} />}
                      justifyItems={"start"}
                      _hover={{ background: "gray.500" }}
                      onClick={() => handleOpenGuildModal()}
                    >
                      Criar Guild
                    </Button>
                    <DonationModal />
                  </Flex>
                </Stack>
                <Flex direction={"column"}>
                  <Box bg="whitesmoke" borderTopRadius={"md"}>
                    <Box borderTopRadius={"md"} w="full" bg="gray.400">
                      <Flex align="center" justify="center" gap={4} py={4}>
                        <FaRegUser fontSize={"20px"} color={"black"} />
                        <Heading fontSize={"xl"} color={"gray.900"}>
                          Personagens
                        </Heading>
                      </Flex>
                    </Box>
                    <Flex
                      maxH="md"
                      minH={"xs"}
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
                          minH="xs"
                          align={"center"}
                          justify={"center"}
                          direction={"column"}
                          gap={4}
                        >
                          <Image src="/utils/ash.gif" w="100px" />
                          <Text> Carregando... </Text>
                        </Flex>
                      ) : characters ? (
                        characters?.map((player) => {
                          return (
                            <Flex
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
                                fontSize={{ base: "md", md: "xl" }}
                                overflow={"hidden"}
                                whiteSpace={"nowrap"}
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
                                display={{ base: "none", md: "initial" }}
                              >
                                <Badge
                                  overflowY={"hidden"}
                                  borderRadius={"lg"}
                                  px={3}
                                  variant={"subtle"}
                                  textAlign="center"
                                  colorScheme={"blue"}
                                >
                                  {player.world_id === 1
                                    ? "Mundo 1"
                                    : "Mundo 2"}
                                </Badge>
                              </Box>

                              <HStack w="60%">
                                <Text>Level:</Text>
                                <Badge
                                  overflowY={"hidden"}
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
                                w="100%"
                                display={{ base: "none", md: "initial" }}
                              >
                                <Badge
                                  overflowY={"hidden"}
                                  borderRadius={"lg"}
                                  px={3}
                                  background={"gray.300"}
                                  color={"black"}
                                >
                                  Treinador Pokemon
                                </Badge>
                              </HStack>
                              <HStack
                                w="100%"
                                display={{ base: "none", md: "flex" }}
                              >
                                <Text>Guild:</Text>
                                {player.guildnick ? (
                                  <Badge
                                    overflowY={"hidden"}
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

                              <ConfirmModal
                                title={
                                  "Deseja realmente apagar seu personagem?"
                                }
                                onConfirm={() => handleDelete(player.id)}
                              >
                                <Tooltip label="Apagar personagem">
                                  <IconButton
                                    w="100%"
                                    colorScheme="red"
                                    variant={"solid"}
                                    icon={
                                      <RiDeleteBin7Line fontSize={"20px"} />
                                    }
                                    aria-label={""}
                                  />
                                </Tooltip>
                              </ConfirmModal>
                            </Flex>
                          );
                        })
                      ) : (
                        <Text>Não há nenhum personagem...</Text>
                      )}
                    </Flex>
                  </Box>
                  <Box
                    bg="whitesmoke"
                    w="full"
                    borderBottomRadius={"md"}
                    p={4}
                    mb={8}
                  >
                    <SimpleGrid gap={2} columns={{ base: 1, md: 2 }}>
                      <ChangePasswordModal>
                        <Button
                          w="full"
                          bg="gray.400"
                          _hover={{ background: "gray.500" }}
                          leftIcon={<TbLock fontSize={"20px"} />}
                        >
                          Alterar senha
                        </Button>
                      </ChangePasswordModal>
                      <TwoFactorAuthModal>
                        <Button
                          w="full"
                          bg="gray.400"
                          _hover={{ background: "gray.500" }}
                          leftIcon={<TbKey fontSize="20px" />}
                        >
                          {currentUser?.twoFactorAuth === 0
                            ? "Ativar autenticação em dois fatores"
                            : "Desativar autenticação em dois fatores"}
                        </Button>
                      </TwoFactorAuthModal>
                      <RecoveryKeyModal>
                        <Button
                          isDisabled={currentUser?.key ? true : false}
                          w="full"
                          bg="gray.400"
                          _hover={{ background: "gray.500" }}
                          leftIcon={<TbKey fontSize="20px" />}
                        >
                          {currentUser?.key
                            ? "Recovery key gerada"
                            : "Gerar recovery key"}
                        </Button>
                      </RecoveryKeyModal>
                      <TwitchModal characters={characters}>
                        <Button
                          isDisabled={currentUser?.isStreamer === 0}
                          w="full"
                          colorScheme={"purple"}
                          leftIcon={<TbBrandTwitch fontSize="20px" />}
                        >
                          Login Twitch
                        </Button>
                      </TwitchModal>
                    </SimpleGrid>
                  </Box>
                  <Stack spacing={0}>
                    <Box borderTopRadius={"md"} w="full" bg="gray.400">
                      <Flex align="center" justify="center" gap={4} py={4}>
                        <IoDiamondOutline fontSize={"20px"} color={"black"} />
                        <Heading fontSize={"xl"} color={"gray.900"}>
                          Doações
                        </Heading>
                      </Flex>
                    </Box>
                    <Box
                      bg="whitesmoke"
                      w="full"
                      borderBottomRadius={"md"}
                      p={4}
                      mb={8}
                    >
                      <Box
                        maxH="md"
                        minH={"xs"}
                        overflow={"auto"}
                        w={"full"}
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
                        {donates?.map((donate) => {
                          return (
                            <Flex
                              flexWrap={{ base: "wrap", md: "nowrap" }}
                              key={donate.id}
                              justifyContent={"space-between"}
                              align={"center"}
                              width={"full"}
                              p={4}
                              borderBottom={
                                donates.length > 1 ? "1px solid black" : null
                              }
                              gap={4}
                            >
                              <Heading
                                w="20%"
                                fontSize={"xl"}
                                overflowX={{ base: "none", md: "hidden" }}
                                whiteSpace={"nowrap"}
                                textOverflow={"ellipsis"}
                                overflowY={"hidden"}
                                onClick={() => handleOpenPlayerModal(player)}
                                cursor={"pointer"}
                                _hover={{
                                  color: "#19b9d9",
                                  textDecoration: "underline",
                                  textDecorationColor: "#19b9d9",
                                }}
                              >
                                #{donate.id}
                              </Heading>

                              <Flex
                                w="50%"
                                gap={2}
                                align={"center"}
                                overflowY={"hidden"}
                              >
                                <Text>Valor:</Text>
                                <Text>
                                  R$
                                  {donate.value === 0
                                    ? "00,00"
                                    : convertValue(donate.value)}
                                </Text>
                              </Flex>
                              <Flex
                                w="50%"
                                gap={2}
                                align={"center"}
                                overflowY={"hidden"}
                              >
                                <Text>Status:</Text>
                                <Badge
                                  borderRadius={"md"}
                                  bg={checkStatusDonate(donate.value).color}
                                >
                                  {checkStatusDonate(donate.value).status}
                                </Badge>
                              </Flex>

                              <Flex
                                w="50%"
                                gap={2}
                                align={"center"}
                                overflowY={"hidden"}
                              >
                                <Text>Cupom:</Text>
                                <Badge borderRadius={"md"}>
                                  {donate.cupom ? donate.cupom : "-"}
                                </Badge>
                              </Flex>

                              <Flex
                                w="100%"
                                align={"center"}
                                gap={6}
                                overflowY={"hidden"}
                              >
                                <Text>Ref:</Text>
                                <Flex flex="1" align="center" gap={4}>
                                  <Text flex="1">{donate.ref}</Text>
                                  <Tooltip label="Copiar ref">
                                    <IconButton
                                      variant={"ghost"}
                                      icon={<CopyIcon />}
                                      onClick={() => handleCopyRef(donate.ref)}
                                    />
                                  </Tooltip>
                                </Flex>
                              </Flex>
                            </Flex>
                          );
                        })}
                      </Box>
                    </Box>
                  </Stack>
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

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
  Divider,
  Select,
  Textarea,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import { IoDiamondOutline } from "react-icons/io5";
import { TbPokeball, TbEyeSearch } from "react-icons/tb";
import { BiUserCircle } from "react-icons/bi";
import { IoTicketOutline } from "react-icons/io5";
import { TbWorld } from "react-icons/tb";
import { AiOutlineTrophy } from "react-icons/ai";
import { PlayerModal } from "@/components/PlayerModal";
import { TbLocationPlus } from "react-icons/tb";
import { RiCoinsLine } from "react-icons/ri";

function NewTicketModal({ open, setOpen }) {
  const { isOpen, onClose } = useDisclosure({
    isOpen: open,
    onClose() {
      setOpen(!open);
    },
  });
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [type, setType] = React.useState(null);
  const [value, setValue] = React.useState(0);
  const { currentUser } = useContext(AuthContext);
  const [loading, setLoading] = React.useState(false);
  const toast = useToast();

  const handleNewTicket = () => {
    setLoading(true);
    axios
      .post("/api/account/create-ticket", {
        title,
        description,
        userId: Number(currentUser.id),
        typeId: Number(type),
        value: Number(value),
      })
      .then((res) => {
        setLoading(false);
        toast({
          title: "Ticket criado com sucesso",
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
          title: err.response.data ? err.response.data : "Erro ao criar ticket",
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
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Novo Ticket</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex direction={"column"} gap={4}>
              <Stack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Tipo de solicitação</FormLabel>
                  <Select onChange={(e) => setType(e.target.value)}>
                    <option value={""}>Selecione um tipo</option>
                    <option value="0">Suporte ao jogador</option>
                    <option value="1">Confirmar doações</option>
                    <option value="2">Solicitação de saque</option>
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Título</FormLabel>
                  <Input
                    isDisabled={!type}
                    onChange={(e) => setTitle(e.target.value)}
                    focusBorderColor="#19b9d9"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Descrição</FormLabel>
                  <Textarea
                    isDisabled={!type}
                    overflowY={"auto"}
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
                    resize={"none"}
                    h={"md"}
                    maxLength={1050}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </FormControl>
              </Stack>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button
              isDisabled={!type}
              isLoading={loading}
              colorScheme="blue"
              mr={3}
              onClick={handleNewTicket}
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

function EditModal({ open, setOpen, selectedTicket }) {
  const { isOpen, onClose } = useDisclosure({
    isOpen: open,
    onClose() {
      setOpen(!open);
    },
  });
  const { currentUser } = useContext(AuthContext);
  const [loading, setLoading] = React.useState(false);
  const [messages, setMessages] = React.useState([]);
  const [inputMessage, setInputMessage] = React.useState("");
  const toast = useToast();
  const router = useRouter();

  const getMessages = () => {
    setLoading(true);
    axios
      .get(`/api/account/get-messages-ticket`, {
        params: { ticketId: selectedTicket.id },
      })
      .then((res) => {
        setMessages(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (selectedTicket && selectedTicket.id) {
      getMessages();
    }
  }, [selectedTicket]);

  const handleCreateMessage = () => {
    setLoading(true);
    axios
      .post(`/api/account/create-messages-ticket`, {
        ticketId: selectedTicket.id,
        userId: currentUser.id,
        message: inputMessage,
      })
      .then((res) => {
        getMessages();
        setInputMessage("");
        setLoading(false);
      })
      .catch((err) => {
        toast({
          title: "Erro ao enviar mensagem",
          description: err?.response?.data.split(":")[1].trim(),
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        setLoading(false);
      });
  };

  function formatDate(dateString) {
    const parts = dateString.split("-");
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }

  let lastMessage = messages[messages.length - 1];

  function capitalizeFirstLetter(string) {
    if (!string) return string;
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered size={"2xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Flex align={"center"} gap={2}>
              <Heading fontSize={"3xl"}>#{selectedTicket.id}</Heading>
              <Text fontSize={"md"}>
                - {capitalizeFirstLetter(selectedTicket.name)}
              </Text>
            </Flex>
            <Divider mt={6} />
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex direction={"column"} gap={4}>
              <Box
                maxH={"md"}
                overflowY={"scroll"}
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
                <Flex direction={"column"} gap={4}>
                  {messages.map((message) => {
                    if (message.from_user === currentUser.id) {
                      return (
                        <Flex justify={"flex-end"} px={4}>
                          <Flex
                            direction={"column"}
                            gap={2}
                            key={message.id}
                            bg="blue.300"
                            p={4}
                            borderRadius={"lg"}
                            maxW="80%"
                            w={"fit-content"}
                          >
                            <Text
                              fontSize="md"
                              wordBreak={"break-word"}
                              whiteSpace={"pre-wrap"}
                            >
                              {message.message}
                            </Text>
                            <Text fontSize="xs" alignSelf={"end"}>
                              {formatDate(message.created.split("T")[0])}
                            </Text>
                          </Flex>
                        </Flex>
                      );
                    } else {
                      return (
                        <Flex
                          direction={"column"}
                          gap={2}
                          key={message.id}
                          bg="gray.300"
                          p={4}
                          borderRadius={"lg"}
                          maxW="80%"
                          w={"fit-content"}
                        >
                          <Text
                            fontSize="md"
                            wordBreak={"break-word"}
                            whiteSpace={"pre-wrap"}
                          >
                            {message.message}
                          </Text>
                          <Text fontSize="xs" alignSelf={"start"}>
                            {formatDate(message.created.split("T")[0])}
                          </Text>
                        </Flex>
                      );
                    }
                  })}
                </Flex>
              </Box>
              {lastMessage && lastMessage.from_user !== currentUser.id && (
                <>
                  <Divider />
                  <Flex w="full" align={"center"} gap={4}>
                    <Textarea
                      isDisabled={selectedTicket.closed === 0}
                      maxLength={650}
                      resize={"none"}
                      onChange={(e) => setInputMessage(e.target.value)}
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
                    />
                    <Button
                      isDisabled={selectedTicket.closed === 0}
                      h="80px"
                      colorScheme={"blue"}
                      onClick={handleCreateMessage}
                    >
                      Enviar
                    </Button>
                  </Flex>
                </>
              )}
              {lastMessage && lastMessage.from_user === currentUser.id && (
                <>
                  <Divider />
                  <Center>
                    <Text as={"i"}>Aguardando resposta...</Text>
                  </Center>
                  <Flex w="full" align={"center"} gap={4}>
                    <Textarea
                      isDisabled
                      maxLength={650}
                      resize={"none"}
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
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
                    />
                    <Button
                      isDisabled
                      h="80px"
                      colorScheme={"blue"}
                      onClick={handleCreateMessage}
                    >
                      Enviar
                    </Button>
                  </Flex>
                </>
              )}
            </Flex>
          </ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
const Tickets = () => {
  const { currentUser } = React.useContext(AuthContext);
  const [loading, setLoading] = React.useState(false);
  const [topPlayers, setTopPlayers] = React.useState([]);
  const [playerModalOpen, setPlayerModalOpen] = React.useState(false);
  const [selectedPlayer, setSelectedPlayer] = React.useState({});
  const [selectedTicket, setSelectedTicket] = React.useState({});
  const [newTicketModalOpen, setNewTicketModalOpen] = React.useState(false);
  const [tickets, setTickets] = React.useState([]);
  const [lastCaught, setLastCaught] = React.useState({});
  const [ticketModalOpen, setTicketModalOpen] = React.useState(false);
  const router = useRouter();
  const [loadingTopLvl, setLoadingTopLvl] = React.useState(false);
  const [loadingCaught, setLoadingCaught] = React.useState(false);

  const getData = () => {
    setLoading(true);
    axios
      .get(`/api/account/get-tickets`, {
        params: { userId: currentUser?.id },
      })
      .then((res) => {
        setTickets(res.data);
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
  }, [currentUser, ticketModalOpen]);

  useEffect(() => {
    if (!newTicketModalOpen) {
      getData();
    }
  }, [newTicketModalOpen]);

  useEffect(() => {
    getTopLevel();
    getLastCaught();
  }, []);

  const handleOpenNewTicketModal = () => {
    setNewTicketModalOpen(!newTicketModalOpen);
  };

  const handleOpenPlayerModal = (player) => {
    setPlayerModalOpen(!playerModalOpen);
    setSelectedPlayer(player);
  };

  const handleOpenTicket = (ticket) => {
    setTicketModalOpen(!ticketModalOpen);
    setSelectedTicket(ticket);
  };

  const checkType = (type) => {
    if (type === 0) {
      return { msg: "Suporte ao jogador", color: "blue" };
    } else if (type === 1) {
      return { msg: "Confirmar doação", color: "green" };
    } else {
      return { msg: "Solicitação de saque", color: "yellow" };
    }
  };

  const checkStatus = (status) => {
    if (status === 0) {
      return { msg: "Aberto", color: "gray" };
    } else if (status === 1) {
      return { msg: "Fechado", color: "red" };
    } else if (status === 2) {
      return { msg: "Em analise", color: "yellow" };
    } else if (status === 3) {
      return { msg: "Respondido", color: "blue" };
    } else if (status === 4) {
      return { msg: "Aprovado", color: "green" };
    } else if (status === 5) {
      return { msg: "Recusado", color: "red" };
    }
  };

  return (
    <>
      <Box bg="gray.800">
        <EditModal
          open={ticketModalOpen}
          setOpen={setTicketModalOpen}
          selectedTicket={selectedTicket}
        />
        <Container maxW={"8xl"} minH={"calc(100vh - 100px)"} pb={6}>
          <Flex pt={10} justify={"center"}>
            <Heading color={"whitesmoke"}>Meus Tickets</Heading>
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
                    <NewTicketModal
                      open={newTicketModalOpen}
                      setOpen={setNewTicketModalOpen}
                    />

                    <Button
                      bg="gray.400"
                      w="full"
                      leftIcon={<TbLocationPlus fontSize={"20px"} />}
                      justifyItems={"start"}
                      _hover={{ background: "gray.500" }}
                      onClick={() => handleOpenNewTicketModal()}
                    >
                      Abrir Ticket
                    </Button>

                    <Button
                      bg="gray.400"
                      w="full"
                      leftIcon={<BiUserCircle fontSize="20px" />}
                      _hover={{ background: "gray.500" }}
                      onClick={() => router.push("/my-account")}
                    >
                      Minha conta
                    </Button>
                  </HStack>
                </Stack>

                <Box bg="whitesmoke" borderRadius={"md"}>
                  <Box borderTopRadius={"md"} w="full" bg="gray.400">
                    <Flex align="center" justify="center" gap={4} py={4}>
                      <IoTicketOutline fontSize={"20px"} color={"black"} />
                      <Heading fontSize={"xl"} color={"gray.900"}>
                        Tickets
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
                      tickets?.map((ticket) => {
                        return (
                          <Flex
                            key={ticket.id}
                            justifyContent={"space-between"}
                            align={"center"}
                            p={4}
                            borderBottom={"1px solid black"}
                            gap={4}
                          >
                            <Heading
                              overflowY={"hidden"}
                              w="100%"
                              fontSize={"2xl"}
                              overflowX={{ base: "none", md: "hidden" }}
                              whiteSpace={"nowrap"}
                              textOverflow={"ellipsis"}
                              maxW="100%"
                            >
                              {ticket.name}
                            </Heading>

                            <Box
                              w="60%"
                              display={{ base: "none", md: "block" }}
                              overflowY={"hidden"}
                            >
                              <Badge
                                borderRadius={"lg"}
                                px={3}
                                variant={"subtle"}
                                textAlign="center"
                                colorScheme={checkType(ticket.type).color}
                              >
                                {checkType(ticket.type).msg}
                              </Badge>
                            </Box>

                            <Box w="60%" overflowY={"hidden"}>
                              <Badge
                                borderRadius={"lg"}
                                px={3}
                                variant={"subtle"}
                                textAlign="center"
                                colorScheme={checkStatus(ticket.status).color}
                              >
                                {checkStatus(ticket.status).msg}
                              </Badge>
                            </Box>

                            <Tooltip label="Visualizar">
                              <IconButton
                                onClick={() => handleOpenTicket(ticket)}
                                colorScheme="red"
                                icon={<TbEyeSearch fontSize="20px" />}
                              />
                            </Tooltip>
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

export default Tickets;

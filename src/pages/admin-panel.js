import { AuthContext } from "@/context/AuthContext";
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Image,
  Input,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Tooltip,
  useDisclosure,
  Badge,
  HStack,
  Divider,
  Textarea,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
  Stack,
  FormHelperText,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useContext } from "react";
import { TbEyeSearch, TbStatusChange } from "react-icons/tb";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});
import "react-quill/dist/quill.snow.css";
import { RefreshToken } from "@/services/AuthServices/RefreshToken";
import { MdMoreVert } from "react-icons/md";
import { Select } from "chakra-react-select";
import { TbBrandTwitch } from "react-icons/tb";

const SetStreamersModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure({});
  const [userValues, setUserValues] = React.useState([]);
  const [selectedStreamers, setSelectedStreamers] = React.useState([]);
  const toast = useToast();

  const getUsers = () => {
    axios
      .get(`/api/account/list-accounts`)
      .then((res) => {
        let arr = [];
        res.data.users.forEach((data) => {
          arr.push({
            label: data.email,
            value: data.id,
          });
        });
        setUserValues(arr);
        let streamerArr = [];
        res.data.streamers.forEach((data) => {
          streamerArr.push({
            label: data.email,
            value: data.id,
          });
        });
        setSelectedStreamers(streamerArr);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (isOpen) {
      getUsers();
    }
  }, [isOpen]);

  const handleSetStreamers = () => {
    axios
      .put("/api/twitch/set-streamers", {
        userArr: selectedStreamers,
      })
      .then((res) => {
        toast({
          title: "Streamers atualizados com sucesso!",
          status: "success",
          position: "top-right",
          duration: 9000,
          isClosable: true,
        });

        onClose();
      })
      .catch((err) => {
        toast({
          title: "Erro ao atualizar stream!",
          status: "error",
          position: "top-right",
          duration: 9000,
          isClosable: true,
        });
        console.log(err);
        onClose();
      });
  };

  return (
    <>
      <Button
        onClick={onOpen}
        colorScheme={"purple"}
        leftIcon={<TbBrandTwitch />}
      >
        Editar Streamers
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>Selecionar streamers</ModalHeader>
          <ModalBody>
            <FormControl>
              <Select
                isMulti
                onChange={setSelectedStreamers}
                focusBorderColor="#19b9d9"
                options={userValues}
                value={selectedStreamers}
                isClearable={false}
              />

              <FormHelperText>
                Todos os selecionados serão incluídos como streamers
              </FormHelperText>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button w="full" colorScheme="blue" onClick={handleSetStreamers}>
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

function StatusModal({ open, setOpen, selectedTicket }) {
  const { isOpen, onClose } = useDisclosure({
    isOpen: open,
    onClose() {
      setOpen(!open);
    },
  });
  const [status, setStatus] = React.useState(null);
  let options = [
    { label: "Aberto", value: 0 },
    { label: "Fechado", value: 1 },
    { label: "Em Analise", value: 2 },
    { label: "Respondido", value: 3 },
    { label: "Aprovado", value: 4 },
    { label: "Recusado", value: 5 },
  ];

  const handleChangeStatus = () => {
    axios
      .put(`/api/account/update-ticket-status`, {
        ticketId: selectedTicket.id,
        statusId: status,
      })
      .then((res) => {
        onClose();
      })
      .catch((err) => {
        console.log(err);
        onClose();
      });
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered size={"2xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Alterar Status - #{selectedTicket.id}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Select
              onChange={(e) => setStatus(e.value)}
              focusBorderColor="#19b9d9"
              placeholder="Selecione o novo status"
              options={options}
            ></Select>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleChangeStatus}>
              Adicionar
            </Button>
            <Button onClick={onClose}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

const AdminPanel = () => {
  const { currentUser } = React.useContext(AuthContext);
  const [tickets, setTickets] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [ticketModalOpen, setTicketModalOpen] = React.useState(false);
  const [selectedTicket, setSelectedTicket] = React.useState({});
  const [statusModalOpen, setStatusModalOpen] = React.useState(false);
  const [newsContent, setNewsContent] = React.useState("");
  const [newsTitle, setNewsTitle] = React.useState("");
  const [streamers, setStreamers] = React.useState([]);
  const [values, setValues] = React.useState([]);
  const [selectedStreamer, setSelectedStreamer] = React.useState(null);
  const [donates, setDonates] = React.useState([]);
  const toast = useToast();

  const toolbarOptions = [
    ["bold", "italic", "underline", "strike"],
    ["blockquote", "code-block"],
    [{ header: 1 }, { header: 2 }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ script: "sub" }, { script: "super" }],
    [{ indent: "-1" }, { indent: "+1" }],
    ["image", "link"],
    [{ direction: "rtl" }],
    [{ size: ["small", false, "large", "huge"] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ color: [] }, { background: [] }],
    [{ font: [] }],
    [{ align: [] }],
    ["clean"],
  ];

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
          console.log(err);
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
              <HStack spacing={6}>
                <Flex align={"center"} gap={2} w="full">
                  <Heading fontSize={"3xl"}>#{selectedTicket.id}</Heading>
                </Flex>

                <Flex
                  w="full"
                  display={{ base: "flex", md: "none" }}
                  gap={2}
                  px={6}
                  align={"center"}
                  justify={"center"}
                  direction={"column"}
                >
                  <Badge
                    borderRadius={"lg"}
                    px={3}
                    variant={"subtle"}
                    textAlign="center"
                    colorScheme={checkType(selectedTicket.type).color}
                  >
                    {checkType(selectedTicket.type).msg}
                  </Badge>
                  <Text
                    fontSize={"14px"}
                    overflowX={"hidden"}
                    whiteSpace={"nowrap"}
                    textOverflow={"ellipsis"}
                    maxW="100%"
                  >
                    {selectedTicket.creator}
                  </Text>
                </Flex>
              </HStack>
              <Text fontSize={"md"} textAlign={"center"} mt={6}>
                {capitalizeFirstLetter(selectedTicket.name)}
              </Text>
              <Divider mt={6} />
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Flex
                direction={"column"}
                gap={4}
                mb={10}
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
                maxH={"35rem"}
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
                  messages.map((message) => {
                    if (message.from_user === currentUser.id) {
                      return (
                        <Flex justify={"flex-end"} key={message.id} px={4}>
                          <Flex
                            direction={"column"}
                            gap={2}
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
                          w={
                            message.message.length < 10 ? "20%" : "fit-content"
                          }
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
                      );
                    }
                  })
                )}
              </Flex>
              <Divider />
              <Flex w="full" align={"center"} gap={4} mt={2}>
                <Textarea
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
                  isDisabled={selectedTicket.status === 1 || !inputMessage}
                  h="80px"
                  colorScheme={"blue"}
                  onClick={handleCreateMessage}
                >
                  Enviar
                </Button>
              </Flex>
            </ModalBody>

            <ModalFooter></ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  }

  const handleOpenTicket = (ticket) => {
    setTicketModalOpen(!ticketModalOpen);
    setSelectedTicket(ticket);
  };

  const handleOpenStatus = (ticket) => {
    setStatusModalOpen(!statusModalOpen);
    setSelectedTicket(ticket);
  };

  const getData = () => {
    setLoading(true);
    axios
      .get(`/api/account/get-all-tickets`)
      .then((res) => {
        setTickets(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const getDataNoLoading = () => {
    axios
      .get(`/api/account/get-all-tickets`)
      .then((res) => {
        setTickets(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getStreamers = () => {
    axios
      .get(`/api/twitch/list-streamers`)
      .then((res) => {
        setStreamers(res.data);
        let arr = [];
        res.data.forEach((data) => {
          arr.push({
            label: data.name,
            value: data.id,
          });
        });
        setValues(arr);
        const streamer = res.data.find((item) => item.popUpStreamer);
        setSelectedStreamer({ label: streamer.name, value: streamer.id });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (currentUser) {
      getData();
      getStreamers();
      getDonates();
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      getDataNoLoading();
    }
  }, [currentUser, statusModalOpen, ticketModalOpen]);

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

  const handleAddNews = () => {
    axios
      .post(`/api/admin/create-news`, {
        title: newsTitle,
        body: newsContent,
        username: currentUser.name,
      })
      .then((res) => {
        setNewsTitle("");
        setNewsContent("");
        toast({
          title: "Noticia inserida com sucesso!",
          status: "success",
          position: "top-right",
          duration: 9000,
          isClosable: true,
        });
      })
      .catch((err) => {
        toast({
          title: "Erro ao inserir noticia!",
          status: "success",
          position: "top-right",
          duration: 9000,
          isClosable: true,
        });
        console.log(err);
      });
  };

  const handleSetPopUpStreamer = () => {
    axios
      .put(`/api/twitch/set-pop-up-stream`, {
        userId: selectedStreamer,
      })
      .then((res) => {
        toast({
          title: "Streamer alterado com sucesso!",
          status: "success",
          position: "top-right",
          duration: 9000,
          isClosable: true,
        });
      })
      .catch((err) => {
        toast({
          title:
            err?.response?.data.split(":")[1].trim() ||
            "Erro ao alterar streamer",
          status: "success",
          position: "top-right",
          duration: 9000,
          isClosable: true,
        });
        console.log(err);
      });
  };

  const getDonates = async () => {
    await axios
      .get(`/api/pagbank/list-donations`)
      .then((res) => {
        setDonates(res.data);
      })
      .catch((err) => {});
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
        <EditModal
          open={ticketModalOpen}
          setOpen={setTicketModalOpen}
          selectedTicket={selectedTicket}
        />
        <StatusModal
          open={statusModalOpen}
          setOpen={setStatusModalOpen}
          selectedTicket={selectedTicket}
        />
        <Container maxW={"8xl"} minH={"calc(100vh - 100px)"} pb={10}>
          <Flex pt={10} justify={"center"}>
            <Heading color={"whitesmoke"}>Painel Administrador</Heading>
          </Flex>
          <Box mt={10} bg="white" borderRadius={"lg"}>
            <Tabs isFitted>
              <TabList bg="white" borderRadius={"lg"}>
                <Tab>Tickets</Tab>
                <Tab>News</Tab>
                <Tab>Twitch</Tab>
                <Tab>Doações</Tab>
              </TabList>

              <TabPanels>
                <TabPanel
                  px={0}
                  minH={{ base: "lg", md: "sm" }}
                  overflowX={"auto"}
                >
                  {loading ? (
                    <Flex
                      align={"center"}
                      justify={"center"}
                      direction={"column"}
                      gap={4}
                    >
                      <Image src="/utils/ash.gif" w="100px" />
                      <Text> Carregando... </Text>
                    </Flex>
                  ) : (
                    tickets.map((item) => {
                      return (
                        <Flex
                          flexWrap={{ base: "wrap", md: "nowrap" }}
                          borderBottom={"1px solid black"}
                          px={{ base: 2, md: 10 }}
                          w="full"
                          pt={5}
                          p={4}
                          align={"center"}
                          gap={{ base: 5 }}
                          justify={"space-between"}
                        >
                          <Text
                            fontSize={"20px"}
                            as={"b"}
                            w="20%"
                            overflowX={{ base: "none", md: "hidden" }}
                            whiteSpace={"nowrap"}
                            textOverflow={"ellipsis"}
                          >
                            #{item.id}
                          </Text>
                          <Heading
                            w="50%"
                            fontSize={"xl"}
                            overflowX={"hidden"}
                            whiteSpace={"nowrap"}
                            textOverflow={"ellipsis"}
                            maxW="100%"
                          >
                            {item.creator}
                          </Heading>
                          <Flex align={"center"} gap={2} w="100%">
                            <Text>Título:</Text>
                            <Text
                              w="100%"
                              overflowX={"hidden"}
                              whiteSpace={"nowrap"}
                              textOverflow={"ellipsis"}
                            >
                              {item.name}
                            </Text>
                          </Flex>
                          <Flex w="100%" align={"center"} gap={2}>
                            <Text>Tipo:</Text>
                            <Badge
                              borderRadius={"lg"}
                              px={3}
                              variant={"subtle"}
                              textAlign="center"
                              colorScheme={checkType(item.type).color}
                            >
                              {checkType(item.type).msg}
                            </Badge>
                          </Flex>
                          <Flex w="80%" align={"center"} gap={2}>
                            <Text>Status:</Text>
                            <Badge
                              borderRadius={"lg"}
                              px={3}
                              variant={"subtle"}
                              textAlign="center"
                              colorScheme={checkStatus(item.status).color}
                            >
                              {checkStatus(item.status).msg}
                            </Badge>
                          </Flex>
                          <HStack display={{ base: "none", md: "flex" }}>
                            <Tooltip label="Alterar Status">
                              <IconButton
                                onClick={() => handleOpenStatus(item)}
                                colorScheme="green"
                                icon={<TbStatusChange fontSize="20px" />}
                              />
                            </Tooltip>
                            <Tooltip label="Visualizar">
                              <IconButton
                                onClick={() => handleOpenTicket(item)}
                                colorScheme="red"
                                icon={<TbEyeSearch fontSize="20px" />}
                              />
                            </Tooltip>
                          </HStack>
                          <Menu>
                            <MenuButton
                              display={{ base: "flex", md: "none" }}
                              as={IconButton}
                              icon={<MdMoreVert />}
                            ></MenuButton>
                            <MenuList>
                              <MenuItem onClick={() => handleOpenStatus(item)}>
                                Alterar Status
                              </MenuItem>
                              <MenuItem onClick={() => handleOpenTicket(item)}>
                                Visualizar
                              </MenuItem>
                            </MenuList>
                          </Menu>
                        </Flex>
                      );
                    })
                  )}
                </TabPanel>

                <TabPanel minH="sm">
                  <Stack spacing={{ base: 40, md: 20 }}>
                    <Flex direction="column" gap={6}>
                      <FormControl>
                        <FormLabel>Título</FormLabel>
                        <Input
                          value={newsTitle}
                          onChange={(e) => setNewsTitle(e.target.value)}
                        />
                      </FormControl>
                      <Box>
                        <FormControl>
                          <FormLabel>Corpo da noticia</FormLabel>
                          <ReactQuill
                            style={{ height: "20rem" }}
                            theme="snow"
                            modules={{ toolbar: toolbarOptions }}
                            value={newsContent}
                            onChange={setNewsContent}
                          />
                        </FormControl>
                      </Box>
                    </Flex>
                    <Flex width="full" justify={"end"}>
                      <Button colorScheme={"blue"} onClick={handleAddNews}>
                        Publicar
                      </Button>
                    </Flex>
                  </Stack>
                </TabPanel>

                <TabPanel minH="md" px={0}>
                  <Stack spacing={4}>
                    <Box w="full" px={4}>
                      <Flex
                        gap={{ base: 5, md: 0 }}
                        justify={{ base: "none", md: "space-between" }}
                        align={{ base: "stretch", md: "center" }}
                        direction={{ base: "column", md: "row" }}
                      >
                        <SetStreamersModal />
                        <FormControl maxW={{ base: "full", md: "50%" }}>
                          <FormLabel>
                            Selecione o Streamer para pop-up
                          </FormLabel>
                          <Select
                            focusBorderColor="#19b9d9"
                            options={values}
                            value={selectedStreamer}
                            onChange={setSelectedStreamer}
                          />
                        </FormControl>
                        <Button
                          colorScheme={"blue"}
                          onClick={handleSetPopUpStreamer}
                        >
                          Salvar
                        </Button>
                      </Flex>
                    </Box>
                    <Divider py={4} />
                    <Box overflowY={"auto"}>
                      <Heading textAlign="center" size="md" py={4}>
                        Contas cadastradas com a Twitch
                      </Heading>
                      <Box
                        bg="gray.100"
                        m={4}
                        p={2}
                        borderRadius={"lg"}
                        maxH="md"
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
                        {streamers.map((streamer) => {
                          return (
                            <Flex
                              flexWrap={{ base: "wrap", md: "nowrap" }}
                              key={streamer.id}
                              justifyContent={"space-between"}
                              align={"center"}
                              p={4}
                              borderBottom={
                                streamers.length > 1 ? "1px solid black" : null
                              }
                            >
                              <Heading
                                w={"100%"}
                                fontSize={"xl"}
                                overflowX={"hidden"}
                                whiteSpace={"nowrap"}
                                textOverflow={"ellipsis"}
                                overflowY={"hidden"}
                                maxW="100%"
                              >
                                {streamer.nickname}
                              </Heading>
                              <HStack w="100%" overflowY={"hidden"}>
                                <Text whiteSpace={"nowrap"}>E-mail:</Text>
                                <Badge
                                  whiteSpace={"nowrap"}
                                  textOverflow={"ellipsis"}
                                  borderRadius={"lg"}
                                  px={3}
                                  w="fit-content"
                                  colorScheme={"gray"}
                                >
                                  {streamer.email}
                                </Badge>
                              </HStack>
                              <HStack w="100%" overflowY={"hidden"}>
                                <Text>Twitch User:</Text>
                                <Badge
                                  borderRadius={"lg"}
                                  px={3}
                                  colorScheme={"gray"}
                                >
                                  {streamer.twitchLogin}
                                </Badge>
                              </HStack>
                            </Flex>
                          );
                        })}
                      </Box>
                    </Box>
                  </Stack>
                </TabPanel>

                <TabPanel minH="md">
                  <Heading textAlign="center" size="md" py={4}>
                    Histórico de doações
                  </Heading>
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
                          >
                            #{donate.id}
                          </Heading>

                          <Flex w="50%" gap={2} align={"center"}>
                            <Text>Valor:</Text>
                            <Text>
                              R$
                              {donate.value === 0
                                ? "00,00"
                                : convertValue(donate.value)}
                            </Text>
                          </Flex>

                          <Flex w="50%" gap={2} align={"center"}>
                            <Text>Doador:</Text>
                            <Text>{donate.user_name}</Text>
                          </Flex>

                          <Flex w="50%" gap={2} align={"center"}>
                            <Text>Status:</Text>
                            <Badge
                              borderRadius="md"
                              bg={checkStatusDonate(donate.value).color}
                            >
                              {checkStatusDonate(donate.value).status}
                            </Badge>
                          </Flex>

                          <Flex w="50%" gap={2} align={"center"}>
                            <Text>Cupom:</Text>
                            <Badge>{donate.cupom ? donate.cupom : "-"}</Badge>
                          </Flex>

                          <Flex w="100%" align={"center"} gap={6}>
                            <Text>Ref:</Text>
                            <Flex flex="1" align="center" gap={4}>
                              <Text flex="1">{donate.ref}</Text>
                            </Flex>
                          </Flex>
                        </Flex>
                      );
                    })}
                  </Box>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default AdminPanel;

export const getServerSideProps = async (ctx) => {
  try {
    const token = ctx.req.cookies.token;
    if (token) {
      const response = await RefreshToken({ tokenNumber: token });
      if (response.user.group_id === 10) {
        return {
          props: {},
        };
      } else {
        return {
          redirect: {
            destination: "/",
            permanent: false,
          },
        };
      }
    } else {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
  } catch (err) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
};

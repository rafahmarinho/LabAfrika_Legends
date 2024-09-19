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
  Divider,
  Select,
  Spinner,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useContext, useEffect } from "react";
import { TbWorld } from "react-icons/tb";
import { AiOutlineTrophy } from "react-icons/ai";
import { TbPokeball } from "react-icons/tb";
import { PlayerModal } from "@/components/PlayerModal";
import { EditNewsModal } from "@/components/EditNews";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { AuthContext } from "@/context/AuthContext";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";

const ConfirmDonation = () => {
  const [news, setNews] = React.useState([]);
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
  const [editNewsOpen, setEditNewsOpen] = React.useState(false);
  const [selectedNews, setSelectedNews] = React.useState({});
  const { currentUser } = useContext(AuthContext);
  const toast = useToast();
  const router = useRouter();

  const uuid = router.query.donation;

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

  const handleOpenPlayerModal = (player) => {
    setPlayerModalOpen(!playerModalOpen);
    setSelectedPlayer(player);
  };

  return (
    <>
      <Box bg="gray.800">
        <EditNewsModal
          setOpen={setEditNewsOpen}
          open={editNewsOpen}
          selectedNews={selectedNews}
        />
        <Container maxW={"8xl"} minH={"calc(100vh - 100px)"}>
          <Flex pt={10} justify={"center"}>
            <Heading color={"whitesmoke"}>Noticias</Heading>
          </Flex>
          <Grid
            templateColumns={"repeat(4, 1fr)"}
            spacing={10}
            mt={20}
            columnGap={7}
          >
            <GridItem colSpan={{ base: 4, md: 3 }}>
              <Flex
                justify={"center"}
                align={"center"}
                direction={"column"}
                bg="whitesmoke"
                borderRadius={"lg"}
                minH="lg"
                textAlign={"center"}
                gap={2}
              >
                <CheckCircleIcon boxSize={"100px"} color={"green.500"} />
                <Heading as="h2" size="xl" mt={6} mb={2}>
                  Doação concluida com sucesso!
                </Heading>
                <Heading size={"md"}>ID: {uuid}</Heading>
                <Text color={"gray.500"} as={"i"}>
                  Salve o id da sua compra para eventuais problemas, Não nos
                  responsabilizamos por compras sem id!
                </Text>
                <Text color={"gray.600"}>
                  Após a aprovação do pagamento nossa equipe tem um prazo de
                  48hrs para inserir as LoU Coins na sua conta
                </Text>
              </Flex>
            </GridItem>
            <GridItem
              colSpan={{ base: 0, md: 1 }}
              display={{ base: "none", md: "initial" }}
            >
              <Flex direction={"column"} gap={5}>
                <Stack
                  display="none"
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
                    <Flex direction="column" gap={2} w="full" py={2}>
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

export default ConfirmDonation;

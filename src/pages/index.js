import Header from "@/components/Header";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Image,
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  HStack,
  Divider,
  Center,
  SimpleGrid,
  Stack,
  Badge,
  CloseButton,
  IconButton,
  Tooltip,
  Fade,
  useDisclosure,
} from "@chakra-ui/react";
import Head from "next/head";
import { CgLogIn, CgWindows } from "react-icons/cg";
import { BsFillPhoneFill } from "react-icons/bs";
import { useRouter } from "next/router";
import { FaDownload } from "react-icons/fa";
import React, { useContext, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import axios from "axios";
import { TbBrandTwitch } from "react-icons/tb";
import {
  BiLogoInstagram,
  BiLogoFacebook,
  BiLogoDiscordAlt,
  BiLogoWhatsapp,
} from "react-icons/bi";
import { FaAngleLeft } from "react-icons/fa";
import { AiOutlineYoutube } from "react-icons/ai";
import { BsTwitterX } from "react-icons/bs";

export default function Home() {
  const [streams, setStreams] = React.useState([]);
  const [popUpStreamer, setPopUpStreamer] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const { isOpen, onToggle } = useDisclosure({
    defaultIsOpen: true,
  });
  const router = useRouter();
  const { currentUser } = useContext(AuthContext);

  const PopoverDownload = ({ children }) => {
    return (
      <Popover placement="bottom">
        <PopoverTrigger>
          <Box>{children}</Box>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader>
            <Heading
              fontSize="md"
              mx={{ base: "4", md: "2" }}
              textAlign={"center"}
            >
              FAÇA O DOWNLOAD AGORA MESMO!
            </Heading>
          </PopoverHeader>
          <PopoverBody>
            <Text as="i">
              Baixe o jogo agora mesmo, e venha fazer parte desta aventura. Faça
              novos amigos e traga seus amigos para se divertir junto com você.
            </Text>
          </PopoverBody>
          <PopoverFooter>
            <HStack>
              <Button
                w="full"
                as="a"
                href="/api/download"
                download
                leftIcon={<FaDownload />}
              >
                Direto
              </Button>
              <Button
                as="a"
                href="https://drive.google.com/file/d/1h291ukWDoT00pF97vOSGYFsbFgEjA67f/view"
                target="_blank"
                leftIcon={<FaDownload />}
                w="full"
              >
                Drive
              </Button>
            </HStack>
          </PopoverFooter>
        </PopoverContent>
      </Popover>
    );
  };

  const PopoverSocialMedias = ({ children }) => {
    return (
      <Popover placement="bottom">
        <PopoverTrigger>
          <Box>{children}</Box>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader>
            <Heading
              fontSize="md"
              mx={{ base: "4", md: "2" }}
              textAlign={"center"}
            >
              REDES SOCIAIS
            </Heading>
          </PopoverHeader>
          <PopoverBody>
            <Stack>
              <Button
                w="full"
                leftIcon={<BiLogoInstagram fontSize={"20px"} />}
                onClick={() =>
                  window.open(
                    "https://www.instagram.com/legends.of.unknown/",
                    "_blank"
                  )
                }
              >
                Instagram
              </Button>
              <Button
                w="full"
                leftIcon={<BiLogoFacebook fontSize={"20px"} />}
                onClick={() =>
                  window.open(
                    "https://www.facebook.com/LegendsofUnknown/",
                    "_blank"
                  )
                }
              >
                Facebook
              </Button>

              <Button
                w="full"
                leftIcon={<BiLogoDiscordAlt fontSize={"20px"} />}
                onClick={() =>
                  window.open("https://discord.gg/ZUgFphQ2nY", "_blank")
                }
              >
                Discord
              </Button>

              <Button
                w="full"
                leftIcon={<BiLogoWhatsapp fontSize={"20px"} />}
                onClick={() =>
                  window.open(
                    "https://chat.whatsapp.com/HpDYNUHgpoLGWEUFmHBQer",
                    "_blank"
                  )
                }
              >
                Whatsapp
              </Button>

              <Button
                w="full"
                leftIcon={<AiOutlineYoutube fontSize={"20px"} />}
                onClick={() =>
                  window.open(
                    "https://www.youtube.com/@LegendsofUnknown",
                    "_blank"
                  )
                }
              >
                Youtube
              </Button>

              <Button
                w="full"
                leftIcon={<BsTwitterX fontSize={"20px"} />}
                onClick={() =>
                  window.open("https://twitter.com/LegendsofUnk/", "_blank")
                }
              >
                Twitter
              </Button>
            </Stack>
          </PopoverBody>
          <PopoverFooter></PopoverFooter>
        </PopoverContent>
      </Popover>
    );
  };

  const getStreams = () => {
    setLoading(true);
    axios
      .get("/api/twitch/get-streams")
      .then((res) => {
        setStreams(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const getPopUpStreamer = () => {
    setLoading(true);
    axios
      .get("/api/twitch/get-pop-up-streamer")
      .then((res) => {
        setPopUpStreamer(res.data[0]);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getStreams();
    getPopUpStreamer();
  }, []);

  return (
    <>
      {loading && isOpen ? (
        <Box
          display={{ base: "none", md: "block" }}
          position={"fixed"}
          bottom={0}
          right={0}
          zIndex={10}
          bg="gray.900"
          borderRadius={"md"}
          w="xl"
          h="sm"
        >
          <Flex align={"center"} justify={"center"} h="full" w="full">
            <Stack>
              <Image src="/utils/ash.gif" w="100px" />
              <Text color={"white"}>Carregando...</Text>
            </Stack>
          </Flex>
        </Box>
      ) : isOpen ? (
        <Fade in={isOpen}>
          <Box
            display={popUpStreamer ? { base: "none", md: "block" } : "none"}
            position={"fixed"}
            bottom={0}
            right={0}
            zIndex={10}
            bg="gray.900"
            borderRadius={"md"}
            w="fit-content"
          >
            <HStack w="full" justify="end">
              <CloseButton alignSelf="end" color={"white"} onClick={onToggle} />
            </HStack>
            <Stack align="center" color={"white"} p={2} position={"relative"}>
              <Badge
                position={"absolute"}
                top={3}
                left={10}
                colorScheme={popUpStreamer ? "red" : "gray"}
                variant={"solid"}
              >
                {popUpStreamer ? popUpStreamer?.type : "Offline"}
              </Badge>
              {popUpStreamer ? (
                <iframe
                  src={popUpStreamer?.link}
                  height="250px"
                  width="550px"
                ></iframe>
              ) : (
                <Image src={"./offline.png"} height={"250px"} width={"550px"} />
              )}

              <Text
                overflowX={"hidden"}
                whiteSpace={"nowrap"}
                textOverflow={"ellipsis"}
                maxW="100%"
                px={2}
              >
                {popUpStreamer?.title}
              </Text>
              <Flex justify={"space-between"} align={"center"} w="full" px={2}>
                <Text alignSelf={"start"}>{popUpStreamer?.stream_owner}</Text>
                <Badge colorScheme="gray" variant={"solid"} mr={2}>
                  {popUpStreamer
                    ? `${popUpStreamer?.viewers} espectadores`
                    : "0 espectadores"}
                </Badge>
              </Flex>
              {popUpStreamer && (
                <Button
                  leftIcon={<TbBrandTwitch fontSize={"20px"} />}
                  bg="#a970ff"
                  _hover={{ bg: "#a970ff9c" }}
                  w="full"
                  onClick={() => {
                    window.open(popUpStreamer?.stream_link, "_blank");
                  }}
                >
                  Abrir Live
                </Button>
              )}
            </Stack>
          </Box>
        </Fade>
      ) : (
        <Tooltip label="Live">
          <IconButton
            display={{ base: "none", md: "flex" }}
            onClick={onToggle}
            position={"fixed"}
            bottom={40}
            right={0}
            zIndex={10}
            variant={"solid"}
            borderRightRadius={"none"}
            icon={<FaAngleLeft fontSize={"20px"} />}
          />
        </Tooltip>
      )}

      <Header />
      <Image
        src={"/logo_white.png"}
        w={[350, 450]}
        position={"absolute"}
        top="250px"
        left="50%"
        transform="translate(-50%, -50%)"
      />
      <Box bg={"gray.800"} py={100}>
        <Container maxW={"7xl"}>
          <Flex gap={10} flexDir={{ base: "column", md: "row" }}>
            <Box w={"full"}>
              <Button
                w={"full"}
                p={"50px"}
                rounded={"2xl"}
                size={"lg"}
                bg={"#1ba3b6"}
                colorScheme="none"
                color={"white"}
                leftIcon={<CgLogIn fontSize={"50px"} />}
                onClick={() => {
                  currentUser
                    ? router.push("/my-account")
                    : router.push("/sign-up");
                }}
              >
                {currentUser ? "MINHA CONTA" : "REGISTRO"}
              </Button>
              <Heading size={"md"} textAlign={"center"} mt={10} color={"white"}>
                Inicie sua jornada agora mesmo acessando sua conta.
              </Heading>
            </Box>
            <Box w={"full"}>
              <PopoverDownload>
                <Button
                  id="download"
                  w={"full"}
                  p={"50px"}
                  rounded={"2xl"}
                  size={"lg"}
                  bg={"#1ba3b6"}
                  colorScheme="none"
                  color={"white"}
                  leftIcon={<CgWindows fontSize={"50px"} />}
                >
                  DOWNLOAD
                </Button>
              </PopoverDownload>
              <Heading size={"md"} textAlign={"center"} mt={10} color={"white"}>
                Baixe nosso instalador para jogar.
              </Heading>
            </Box>
            <Box w={"full"}>
              <PopoverSocialMedias>
                <Button
                  p={"50px"}
                  w={"full"}
                  rounded={"2xl"}
                  size={"lg"}
                  bg={"#1ba3b6"}
                  color={"white"}
                  colorScheme="none"
                  leftIcon={<BsFillPhoneFill fontSize={"50px"} />}
                >
                  REDES SOCIAIS
                </Button>
              </PopoverSocialMedias>

              <Heading size={"md"} textAlign={"center"} mt={10} color={"white"}>
                Acesse nossas midias sociais para ficar atento a todas as
                novidades!
              </Heading>
            </Box>
          </Flex>
        </Container>
      </Box>
      <Box bg={"gray.800"} pb={10}>
        <Center mb={10}>
          <Divider w="80%" />
        </Center>
        <Container maxW={"7xl"}>
          <Heading textAlign={"center"} color={"white"} mb={20}>
            Parceiros Twitch
          </Heading>
          {loading ? (
            <Flex
              minH="xs"
              align={"center"}
              justify={"center"}
              direction={"column"}
              gap={4}
              color="white"
              my={20}
            >
              <Image src="/utils/ash.gif" w="100px" />
              <Text> Carregando... </Text>
            </Flex>
          ) : streams.length <= 0 ? (
            <Center color={"white"} my={20}>
              <Text>Não há streamers online no momento...</Text>
            </Center>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 3 }} gap={8} mb={20}>
              {streams.map((stream) => {
                return (
                  <Stack
                    align="center"
                    key={stream.id}
                    bg="gray.900"
                    color={"white"}
                    p={2}
                    borderRadius={"md"}
                    position={"relative"}
                  >
                    <Badge
                      position={"absolute"}
                      top={3}
                      left={4}
                      colorScheme="red"
                      variant={"solid"}
                    >
                      {stream.type}
                    </Badge>
                    <iframe
                      src={stream.link}
                      height="220px"
                      width="350px"
                    ></iframe>
                    <Text
                      overflowX={"hidden"}
                      whiteSpace={"nowrap"}
                      textOverflow={"ellipsis"}
                      maxW="100%"
                      px={2}
                    >
                      {stream.title}
                    </Text>
                    <Flex
                      justify={"space-between"}
                      align={"center"}
                      w="full"
                      px={2}
                    >
                      <Text alignSelf={"start"}>{stream.stream_owner}</Text>
                      <Badge colorScheme="gray" variant={"solid"} mr={2}>
                        {`${stream.viewers} espectadores`}
                      </Badge>
                    </Flex>
                    <Button
                      leftIcon={<TbBrandTwitch fontSize={"20px"} />}
                      bg="#a970ff"
                      _hover={{ bg: "#a970ff9c" }}
                      w="full"
                      onClick={() => {
                        window.open(stream.stream_link, "_blank");
                      }}
                    >
                      Abrir Live
                    </Button>
                  </Stack>
                );
              })}
            </SimpleGrid>
          )}
        </Container>
      </Box>
    </>
  );
}

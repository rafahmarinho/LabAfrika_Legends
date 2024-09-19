import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  useColorModeValue,
  useDisclosure,
  Image,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Container,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Divider,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
} from "@chakra-ui/react";
import React, { useContext, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import { BiUserCircle } from "react-icons/bi";
import { AiOutlineTrophy, AiOutlineSearch } from "react-icons/ai";
import { useRouter } from "next/router";
import { PiDownloadSimple, PiHouse, PiUser } from "react-icons/pi";
import { BiJoystick } from "react-icons/bi";
import { MdOutlineSearch } from "react-icons/md";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { RiCoinsLine } from "react-icons/ri";

function MobileNav() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const { currentUser } = useContext(AuthContext);

  function ComunityCollapse() {
    const { isOpen, onToggle } = useDisclosure();

    return (
      <>
        <Flex
          borderRadius={"md"}
          boxShadow={"lg"}
          align={"center"}
          gap={4}
          p={2}
          onClick={onToggle}
          cursor={"pointer"}
          w="full"
        >
          <BiJoystick fontSize="24px" />
          <Box fontSize="20px" w="full">
            <Flex align={"center"} justify={"space-between"}>
              <Text>Comunidade</Text>
              {isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </Flex>
          </Box>
        </Flex>

        <Collapse in={isOpen} animateOpacity bg="grey.100">
          <VStack spacing={2}>
            <Flex
              _hover={{ transform: "scale(1.1)" }}
              borderRadius={"md"}
              boxShadow={"md"}
              align={"center"}
              gap={4}
              p={2}
              px={4}
              onClick={() => router.push("/news")}
              cursor={"pointer"}
              w="full"
            >
              <Box fontSize="20px" w="full">
                Notícias
              </Box>
            </Flex>

            {/* <Flex
              _hover={{ transform: "scale(1.1)" }}
              borderRadius={"md"}
              boxShadow={"md"}
              align={"center"}
              gap={4}
              p={2}
              px={4}
              onClick={() => router.push("/server-info")}
              cursor={"pointer"}
              w="full"
            >
              <Box fontSize="20px">Informações do servidor</Box>
            </Flex> */}

            <Flex
              _hover={{ transform: "scale(1.1)" }}
              borderRadius={"md"}
              boxShadow={"md"}
              align={"center"}
              gap={4}
              p={2}
              px={4}
              onClick={() => router.push("/guilds")}
              cursor={"pointer"}
              w="full"
            >
              <Box fontSize="20px">Guilds</Box>
            </Flex>
            <Flex
              _hover={{ transform: "scale(1.1)" }}
              borderRadius={"md"}
              boxShadow={"md"}
              align={"center"}
              gap={4}
              p={2}
              px={4}
              onClick={() => router.push("/houses")}
              cursor={"pointer"}
              w="full"
            >
              <Box fontSize="20px">Casas</Box>
            </Flex>
            {/* <Flex
              _hover={{ transform: "scale(1.1)" }}
              borderRadius={"md"}
              boxShadow={"md"}
              align={"center"}
              gap={4}
              p={2}
              px={4}
              onClick={() => router.push("/maps")}
              cursor={"pointer"}
              w="full"
            >
              <Box fontSize="20px">Mapa</Box>
            </Flex> */}
            {/* <Flex
              _hover={{ transform: "scale(1.1)" }}
              borderRadius={"md"}
              boxShadow={"md"}
              align={"center"}
              gap={4}
              p={2}
              px={4}
              onClick={() => router.push("/maps")}
              cursor={"pointer"}
              w="full"
            >
              <Box fontSize="20px"></Box>
            </Flex> */}
          </VStack>
        </Collapse>
      </>
    );
  }

  return (
    <>
      <Button
        as={IconButton}
        icon={<RxHamburgerMenu fontSize="24px" />}
        display={{ base: "initial", md: "none" }}
        onClick={onOpen}
      ></Button>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader mb={4}></DrawerHeader>
          <DrawerBody>
            <VStack spacing={4}>
              <Flex
                _hover={{ transform: "scale(1.1)" }}
                borderRadius={"md"}
                boxShadow={"md"}
                align={"center"}
                gap={4}
                p={2}
                onClick={() => router.push("/")}
                cursor={"pointer"}
                w="full"
              >
                <PiHouse fontSize="24px" />
                <Box fontSize="20px">Inicio</Box>
              </Flex>
              <Flex
                _hover={{ transform: "scale(1.1)" }}
                borderRadius={"md"}
                boxShadow={"lg"}
                align={"center"}
                gap={4}
                p={2}
                onClick={() => router.replace("/#download")}
                cursor={"pointer"}
                w="full"
              >
                <PiDownloadSimple fontSize="24px" />
                <Box fontSize="20px">Downloads</Box>
              </Flex>
              <Flex
                _hover={{ transform: "scale(1.1)" }}
                borderRadius={"md"}
                boxShadow={"lg"}
                align={"center"}
                gap={4}
                p={2}
                onClick={() => router.push("/ranking")}
                cursor={"pointer"}
                w="full"
              >
                <AiOutlineTrophy fontSize="24px" />
                <Box fontSize="20px"> Ranking</Box>
              </Flex>

              <ComunityCollapse />

              <Flex
                _hover={{ transform: "scale(1.1)", bg: "#64c2e8" }}
                borderRadius={"md"}
                boxShadow={"lg"}
                align={"center"}
                gap={4}
                p={2}
                onClick={() => {
                  currentUser
                    ? router
                        .push("/my-account")
                        .then(() => document.querySelector("#donate").click())
                    : router.push("/login");
                }}
                cursor={"pointer"}
                w="full"
                bg="#64d0e8"
              >
                <RiCoinsLine fontSize="24px" />
                <Box fontSize="20px"> Doar</Box>
              </Flex>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

function MobileUserNav() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { currentUser, logout } = useContext(AuthContext);
  const router = useRouter();

  return (
    <>
      <Button
        as={IconButton}
        icon={<BiUserCircle fontSize="24px" />}
        display={{ base: "initial", md: "none" }}
        onClick={currentUser ? onOpen : () => router.push("/login")}
      ></Button>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader mb={4}>
            <Text w="full" overflowX={"hidden"}>
              {currentUser?.name}
            </Text>
          </DrawerHeader>
          <DrawerBody>
            <VStack spacing={4}>
              <Flex
                _hover={{ transform: "scale(1.1)" }}
                borderRadius={"md"}
                boxShadow={"md"}
                align={"center"}
                gap={4}
                p={2}
                onClick={() => router.push("/my-account")}
                cursor={"pointer"}
                w="full"
              >
                <Box fontSize="20px">Minha Conta</Box>
              </Flex>
              <Flex
                _hover={{ transform: "scale(1.1)" }}
                borderRadius={"md"}
                boxShadow={"lg"}
                align={"center"}
                gap={4}
                p={2}
                onClick={() => router.push("/my-guilds")}
                cursor={"pointer"}
                w="full"
              >
                <Box fontSize="20px">Minhas Guilds</Box>
              </Flex>
              <Flex
                _hover={{ transform: "scale(1.1)" }}
                borderRadius={"md"}
                boxShadow={"lg"}
                align={"center"}
                gap={4}
                p={2}
                onClick={() => router.push("/my-tickets")}
                cursor={"pointer"}
                w="full"
              >
                <Box fontSize="20px"> Meus Tickets</Box>
              </Flex>
              {currentUser && currentUser.group_id !== 1 && (
                <Flex
                  _hover={{ transform: "scale(1.1)" }}
                  borderRadius={"md"}
                  boxShadow={"lg"}
                  align={"center"}
                  gap={4}
                  p={2}
                  onClick={() => router.push("/admin-panel")}
                  cursor={"pointer"}
                  w="full"
                >
                  <Box fontSize="20px"> Administradores</Box>
                </Flex>
              )}
              <Flex
                _hover={{ transform: "scale(1.1)" }}
                borderRadius={"md"}
                boxShadow={"lg"}
                align={"center"}
                gap={4}
                p={2}
                onClick={() => logout()}
                cursor={"pointer"}
                w="full"
              >
                <Box fontSize="20px"> Sair</Box>
              </Flex>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default function WithSubnavigation({ children }) {
  const { currentUser, logout } = useContext(AuthContext);
  const router = useRouter();

  return (
    <>
      <Box>
        <Container maxW={"8xl"} bg="">
          <Flex
            color={useColorModeValue("gray.600", "white")}
            minH={"100px"}
            py={{ base: 2 }}
            px={{ base: 4 }}
            align={"center"}
          >
            <Flex
              flex={{ base: 1 }}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Image
                src="/logo_black.png"
                maxW={{ base: "6rem", md: "9rem" }}
                onClick={() => router.push("/")}
                cursor={"pointer"}
              />

              <Box display={{ base: "none", md: "block" }}>
                <InputGroup>
                  <Input
                    focusBorderColor="#19b9d9"
                    placeholder="Busque um player"
                    onChange={(e) =>
                      router.replace({
                        query: { search: e.target.value },
                        asPath: router.asPath,
                      })
                    }
                  />
                  <InputRightElement>
                    <MdOutlineSearch
                      cursor="pointer"
                      fontSize={"20px"}
                      onClick={() =>
                        router.replace({
                          pathname: "/search",
                          query: { ...router.query },
                        })
                      }
                    />
                  </InputRightElement>
                </InputGroup>
              </Box>

              <Flex
                align="center"
                gap={4}
                display={{ base: "flex", md: "none" }}
              >
                <Popover>
                  <PopoverTrigger>
                    <IconButton
                      icon={<AiOutlineSearch fontSize="20px" />}
                      aria-label={""}
                    />
                  </PopoverTrigger>
                  <PopoverContent>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverBody w="full">
                      <InputGroup>
                        <Input
                          placeholder="Busque um player"
                          bg={"gray.100"}
                          onChange={(e) =>
                            router.replace({
                              query: { search: e.target.value },
                              asPath: router.asPath,
                            })
                          }
                        />
                        <InputRightElement>
                          <IconButton
                            variant={"ghost"}
                            size={"sm"}
                            icon={<AiOutlineSearch fontSize="20px" />}
                            aria-label={""}
                            onClick={() =>
                              router.replace({
                                pathname: "/search",
                                query: router.query,
                              })
                            }
                          />
                        </InputRightElement>
                      </InputGroup>
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
                <MobileUserNav />
                <MobileNav />
              </Flex>

              <Stack
                display={{ base: "none", md: "flex" }}
                flex={{ base: 1, md: 0 }}
                justify={"flex-end"}
                direction={"row"}
                spacing={2}
              >
                <Button
                  size={"sm"}
                  leftIcon={<PiHouse fontSize="20px" />}
                  as="a"
                  cursor={"pointer"}
                  onClick={() => router.push("/")}
                  target="_blank"
                >
                  Ínicio
                </Button>
                <Button
                  onClick={() => router.replace("/#download")}
                  size={"sm"}
                  leftIcon={<PiDownloadSimple fontSize="20px" />}
                >
                  Downloads
                </Button>
                <Button
                  onClick={() => router.push("/ranking")}
                  size={"sm"}
                  leftIcon={<AiOutlineTrophy fontSize="20px" />}
                >
                  Ranking
                </Button>

                <Menu>
                  <MenuButton
                    as={Button}
                    size="sm"
                    leftIcon={<BiJoystick fontSize="20px" />}
                  >
                    Comunidade
                  </MenuButton>
                  <MenuList>
                    {/* <MenuItem onClick={() => router.push("/server-info")}>
                      Informações do servidor
                    </MenuItem> */}
                    <MenuItem onClick={() => router.push("/news")}>
                      Notícias
                    </MenuItem>
                    <MenuDivider />
                    <MenuItem onClick={() => router.push("/guilds")}>
                      Guilds
                    </MenuItem>
                    <MenuItem onClick={() => router.push("/houses")}>
                      Casas
                    </MenuItem>
                    {/* <MenuItem onClick={() => router.push("/maps")}>
                      Mapa
                    </MenuItem> */}
                  </MenuList>
                </Menu>

                <Button
                  bg="#64d0e8"
                  _hover={{
                    bg: "#64c2e8",
                  }}
                  color={"black"}
                  onClick={() => {
                    currentUser
                      ? router
                          .push("/my-account")
                          .then(() => document.querySelector("#donate").click())
                      : router.push("/login");
                  }}
                  size={"sm"}
                  leftIcon={<RiCoinsLine fontSize="20px" />}
                >
                  Doar
                </Button>

                {currentUser ? (
                  <Menu>
                    <MenuButton
                      as={Button}
                      size="sm"
                      leftIcon={<BiUserCircle fontSize="20px" />}
                      overflowX="hidden"
                    >
                      <Flex gap={1}>
                        <Text>Olá,</Text>
                        {currentUser?.nickname}
                      </Flex>
                    </MenuButton>
                    <MenuList>
                      <MenuItem onClick={() => router.push("/my-account")}>
                        Minha Conta
                      </MenuItem>
                      <MenuItem onClick={() => router.push("/my-guilds")}>
                        Minhas Guilds
                      </MenuItem>
                      <MenuItem onClick={() => router.push("/my-tickets")}>
                        Meus Tickets
                      </MenuItem>
                      {currentUser && currentUser.group_id !== 1 && (
                        <MenuItem onClick={() => router.push("/admin-panel")}>
                          Administradores
                        </MenuItem>
                      )}
                      <MenuItem onClick={() => logout()}>Sair</MenuItem>
                    </MenuList>
                  </Menu>
                ) : (
                  <Menu>
                    <MenuButton
                      as={Button}
                      size="sm"
                      leftIcon={<PiUser fontSize="25px" />}
                      onClick={() => router.push("/login")}
                    >
                      Login
                    </MenuButton>
                  </Menu>
                )}
              </Stack>
            </Flex>
          </Flex>
        </Container>
      </Box>
      <Box>
        <>{children}</>
      </Box>
    </>
  );
}

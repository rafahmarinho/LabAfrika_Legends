import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Box,
  useDisclosure,
  Text,
  Flex,
  ModalCloseButton,
  SimpleGrid,
  Image,
  Badge,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect } from "react";
import {
  TbPencilPlus,
  TbCrown,
  TbUsersGroup,
  TbFileDescription,
} from "react-icons/tb";
import { BiRename } from "react-icons/bi";
import { GrStatusCriticalSmall } from "react-icons/gr";

const GuildModal = ({ selectedGuild, open, setOpen }) => {
  const { isOpen, onClose } = useDisclosure({
    isOpen: open,
    onClose() {
      setOpen(!open);
    },
  });
  const [members, setMembers] = React.useState([]);

  useEffect(() => {
    if (selectedGuild && selectedGuild.id) {
      axios
        .get("/api/guild/list-members", {
          params: { guildId: selectedGuild.id },
        })
        .then((res) => {
          setMembers(res.data.allMembers);
        })
        .catch((err) => console.log(err));
    }
  }, [selectedGuild]);

  const checkRank = (guidLevel) => {
    if (guidLevel === "Leader") {
      return "Líder";
    } else if (guidLevel === "Vice-Leader") {
      return "Vice-Lider";
    } else {
      return "Membro";
    }
  };

  return (
    <>
      <Modal isCentered isOpen={isOpen} onClose={onClose} size={"3xl"}>
        <ModalOverlay />
        <ModalContent bg="gray.800">
          <ModalHeader color={"whitesmoke"}></ModalHeader>
          <ModalCloseButton color={"white"} />
          <ModalBody mt={2}>
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
                <TabPanel>
                  <SimpleGrid columns={{ base: 1, md: 1 }} fontSize={"lg"}>
                    <Image
                      w={"100%"}
                      src={selectedGuild.link ? selectedGuild?.link : "404.png"}
                      h="sm"
                      maxH={{ base: "3xs", md: "sm" }}
                    />
                    <Flex
                      w={{ base: "100%" }}
                      h="101%"
                      direction={"column"}
                      bg="gray.300"
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
                          <BiRename fontSize={"20px"} />
                          <Text>Nome:</Text>
                        </Flex>
                        <Flex
                          w="100%"
                          direction={"column"}
                          alignItems={"center"}
                          p={1}
                        >
                          <Text>{selectedGuild?.name}</Text>
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
                          <TbCrown fontSize={"20px"} />
                          <Text>Líder:</Text>
                        </Flex>
                        <Flex
                          w="100%"
                          direction={"column"}
                          alignItems={"center"}
                          p={1}
                        >
                          <Text>
                            {selectedGuild?.owner?.name || selectedGuild.owner}
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
                          <TbUsersGroup fontSize={"20px"} />
                          <Text>Membros:</Text>
                        </Flex>
                        <Flex
                          w="100%"
                          direction={"column"}
                          alignItems={"center"}
                          p={1}
                        >
                          <Text>{members.length}</Text>
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
                          <Text>
                            {selectedGuild?.creationdata?.split(",")[0]}
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
                          <TbFileDescription fontSize={"20px"} />
                          <Text>Descrição:</Text>
                        </Flex>
                        <Flex
                          w="100%"
                          direction={"column"}
                          alignItems={"center"}
                          p={1}
                        >
                          <Box
                            wordBreak={"break-all"}
                            maxH="8rem"
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
                            {selectedGuild.motd != "null"
                              ? selectedGuild.motd
                              : "--"}
                          </Box>
                        </Flex>
                      </Flex>
                    </Flex>
                  </SimpleGrid>
                </TabPanel>

                <TabPanel minH="sm">
                  <Flex
                    bg="whitesmoke"
                    direction={"column"}
                    p={2}
                    gap={4}
                    borderRadius={"lg"}
                    h={"sm"}
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
                    {members?.map((member) => {
                      return (
                        <Flex
                          flexWrap={{ base: "wrap", md: "nowrap" }}
                          borderRadius={"lg"}
                          p={4}
                          bg="gray.200"
                          key={member.id}
                          justifyContent={"space-between"}
                          align={"center"}
                        >
                          <Text w="80%" fontSize={"lg"}>
                            {member.name}
                          </Text>
                          <Flex gap={2} w={{ base: "30%", md: "100%" }}>
                            <Text>Level:</Text>
                            <Text>{member.level}</Text>
                          </Flex>
                          <Box w={{ base: "30%", md: "100%" }}>
                            <Badge borderRadius={"lg"} px={3}>
                              {checkRank(member.guild_level)}
                            </Badge>
                          </Box>

                          <Box>
                            <GrStatusCriticalSmall
                              color={member.online > 0 ? "green" : "red"}
                            />
                          </Box>
                        </Flex>
                      );
                    })}
                  </Flex>
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

export { GuildModal };

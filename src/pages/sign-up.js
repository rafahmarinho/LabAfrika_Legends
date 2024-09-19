import { ServerRolesModal } from "@/components/ServerRolesModal";
import { AuthContext } from "@/context/AuthContext";
import { ArrowBackIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Collapse,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  SimpleGrid,
  Stack,
  useToast,
  Checkbox,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import React from "react";
import { isEmail } from "validator";

const SingUp = () => {
  const [stap, setStap] = React.useState(0);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [nickname, setNickname] = React.useState("");
  const [name, setName] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [checkBox, setCheckBox] = React.useState(false);
  const toast = useToast();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const handleCreate = () => {
    if (!isEmail(email)) {
      toast({
        title: "Email inválido",
        description: "Por favor, insira um email válido",
        status: "error",
        position: "bottom",
        duration: 9000,
        isClosable: true,
      });
      return;
    }
    setLoading(true);
    axios
      .post("/api/auth/create", { email, password, nickname, name })
      .then((res) => {
        setLoading(false);
        router.push("/login");
      })
      .catch((err) => {
        setLoading(false);
        toast({
          title: err?.response?.data.split(":")[1].trim(),
          status: "error",
          position: "bottom",
          duration: 9000,
          isClosable: true,
        });
      });
  };

  return (
    <>
      <SimpleGrid
        columns={{ base: 1, md: 2 }}
        h={"calc(100vh - 100px)"}
        bgImage={"/image3.png"}
        bgRepeat={"no-repeat"}
        bgSize={"cover"}
      >
        <Flex
          display={{ base: "none", md: "flex" }}
          justifyContent={"center"}
          flexDir={"column"}
          p={10}
        >
          <Heading
            size={{ base: "lg", md: "4xl" }}
            color={"white"}
            mb={{ base: 10, md: 100 }}
          >
            CRIAR CONTA
          </Heading>
        </Flex>

        <Center>
          <Box
            borderRadius={"md"}
            h={{ base: "100%", md: "auto" }}
            w={{ base: "100%", md: "auto" }}
            bg="gray.100"
            px={50}
            py={{ base: 10, md: 100 }}
          >
            <Flex
              align={"center"}
              display={{ base: "flex", md: "none" }}
              justifyContent={"center"}
              flexDir={"column"}
              gap={10}
            >
              <Heading
                size={{ base: "lg", md: "4xl" }}
                color={"black"}
                textAlign={"center"}
                mb={{ base: 10, md: 100 }}
              >
                CRIAR UMA CONTA
              </Heading>
            </Flex>
            {stap > 0 && (
              <IconButton
                icon={<ArrowBackIcon fontSize={"2xl"} />}
                onClick={() => setStap(stap - 1)}
                isDisabled={stap === 0}
              />
            )}
            <Heading
              size={"lg"}
              align="center"
              my={{ base: 0, md: 10 }}
              color={"black"}
            >
              Junte-se a nós nessa jornada!
            </Heading>
            <Stack mt={6}>
              <Collapse in={stap === 0} animateOpacity>
                <Stack color={"black"}>
                  <FormControl>
                    <FormLabel>Seu nome</FormLabel>
                    <Input
                      bg="white"
                      size={"lg"}
                      value={nickname}
                      focusBorderColor="#11cfe9"
                      onChange={(e) => setNickname(e.target.value)}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Usuário</FormLabel>
                    <Input
                      bg="white"
                      size={"lg"}
                      value={name}
                      focusBorderColor="#11cfe9"
                      onChange={(e) => setName(e.target.value)}
                    />
                  </FormControl>
                </Stack>
              </Collapse>
              <Collapse in={stap === 1} animateOpacity>
                <FormControl>
                  <FormLabel>E-mail</FormLabel>
                  <Input
                    bg="white"
                    size={"lg"}
                    value={email}
                    type="email"
                    focusBorderColor="#11cfe9"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormControl>
              </Collapse>
              <Collapse in={stap === 2} animateOpacity>
                <Stack spacing={5}>
                  <FormControl>
                    <FormLabel>Senha</FormLabel>
                    <Input
                      bg="white"
                      size={"lg"}
                      value={password}
                      focusBorderColor="#11cfe9"
                      type="password"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Confirme sua senha</FormLabel>
                    <Input
                      bg="white"
                      size={"lg"}
                      focusBorderColor="#11cfe9"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </FormControl>
                  <Flex
                    alignItems={"center"}
                    gap={2}
                    direction={{ base: "column", md: "row" }}
                  >
                    <Checkbox onChange={(e) => setCheckBox(e.target.checked)} />{" "}
                    Declaro que li e concordo com todas as <ServerRolesModal />
                  </Flex>
                </Stack>
              </Collapse>
            </Stack>
            <Center mt={50} gap={10} flexDir={"column"}>
              <IconButton
                isLoading={loading}
                variant={"outline"}
                p={10}
                h={50}
                w={50}
                onClick={() => {
                  if (stap < 2) {
                    setStap(stap + 1);
                  } else {
                    handleCreate();
                  }
                }}
                isDisabled={
                  (!email && stap === 1) ||
                  (!password && stap === 2) ||
                  (!confirmPassword && stap === 2) ||
                  (!nickname && stap === 0) ||
                  (!name && stap === 0) ||
                  (password !== confirmPassword && stap === 2) ||
                  (!checkBox && stap === 2)
                }
                rounded={"lg"}
                icon={<ChevronRightIcon fontSize={"70px"} color={"gray"} />}
              />
              <Button
                variant={"link"}
                onClick={() => router.replace("/login")}
                color={"blackAlpha.500"}
              >
                Já tem uma conta?
              </Button>
            </Center>
          </Box>
        </Center>
      </SimpleGrid>
    </>
  );
};

export default SingUp;

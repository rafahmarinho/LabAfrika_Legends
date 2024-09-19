import { RecoveryPassword } from "@/components/RecoveryModal";
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
  HStack,
  Heading,
  IconButton,
  Input,
  PinInput,
  PinInputField,
  SimpleGrid,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import Cokkies from "js-cookie";

const Login = () => {
  const [stap, setStap] = React.useState(0);
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const { login } = React.useContext(AuthContext);
  const router = useRouter();
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const [twoFactorAuth, setTwoFactorAuth] = React.useState(false);
  const [pinInput, setPinInput] = React.useState("");
  const toast = useToast();
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    if (router.asPath === "/login" && currentUser) {
      router.push("/my-account");
    }
  }, [router.asPath, currentUser]);

  const handleLogin = async () => {
    setLoading(true);
    await login({ name, password })
      .then((res) => {
        setTwoFactorAuth(res.twoFactorAuth);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const handleTwoFactorLogin = async () => {
    setLoading(true);
    await axios
      .post("/api/auth/two-factor-auth", { code: pinInput })
      .then((res) => {
        setCurrentUser(res.data.user);
        Cokkies.set("token", res.data.token, { expires: 1 });
        router.push("/my-account");
        toast({
          title: "Login efetuado com sucesso!",
          status: "success",
          duration: 9000,
          position: "bottom",
          isClosable: true,
        });
        setLoading(false);
      })
      .catch((err) => {
        toast({
          title: err?.response?.data.split(":")[1].trim(),
          status: "error",
          position: "bottom",
          duration: 9000,
          isClosable: true,
        });
        setLoading(false);
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
            FAZER LOGIN
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
            {twoFactorAuth ? (
              <Stack spacing={10}>
                <Center>
                  <Text>Informe o código:</Text>
                </Center>
                <HStack>
                  <PinInput
                    type="alphanumeric"
                    onChange={(e) => setPinInput(e)}
                  >
                    <PinInputField
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleTwoFactorLogin()
                      }
                    />
                    <PinInputField
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleTwoFactorLogin()
                      }
                    />
                    <PinInputField
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleTwoFactorLogin()
                      }
                    />
                    <PinInputField
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleTwoFactorLogin()
                      }
                    />
                    <PinInputField
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleTwoFactorLogin()
                      }
                    />
                    <PinInputField
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleTwoFactorLogin()
                      }
                    />
                  </PinInput>
                </HStack>
                <Center>
                  <IconButton
                    isLoading={loading}
                    variant={"outline"}
                    p={10}
                    h={50}
                    w={50}
                    onClick={handleTwoFactorLogin}
                    rounded={"lg"}
                    icon={<ChevronRightIcon fontSize={"70px"} color={"gray"} />}
                  />
                </Center>
              </Stack>
            ) : (
              <>
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
                    FAZER LOGIN
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
                <Stack mt={6} color={"black"}>
                  <Collapse in={stap === 0} animateOpacity>
                    <FormControl>
                      <FormLabel>Nome de usuário</FormLabel>
                      <Input
                        bg="white"
                        size={"lg"}
                        value={name}
                        focusBorderColor="#11cfe9"
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={(e) => {
                          e.code === "Enter" && setStap(stap + 1);
                        }}
                      />
                    </FormControl>
                  </Collapse>
                  <Collapse in={stap === 1} animateOpacity>
                    <Stack spacing={5}>
                      <FormControl>
                        <FormLabel>Senha</FormLabel>
                        <Input
                          onKeyDown={(e) => {
                            e.code === "Enter" && handleLogin();
                          }}
                          bg="white"
                          size={"lg"}
                          value={password}
                          focusBorderColor="#11cfe9"
                          type="password"
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </FormControl>
                    </Stack>
                  </Collapse>
                </Stack>
                <Center mt={50} gap={10} flexDir={"column"}>
                  <IconButton
                    variant={"outline"}
                    p={10}
                    h={50}
                    w={50}
                    onClick={() => {
                      if (stap < 1) {
                        setStap(stap + 1);
                      } else {
                        handleLogin();
                      }
                    }}
                    isDisabled={
                      (stap === 0 && !name) || (stap === 1 && !password)
                    }
                    rounded={"lg"}
                    icon={<ChevronRightIcon fontSize={"70px"} color={"gray"} />}
                    isLoading={loading}
                  />
                  <Flex gap={4} align={"center"}>
                    <RecoveryPassword />
                    <Text color="gray.500"> |</Text>
                    <Button
                      color={"blackAlpha.500"}
                      variant={"link"}
                      onClick={() => router.replace("/sign-up")}
                    >
                      Criar uma nova conta
                    </Button>
                  </Flex>
                </Center>
              </>
            )}
          </Box>
          ;
        </Center>
      </SimpleGrid>
    </>
  );
};

export default Login;

import { AuthContext } from "@/context/AuthContext";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Box,
  useDisclosure,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Stack,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  useToast,
  Text,
  FormHelperText,
  InputLeftAddon,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useContext } from "react";
import { TbEye, TbEyeClosed } from "react-icons/tb";
import { IoDiamondOutline, IoLink } from "react-icons/io5";
import { useRouter } from "next/router";
import { RiCoinsLine } from "react-icons/ri";

export const DonationModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { currentUser } = useContext(AuthContext);
  const [response, setResponse] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const [value, setValue] = React.useState("");

  const handleDonation = (value, cupom) => {
    setLoading(true);
    axios
      .post("/api/pagbank/checkout", {
        donationValue: value,
        accountId: currentUser.id,
        cupom: cupom,
      })
      .then((res) => {
        setLoading(false);
        setResponse(res.data);
        toast({
          title: "Link de pagamento gerado com sucesso!",
          status: "success",
          position: "bottom",
          duration: 9000,
          isClosable: true,
        });
      })
      .catch((err) => {
        setLoading(false);
        toast({
          title: err?.response?.data,
          status: "error",
          position: "bottom",
          duration: 9000,
          isClosable: true,
        });
      });
  };

  const handleChange = (event) => {
    let inputValue = event.target.value;

    inputValue = inputValue.replace(/[^\d]/g, "");

    inputValue = inputValue.replace(/(\.\d{2})\d+$/, "$1");

    let cents = parseInt(inputValue || "0", 10);

    let formattedValue = (cents / 100).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
    });

    setValue(formattedValue);
  };

  return (
    <>
      <Button
        w="100%"
        bg="#64d0e8"
        _hover={{
          bg: "#64c2e8",
        }}
        leftIcon={<RiCoinsLine fontSize={"20px"} color={"black"} />}
        onClick={onOpen}
        id="donate"
      >
        Doar
      </Button>
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign={"center"}>
            <Text fontSize={"lg"}>Doe para ajudar nosso servidor!</Text>
            <Text fontSize="sm" as="i" color="gray.500">
              Para cada 1 real doado, você receberá 1 LoU coin
            </Text>
          </ModalHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleDonation(e.target.donation.value, e.target.cupom.value);
            }}
          >
            <ModalBody>
              <Stack spacing={4}>
                <FormControl>
                  <FormLabel>Qual valor deseja doar?</FormLabel>
                  <InputGroup>
                    <InputLeftAddon>R$</InputLeftAddon>
                    <Input
                      type="text"
                      placeholder="R$"
                      name="donation"
                      value={value}
                      onChange={handleChange}
                    />
                  </InputGroup>
                </FormControl>

                <FormControl>
                  <FormLabel>Cupom</FormLabel>
                  <Input
                    type="text"
                    placeholder="Digite seu cupom"
                    name="cupom"
                  />
                </FormControl>
              </Stack>
            </ModalBody>
            <ModalFooter>
              <Stack w="full" spacing={6}>
                <Flex w="full" gap={3}>
                  <Button
                    w="100%"
                    colorScheme="blue"
                    type="submit"
                    isLoading={loading}
                  >
                    Gerar pagamento
                  </Button>
                  <Button w="100%" variant="ghost" onClick={onClose}>
                    Cancelar
                  </Button>
                </Flex>
                {response && (
                  <Flex direction={"column"} align={"center"} gap={2}>
                    <Text>{response.msg}</Text>
                    <Button
                      w="full"
                      leftIcon={<IoLink />}
                      onClick={() => router.replace(response.href)}
                      colorScheme={"green"}
                    >
                      Pagamento
                    </Button>
                  </Flex>
                )}
              </Stack>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

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
} from "@chakra-ui/react";
import axios from "axios";
import React, { useContext } from "react";
import { TbEye, TbEyeClosed } from "react-icons/tb";

export const ChangePasswordModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [oldPassword, setOldPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [show, setShow] = React.useState(false);
  const toast = useToast();
  const { currentUser } = useContext(AuthContext);

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "As senhas precisam ser iguais",
        status: "error",
        position: "top-right",
        duration: 9000,
        isClosable: true,
      });
    } else {
      axios
        .put("/api/account/change-password", {
          oldPassword,
          newPassword,
          userId: currentUser.id,
        })
        .then((res) => {
          toast({
            title: "Senha alterada com sucesso!",
            status: "success",
            position: "top-right",
            duration: 9000,
            isClosable: true,
          });
          onClose();
        })
        .catch((err) => {
          toast({
            title: err?.response?.data.split(":")[1].trim(),
            status: "error",
            position: "top-right",
            duration: 9000,
            isClosable: true,
          });
        });
    }
  };

  return (
    <>
      <Box onClick={onOpen} w="100%">
        {children}
      </Box>
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Center fontSize={"lg"}>Alterar Senha</Center>
          </ModalHeader>
          <ModalBody>
            <Stack spacing={4}>
              <FormControl>
                <FormLabel>Senha antiga</FormLabel>
                <InputGroup size="md">
                  <Input
                    type={show ? "text" : "password"}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                  <InputRightElement>
                    <IconButton
                      _hover={{ bg: "transparent" }}
                      variant={"ghost"}
                      icon={show ? <TbEyeClosed /> : <TbEye />}
                      onClick={() => setShow(!show)}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <FormControl>
                <FormLabel>Nova senha</FormLabel>
                <InputGroup size="md">
                  <Input
                    type={show ? "text" : "password"}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <InputRightElement>
                    <IconButton
                      _hover={{ bg: "transparent" }}
                      variant={"ghost"}
                      icon={show ? <TbEyeClosed /> : <TbEye />}
                      onClick={() => setShow(!show)}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <FormControl>
                <FormLabel>Confirme nova senha</FormLabel>
                <InputGroup size="md">
                  <Input
                    type={show ? "text" : "password"}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <InputRightElement>
                    <IconButton
                      _hover={{ bg: "transparent" }}
                      variant={"ghost"}
                      icon={show ? <TbEyeClosed /> : <TbEye />}
                      onClick={() => setShow(!show)}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Flex w="full" gap={3}>
              <Button
                w="100%"
                colorScheme="blue"
                onClick={() => {
                  handleChangePassword();
                }}
              >
                Alterar
              </Button>
              <Button w="100%" variant="ghost" onClick={onClose}>
                Cancelar
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

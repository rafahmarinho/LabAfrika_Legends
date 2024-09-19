import {
  Button,
  FormControl,
  FormLabel,
  Input,
  SimpleGrid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";

export function RecoveryPassword() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleRecovery = ({ name, recoveryKey, password, confirmPassword }) => {
    if (password !== confirmPassword) {
      toast({
        title: "As senhas precisam ser iguais",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } else {
      axios
        .put("/api/auth/recovery", {
          name,
          recoveryKey,
          password,
        })
        .then(() => {
          toast({
            title: "Senha alterada com sucesso!",
            status: "success",
            duration: 9000,
            isClosable: true,
          });
          onClose();
        })
        .catch((err) => {
          toast({
            title: err?.response?.data.split(":")[1].trim(),
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        });
    }
  };
  return (
    <>
      <Button onClick={onOpen} variant={"link"} color={"blackAlpha.500"}>
        Esqueci minha senha
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        scrollBehavior="inside"
        isCentered
        size={"lg"}
      >
        <ModalOverlay />
        <ModalContent rounded={"sm"} bg={"whitesmoke"}>
          <ModalHeader>Recuperar senha</ModalHeader>
          <ModalCloseButton />
          <form
            onSubmit={(e) => {
              e.preventDefault();

              handleRecovery({
                name: e.target.name.value,
                recoveryKey: e.target.recoveryKey.value,
                password: e.target.password.value,
                confirmPassword: e.target.confirmPassword.value,
              });
            }}
          >
            <ModalBody>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Usuário</FormLabel>
                  <Input name="name" />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Recovery Key</FormLabel>
                  <Input name="recoveryKey" />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Nova senha</FormLabel>
                  <Input name="password" type="password" />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Confirme sua nova senha</FormLabel>
                  <Input name="confirmPassword" type="password" />
                </FormControl>
              </SimpleGrid>
            </ModalBody>
            <ModalFooter>
              <Button mr={3} onClick={onClose} variant="ghost">
                Fechar
              </Button>
              <Button type="submit" colorScheme="blue">
                Enviar
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}

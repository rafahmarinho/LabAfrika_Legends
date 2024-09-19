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
  Text,
  Center,
  Flex,
  useToast,
  ModalCloseButton,
  Image,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useContext } from "react";

export const RecoveryKeyModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = React.useState(false);
  const [key, setKey] = React.useState(null);
  const { currentUser } = useContext(AuthContext);

  const handleGenerate = () => {
    setLoading(true);
    axios
      .post(`/api/account/generate-key`, {
        userId: currentUser?.id,
      })
      .then((res) => {
        setKey(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  return (
    <>
      <Box onClick={onOpen} w="100%">
        {children}
      </Box>
      <Modal isCentered isOpen={isOpen} onClose={onClose} size={"xl"}>
        <ModalOverlay />

        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>
            <Center fontSize={"lg"}>Recovery key</Center>
          </ModalHeader>
          <ModalBody>
            <Box>
              {loading ? (
                <Flex align={"center"} direction={"column"} gap={2}>
                  <Image src="/utils/ash.gif" alt="ash" maxW="50px" />
                  <Text>Gerando recovery key...</Text>
                </Flex>
              ) : (
                <Flex direction={"column"} gap={6} align={"center"}>
                  <Text fontSize={"xl"}>{key ? key : null}</Text>
                  <Text as={"i"}>
                    Salve sua chave, essa não pode ser recuperada
                  </Text>
                </Flex>
              )}
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button
              w="full"
              onClick={handleGenerate}
              colorScheme={"blue"}
              isLoading={loading}
              isDisabled={key ? true : false}
            >
              Gerar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

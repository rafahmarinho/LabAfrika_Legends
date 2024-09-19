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
} from "@chakra-ui/react";
import React from "react";

export const ConfirmModal = ({ onConfirm, title, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box onClick={onOpen}>{children}</Box>
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Center fontSize={"lg"}>{title}</Center>
          </ModalHeader>
          <ModalBody>
            <Center>
              <Text as="i">Esta ação não poderá ser desfeita</Text>
            </Center>
          </ModalBody>
          <ModalFooter>
            <Flex w="full" gap={3}>
              <Button
                w="100%"
                colorScheme="blue"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
              >
                Confirmar
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

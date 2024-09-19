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
  FormControl,
  FormLabel,
  Stack,
  Input,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import dynamic from "next/dynamic";

export const EditNewsModal = ({ open, setOpen, selectedNews }) => {
  const { isOpen, onClose } = useDisclosure({
    isOpen: open,
    onClose() {
      setOpen(!open);
    },
  });
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");
  const toast = useToast();

  useEffect(() => {
    if (selectedNews) {
      setTitle(selectedNews.title);
      setBody(selectedNews.body);
    } else {
      setTitle("");
      setBody("");
    }
  }, [selectedNews]);

  const handleEdit = (title, body, newsId) => {
    axios
      .put(`/api/admin/edit-news`, {
        newsId,
        title,
        body,
      })
      .then((res) => {
        toast({
          title: "Notícia editada com sucesso!",
          status: "success",
          position: "top-right",
          duration: 9000,
          isClosable: true,
        });
        onClose();
      })
      .catch((err) => {
        toast({
          title: "Erro ao editar notícia!",
          status: "error",
          position: "top-right",
          duration: 9000,
          isClosable: true,
        });
        onClose();
      });
  };

  const toolbarOptions = [
    ["bold", "italic", "underline", "strike"],
    ["blockquote", "code-block"],
    [{ header: 1 }, { header: 2 }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ script: "sub" }, { script: "super" }],
    [{ indent: "-1" }, { indent: "+1" }],
    ["image", "link"],
    [{ direction: "rtl" }],
    [{ size: ["small", false, "large", "huge"] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ color: [] }, { background: [] }],
    [{ font: [] }],
    [{ align: [] }],
    ["clean"],
  ];

  return (
    <>
      <Modal
        isCentered
        isOpen={isOpen}
        onClose={onClose}
        size={"6xl"}
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Center fontSize={"lg"}>{title}</Center>
          </ModalHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleEdit(title, body, selectedNews.id);
            }}
          >
            <ModalBody>
              <Stack>
                <FormControl>
                  <FormLabel>Título</FormLabel>
                  <Input
                    name="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </FormControl>
                <Box>
                  <FormControl>
                    <FormLabel>Corpo da noticia</FormLabel>
                    <ReactQuill
                      style={{ height: "23rem" }}
                      theme="snow"
                      modules={{ toolbar: toolbarOptions }}
                      value={body}
                      onChange={setBody}
                    />
                  </FormControl>
                </Box>
              </Stack>
            </ModalBody>

            <ModalFooter>
              <Flex w="full" gap={3}>
                <Button w="100%" colorScheme="blue" type="submit">
                  Confirmar
                </Button>
                <Button w="100%" variant="ghost" onClick={onClose}>
                  Cancelar
                </Button>
              </Flex>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

"use client";

import {
  Box,
  chakra,
  Container,
  Image,
  Stack,
  Text,
  useColorModeValue,
  VisuallyHidden,
} from "@chakra-ui/react";
import {
  FaInstagram,
  FaFacebookF,
  FaDiscord,
  FaWhatsapp,
} from "react-icons/fa";
import { ReactNode } from "react";

const Logo = (props) => {
  return (
    <Image
      display={{ base: "none", md: "block" }}
      src="logo_black.png"
      maxW={"100px"}
    />
  );
};

const SocialButton = ({ children, label, href }) => {
  return (
    <chakra.button
      bg={useColorModeValue("blackAlpha.100", "whiteAlpha.100")}
      rounded={"full"}
      w={8}
      h={8}
      cursor={"pointer"}
      as={"a"}
      href={href}
      display={"inline-flex"}
      alignItems={"center"}
      justifyContent={"center"}
      transition={"background 0.3s ease"}
      _hover={{
        bg: useColorModeValue("blackAlpha.200", "whiteAlpha.200"),
      }}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  );
};

export default function SmallWithLogoLeft() {
  return (
    <Box
      bg={useColorModeValue("gray.50", "gray.900")}
      color={useColorModeValue("gray.700", "gray.200")}
    >
      <Container
        as={Stack}
        maxW={"6xl"}
        py={4}
        direction={{ base: "column", md: "row" }}
        spacing={4}
        justify={{ base: "center", md: "space-between" }}
        align={{ base: "center", md: "center" }}
      >
        <Logo />
        <Text textAlign={"center"} p={{ base: 3, md: 6 }}>
          Legends of Unknown BRAZIL fan site 2024.
          <br /> Pokémon Copyright © 1995 - 2024 Nintendo/Creatures Inc./GAME
          FREAK Inc. Pokémon And All Respective Names are Trademarks of
          Nintendo. <br /> Legends of Unknown is not affiliated with Nintendo,
          Creatures Inc. and GAME FREAK Inc.
        </Text>
        <Stack direction={"row"} spacing={6}>
          <SocialButton
            label={"Instagram"}
            href={"https://www.instagram.com/legends.of.unknown/"}
          >
            <FaInstagram />
          </SocialButton>
          <SocialButton
            label={"Facebook"}
            href={"https://www.facebook.com/LegendsofUnknown/"}
          >
            <FaFacebookF />
          </SocialButton>
          <SocialButton
            label={"Discord"}
            href={"https://discord.gg/ZUgFphQ2nY"}
          >
            <FaDiscord />
          </SocialButton>
          <SocialButton
            label={"Whatsapp"}
            href={"https://chat.whatsapp.com/HpDYNUHgpoLGWEUFmHBQer"}
          >
            <FaWhatsapp />
          </SocialButton>
        </Stack>
      </Container>
    </Box>
  );
}

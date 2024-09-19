import WithSubnavigation from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";
import theme from "@/styles/theme";
import { ChakraProvider } from "@chakra-ui/react";
import SmallWithLogoLeft from "@/components/Footer";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <WithSubnavigation>
          <Head>
            <title>Legends of Unknown</title>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <link rel="icon" href="fav-icon.png" type="image/png" />
          </Head>
          <Component {...pageProps} />
          <SmallWithLogoLeft />
        </WithSubnavigation>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default MyApp;

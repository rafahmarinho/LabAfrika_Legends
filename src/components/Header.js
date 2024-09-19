import React from "react";
import { Box, keyframes } from "@chakra-ui/react";
import Slider from "react-slick";

const settings = {
  dots: false,
  arrows: false,
  fade: true,
  infinite: true,
  autoplay: true,
  pauseOnHover: false,
  speed: 2000,
  autoplaySpeed: 5000,
  slidesToShow: 1,
  slidesToScroll: 1,
};

export default function Header({ height = { base: "85vh", md: "100vh" } }) {
  const cards = [
    {
      image: "/bg-full.png",
    },
    // {
    //   image: "/1.png",
    // },
    // {
    //   image: "/2.png",
    // },
    // {
    //   image: "/3.png",
    // },
    // {
    //   image: "/4.png",
    // },
    // {
    //   image: "/5.png",
    // },
    // {
    //   image: "/6.png",
    // },
    // {
    //   image: "/7.png",
    // },
    // {
    //   image: "/8.png",
    // },
    // {
    //   image: "/9.png",
    // },
    // {
    //   image: "/10.png",
    // },
    // {
    //   image: "/11.png",
    // },
    // {
    //   image: "/12.png",
    // },
    // {
    //   image: "/13.png",
    // },
    // {
    //   image: "/14.png",
    // },
    // {
    //   image: "/15.png",
    // },
    // {
    //   image: "/16.png",
    // },
    // {
    //   image: "/17.png",
    // },
    // {
    //   image: "/image.png",
    // },
    // {
    //   image: "/image1.png",
    // },
    // {
    //   image: "/image2.png",
    // },
    // {
    //   image: "/image3.png",
    // },
    // {
    //   image: "/image4.png",
    // },
  ];

  const pulse = keyframes({
    "0%": {
      transform: "scale(1.5)",
    },
    "50%": {
      transform: "scale(1.3)",
    },
    "100%": {
      transform: "scale(1.0)",
    },
  });

  return (
    <Box
      position={"relative"}
      height={height}
      width={"full"}
      overflow={"hidden"}
    >
      <link
        rel="stylesheet"
        type="text/css"
        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
      />
      <link
        rel="stylesheet"
        type="text/css"
        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
      />
      <Slider {...settings}>
        {cards.map((card, index) => (
          <Box
            key={index}
            height={height}
            position="relative"
            backgroundPosition="center"
            backgroundRepeat="no-repeat"
            backgroundSize="cover"
            filter={"brightness(0.7)"}
            animation={`${pulse} 20s infinite linear alternate`}
            backgroundImage={`url(${card.image})`}
          ></Box>
        ))}
      </Slider>
    </Box>
  );
}

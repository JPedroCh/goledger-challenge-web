import { Box, Button, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box
      bgGradient={"radialGradient"}
      h="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDir="column"
    >
      <Text
        fontSize={{ smDown: "5xl", sm: "7xl", md: "9xl" }}
        color="primary"
        fontFamily="heading"
        wordWrap="normal"
        textAlign="center"
        padding="1rem"
      >
        Harmonic Groove ♪
      </Text>
      <Button
        marginTop={"50px"}
        padding={"25px"}
        border={"1px solid "}
        color={"primary"}
        backgroundColor={"transparent"}
        borderRadius={"50px"}
        _hover={{
          transform: "scale(1.01)",
          bgColor: "primary",
          color: "white",
        }}
        onClick={() => navigate("/artists")}
      >
        Groove to your favorite sound!
      </Button>
    </Box>
  );
};

export default Home;

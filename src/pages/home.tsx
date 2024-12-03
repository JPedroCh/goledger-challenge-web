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
      <Text fontSize="9xl" color="primary" fontFamily="heading">
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
          bgColor: "tertiary",
        }}
        onClick={() => navigate("/groove")}
      >
        Groove to your favorite sound!
      </Button>
    </Box>
  );
};

export default Home;

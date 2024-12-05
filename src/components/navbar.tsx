import { Flex, Text } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Flex
      gap="4"
      justifyContent="center"
      bgColor="primary"
      padding="1rem"
      alignItems="center"
      zIndex="sticky"
    >
      <Text
        fontSize="36px"
        color="quaternary"
        fontFamily="heading"
        position="fixed"
        left="1rem"
        onClick={() => navigate("/")}
        _hover={{ cursor: "pointer" }}
      >
        Harmonic Groove ♪
      </Text>
      <Flex gap="4">
        <Text
          color="quaternary"
          onClick={() => navigate("/artists")}
          textDecor={location.pathname === "/artists" ? "underline" : "none"}
          _hover={{ cursor: "pointer" }}
        >
          Artists
        </Text>
        <Text
          color="quaternary"
          onClick={() => navigate("/albums")}
          textDecor={location.pathname === "/albums" ? "underline" : "none"}
          _hover={{ cursor: "pointer" }}
        >
          Albums
        </Text>
        <Text
          color="quaternary"
          onClick={() => navigate("/songs")}
          textDecor={location.pathname === "/songs" ? "underline" : "none"}
          _hover={{ cursor: "pointer" }}
        >
          Songs
        </Text>
        <Text
          color="quaternary"
          onClick={() => navigate("/playlists")}
          textDecor={location.pathname === "/playlists" ? "underline" : "none"}
          _hover={{ cursor: "pointer" }}
        >
          Playlists
        </Text>
      </Flex>
    </Flex>
  );
}

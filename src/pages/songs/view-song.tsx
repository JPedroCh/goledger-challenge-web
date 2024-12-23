import { useEffect, useState } from "react";
import Navbar from "../../components/navbar";
import { Box, Flex, Stack, Text } from "@chakra-ui/react";
import { Toaster } from "../../components/toaster";
import { useLocation, useNavigate } from "react-router-dom";
import { DataListItem, DataListRoot } from "../../components/data-list";
import { Button } from "../../components/button";
import { handleFetchArtistInfo } from "../../services/artists";
import { handleFetchAlbumInfo } from "../../services/albums";
import { SkeletonText } from "../../components/skeleton";

const ViewSong = () => {
  const [albumCompleteInfo, setAlbumCompleteInfo] = useState<Album | null>(
    null
  );
  const [artistCompleteInfo, setArtistCompleteInfo] = useState<Artist | null>(
    null
  );
  const location = useLocation();
  const currentSong: CompleteSongInfo = location.state || {};
  const navigate = useNavigate();

  useEffect(() => {
    handleFetchAlbumInfo({
      setResult: setAlbumCompleteInfo,
      key: currentSong?.album?.["@key"],
    });
    if (albumCompleteInfo !== null) {
      handleFetchArtistInfo({
        setResult: setArtistCompleteInfo,
        selector: {
          "@assetType": "artist",
          "@key": albumCompleteInfo?.artist?.["@key"],
        },
      });
    }
  }, [albumCompleteInfo]);

  return (
    <Box minH="100vh" bgGradient="radialGradient">
      <Navbar />
      <Flex padding="3rem" justifyContent="center">
        <Stack
          gap="4"
          minW={{ md: "600px" }}
          maxW={{ smDown: "280px" }}
          bgColor="white"
          padding="4rem"
          borderRadius="50px"
          shadow="-1px 9px 9px -1px rgba(0,0,0,0.75)"
        >
          <Text fontSize={"24px"} textAlign="center" mb="1rem">
            Song's Info
          </Text>
          <DataListRoot
            orientation={{ mdDown: "vertical", md: "horizontal" }}
            mb={4}
          >
            <DataListItem label="Name" value={currentSong?.name} />
            <DataListItem
              label="Album's Name"
              value={currentSong?.album.name}
            />
            <DataListItem
              label="Album's Year"
              value={currentSong?.album.year}
            />
            {artistCompleteInfo !== null ? (
              <>
                <DataListItem
                  label="Artist's Name"
                  value={artistCompleteInfo?.name}
                />
                <DataListItem
                  label="Artist's Country"
                  value={artistCompleteInfo?.country}
                />
              </>
            ) : (
              <SkeletonText noOfLines={2} />
            )}
          </DataListRoot>
          <Flex gap="4" justifyContent="center">
            <Button
              type="submit"
              bgColor="secondary"
              _hover={{ bgColor: "primary" }}
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
          </Flex>
        </Stack>
      </Flex>
      <Toaster />
    </Box>
  );
};

export default ViewSong;

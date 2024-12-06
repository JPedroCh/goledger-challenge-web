import { useCallback, useEffect, useState } from "react";
import Navbar from "../../components/navbar";
import { Box, Flex, Stack, Text } from "@chakra-ui/react";
import { sendRequest } from "../../services/request";
import { toaster, Toaster } from "../../components/toaster";
import { fetchAssets, readAsset } from "../../services/assets";
import { useLocation, useNavigate } from "react-router-dom";
import { DataListItem, DataListRoot } from "../../components/data-list";
import { Button } from "../../components/button";

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

  const handleFetchAlbumInfo = useCallback(async () => {
    const response = await sendRequest<Album>(
      readAsset({
        key: {
          "@assetType": "album",
          "@key": currentSong?.album?.["@key"],
        },
      })
    );

    if (response.type === "success") {
      setAlbumCompleteInfo(response?.value);
    } else if (response.type === "error") {
      toaster.error({
        title: "Error",
        description: "It was not possible to fetch the album info!",
        type: "error",
      });
    }
  }, []);

  const handleFetchArtistInfo = useCallback(async () => {
    const response = await sendRequest<RequestResult<Artist[]>>(
      fetchAssets({
        query: {
          selector: {
            "@assetType": "artist",
            "@key": albumCompleteInfo?.artist?.["@key"],
          },
        },
      })
    );

    if (response.type === "success") {
      setArtistCompleteInfo(response?.value?.result?.[0]);
    } else if (response.type === "error") {
      toaster.error({
        title: "Error",
        description: "It was not possible to fetch the artist info!",
        type: "error",
      });
    }
  }, [albumCompleteInfo]);

  useEffect(() => {
    handleFetchAlbumInfo();
    if (albumCompleteInfo !== null) {
      handleFetchArtistInfo();
    }
  }, [albumCompleteInfo]);

  return (
    <Box minH="100vh" bgGradient="radialGradient">
      <Navbar />
      <Flex padding="3rem" justifyContent="center">
        <Stack
          gap="4"
          minW="600px"
          bgColor="white"
          padding="4rem"
          borderRadius="50px"
          shadow="-1px 9px 9px -1px rgba(0,0,0,0.75)"
        >
          <Text fontSize={"24px"} textAlign="center" mb="1rem">
            Song's Info
          </Text>
          <DataListRoot orientation="horizontal" mb={4}>
            <DataListItem label="Name" value={currentSong?.name} />
            <DataListItem
              label="Album's Name"
              value={currentSong?.album.name}
            />
            <DataListItem
              label="Album's Year"
              value={currentSong?.album.year}
            />
            <DataListItem
              label="Artist's Name"
              value={artistCompleteInfo?.name}
            />
            <DataListItem
              label="Artist's Country"
              value={artistCompleteInfo?.country}
            />
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

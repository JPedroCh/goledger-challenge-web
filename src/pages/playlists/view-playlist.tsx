import { useEffect, useMemo, useState } from "react";
import Navbar from "../../components/navbar";
import {
  Box,
  CardBody,
  CardDescription,
  CardHeader,
  CardRoot,
  CardTitle,
  Flex,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../components/button";
import { DataListItem, DataListRoot } from "../../components/data-list";
import { handleFetchAlbums } from "../../services/albums";
import { handleFetchSongs } from "../../services/songs";

const ViewPlaylist = () => {
  const [songs, setSongs] = useState<Song[] | null>(null);
  const [albums, setAlbums] = useState<Album[] | null>(null);
  const location = useLocation();
  const currentPlaylist: Playlist = location.state || {};
  const navigate = useNavigate();

  const songWithAlbumList: CompleteSongInfo[] = useMemo(() => {
    const songsFromPlaylist = currentPlaylist?.songs?.map((song) => {
      const matchingSong = songs?.find(
        (songFromPlaylist) => songFromPlaylist["@key"] === song["@key"]
      );
      return {
        "@assetType": "song",
        "@key": song?.["@key"] || "",
        name: matchingSong?.name || "",
        album: {
          "@assetType": "album",
          "@key": matchingSong?.album?.["@key"] || "",
        },
      };
    });

    const result: CompleteSongInfo[] =
      songsFromPlaylist?.map((song) => {
        const matchingAlbum = albums?.find(
          (album) => album["@key"] === song.album["@key"]
        );
        return {
          "@assetType": "song",
          "@key": song["@key"] || "",
          name: song.name || "",
          album: {
            "@assetType": "album",
            "@key": matchingAlbum?.["@key"] || "",
            name: matchingAlbum?.name || "",
            year: Number(matchingAlbum?.year || "0"),
          },
        };
      }) || [];
    return result;
  }, [songs, albums]);

  useEffect(() => {
    handleFetchSongs({ setResult: setSongs });
    handleFetchAlbums({ setResult: setAlbums });
  }, []);

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
            View Playlist
          </Text>
          <DataListRoot orientation="horizontal" mb={4}>
            <DataListItem label="Name" value={currentPlaylist?.name} />
            <DataListItem
              label="Privacy"
              value={currentPlaylist?.private ? "Private" : "Public"}
            />
          </DataListRoot>
          <Flex gap="2" flexWrap="wrap">
            {songWithAlbumList.map((item) => (
              <CardRoot
                minW="300px"
                maxW="300px"
                color="white"
                bgGradient="linear-gradient(90deg, rgba(25,4,130,1) 0%, rgba(119,82,254,1) 91%);"
              >
                <CardHeader>
                  <CardTitle>{item?.name}</CardTitle>
                  <CardDescription color="white">
                    {item.album?.name}
                  </CardDescription>
                </CardHeader>
                <CardBody>
                  <CardDescription color="white">
                    {item.album.year}
                  </CardDescription>
                </CardBody>
              </CardRoot>
            ))}
          </Flex>
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
    </Box>
  );
};

export default ViewPlaylist;

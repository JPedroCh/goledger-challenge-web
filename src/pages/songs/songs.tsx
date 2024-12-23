import { useEffect, useMemo, useState } from "react";
import Navbar from "../../components/navbar";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { Toaster } from "../../components/toaster";
import StyledCard from "../../components/card";
import { useNavigate } from "react-router-dom";
import DeleteSongDialog from "../../components/song-dialog/delete-song-dialog";
import { handleFetchAlbums } from "../../services/albums";
import { handleFetchSongs } from "../../services/songs";
import SongFilter from "../../components/filter/song-filter";
import { Skeleton } from "../../components/skeleton";

const Songs = () => {
  const [albums, setAlbums] = useState<Album[] | null>(null);
  const [songs, setSongs] = useState<Song[] | null>(null);
  const [isExpectedRefresh, setIsExpectedRefresh] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [currentSong, setCurrentSong] = useState<CompleteSongInfo | undefined>(
    undefined
  );
  const [payload, setPayload] = useState<SongSelector>({
    "@assetType": "song",
  });
  const refreshPage = () => setIsExpectedRefresh((prev: boolean) => !prev);
  const navigate = useNavigate();

  useEffect(() => {
    handleFetchSongs({ setResult: setSongs, selector: payload });
    handleFetchAlbums({ setResult: setAlbums });
  }, [isExpectedRefresh, payload]);

  const songWithAlbumList: CompleteSongInfo[] | null = useMemo(() => {
    const result: CompleteSongInfo[] | null =
      songs?.map((song) => {
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
      }) || null;
    return result;
  }, [songs, albums]);

  return (
    <Box minH="100vh" bgGradient={"radialGradient"}>
      <Navbar />
      <Box padding="3rem">
        <Flex
          justifyContent="space-between"
          flexDir={{ mdDown: "column" }}
          alignItems={{ mdDown: "center", md: "flex-end" }}
          gap={"1rem"}
        >
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
            onClick={() => navigate("/songs/create")}
          >
            Add New Song
          </Button>
          <SongFilter setPayload={setPayload} albums={albums} />
        </Flex>
      </Box>
      <Flex flexDir="row" gap="6" flexWrap="wrap" justifyContent="center">
        {songWithAlbumList !== null
          ? songWithAlbumList?.map((song, index) => (
              <StyledCard
                key={index}
                title={song.name}
                content={[song.album.name || "", song.album.year.toString()]}
                item={song}
                cancelButtonFunction={setOpenDeleteDialog}
                addAddress="/songs/playlist"
                viewAddress="/songs/view"
                setCurrentItem={setCurrentSong}
              />
            ))
          : [...Array(20)].map((item) => (
              <Skeleton
                width="200px"
                height="200px"
                key={item}
                bgColor="primary"
              />
            ))}
        {songWithAlbumList?.length === 0 && (
          <Text fontSize="20px">No results found!</Text>
        )}
        <Toaster />
      </Flex>
      <DeleteSongDialog
        open={openDeleteDialog}
        setOpen={setOpenDeleteDialog}
        song={currentSong}
        refreshPage={refreshPage}
      />
    </Box>
  );
};

export default Songs;

import { useEffect, useState } from "react";
import Navbar from "../../components/navbar";
import { Box, Button, Flex } from "@chakra-ui/react";
import { Toaster } from "../../components/toaster";
import StyledCard from "../../components/card";
import { useNavigate } from "react-router-dom";
import DeletePlaylistDialog from "../../components/playlist-dialog/delete-playlist";
import { handleFetchPlaylists } from "../../services/playlists";
import PlaylistFilter from "../../components/filter/playlist-filter";
import { Skeleton } from "../../components/skeleton";

const Playlists = () => {
  const [playlists, setPlaylists] = useState<Playlist[] | null>(null);
  const [isExpectedRefresh, setIsExpectedRefresh] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | undefined>(
    undefined
  );
  const [payload, setPayload] = useState<PlaylistSelector>({
    "@assetType": "playlist",
  });
  const refreshPage = () => setIsExpectedRefresh((prev: boolean) => !prev);
  const navigate = useNavigate();

  useEffect(() => {
    handleFetchPlaylists({ setResult: setPlaylists, selector: payload });
  }, [isExpectedRefresh, payload]);

  return (
    <Box minH="100vh" bgGradient={"radialGradient"}>
      <Navbar />
      <Box padding="3rem">
        <Flex
          justifyContent="space-between"
          flexDir="row"
          alignItems="flex-end"
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
            onClick={() => navigate("/playlists/create")}
          >
            Add New Playlist
          </Button>
          <PlaylistFilter setPayload={setPayload} />
        </Flex>
      </Box>
      <Flex flexDir="row" gap="6" flexWrap="wrap" justifyContent="center">
        {playlists !== null
          ? playlists?.map((playlist, index) => (
              <StyledCard
                key={index}
                title={playlist.name}
                content={[
                  `${playlist.songs.length.toString()} songs`,
                  playlist.private ? "Private" : "Public",
                ]}
                item={playlist}
                cancelButtonFunction={setOpenDeleteDialog}
                redirectAddress="/playlists/edit"
                viewAddress="/playlists/view"
                setCurrentItem={setCurrentPlaylist}
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
        <Toaster />
      </Flex>
      <DeletePlaylistDialog
        open={openDeleteDialog}
        setOpen={setOpenDeleteDialog}
        playlist={currentPlaylist}
        refreshPage={refreshPage}
      />
    </Box>
  );
};

export default Playlists;

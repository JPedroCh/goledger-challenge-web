import { useEffect, useMemo, useState } from "react";
import Navbar from "../../components/navbar";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { Toaster } from "../../components/toaster";
import StyledCard from "../../components/card";
import DeleteAlbumDialog from "../../components/album-dialog/delete-album-dialog";
import { useNavigate } from "react-router-dom";
import { handleFetchArtists } from "../../services/artists";
import { handleFetchAlbums } from "../../services/albums";
import AlbumFilter from "../../components/filter/album-filter";
import { Skeleton } from "../../components/skeleton";

const Albums = () => {
  const [albums, setAlbums] = useState<Album[] | null>(null);
  const [artists, setArtists] = useState<Artist[] | null>(null);
  const [isExpectedRefresh, setIsExpectedRefresh] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentAlbum, setCurrentAlbum] = useState<
    CompleteAlbumInfo | undefined
  >(undefined);
  const [payload, setPayload] = useState<AlbumSelector>({
    "@assetType": "album",
  });
  const refreshPage = () => setIsExpectedRefresh((prev: boolean) => !prev);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    handleFetchAlbums({ setResult: setAlbums, selector: payload });
    handleFetchArtists({ setResult: setArtists });
  }, [isExpectedRefresh, payload]);

  const albumWithArtistList: CompleteAlbumInfo[] = useMemo(() => {
    setIsLoading(false);
    const result: CompleteAlbumInfo[] =
      albums?.map((album) => {
        const matchingArtist = artists?.find(
          (artist) => artist["@key"] === album.artist["@key"]
        );
        return {
          "@assetType": "album",
          "@key": album["@key"] || "",
          name: album.name || "",
          year: album.year.toString() || "",
          artist: {
            "@assetType": "artist",
            "@key": matchingArtist?.["@key"] || "",
            name: matchingArtist?.name || "",
            country: matchingArtist?.country || "",
          },
        };
      }) || [];
    return result;
  }, [artists, albums]);

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
            onClick={() => navigate("/albums/create")}
          >
            Add New Album
          </Button>
          <AlbumFilter setPayload={setPayload} artists={artists} />
        </Flex>
      </Box>
      <Flex flexDir="row" gap="6" flexWrap="wrap" justifyContent="center">
        {!isLoading
          ? albumWithArtistList?.map((album, index) => (
              <StyledCard
                key={index}
                title={album.name}
                content={[album.artist.name || "", album.year.toString()]}
                item={album}
                cancelButtonFunction={setOpenDeleteDialog}
                redirectAddress="/albums/edit"
                setCurrentItem={setCurrentAlbum}
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
        {albumWithArtistList?.length === 0 && (
          <Text fontSize="20px">No results found!</Text>
        )}
        <Toaster />
      </Flex>
      <DeleteAlbumDialog
        open={openDeleteDialog}
        setOpen={setOpenDeleteDialog}
        album={currentAlbum}
        refreshPage={refreshPage}
      />
    </Box>
  );
};

export default Albums;

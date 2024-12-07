import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import { Box, Button, Flex } from "@chakra-ui/react";
import { Toaster } from "../components/toaster";
import StyledCard from "../components/card";
import EditArtistDialog from "../components/artist-dialog/edit-artist-dialog";
import DeleteArtistDialog from "../components/artist-dialog/delete-artist-dialog";
import CreateArtistDialog from "../components/artist-dialog/create-artist-dialog";
import { handleFetchArtists } from "../services/artists";
import ArtistFilter from "../components/filter/artist-filter";

const Artists = () => {
  const [artists, setArtists] = useState<Artist[] | null>(null);
  const [isExpectedRefresh, setIsExpectedRefresh] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [openCreateDialog, setOpenCreateDialog] = useState<boolean>(false);
  const [currentArtist, setCurrentArtist] = useState<Artist | undefined>(
    undefined
  );
  const [payload, setPayload] = useState<ArtistSelector>({
    "@assetType": "artist",
  });
  const refreshPage = () => setIsExpectedRefresh((prev: boolean) => !prev);

  useEffect(() => {
    handleFetchArtists({ setResult: setArtists, selector: payload });
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
            onClick={() => setOpenCreateDialog(true)}
          >
            Add New Artist
          </Button>
          <ArtistFilter setPayload={setPayload} />
        </Flex>
      </Box>
      <Flex flexDir="row" gap="6" flexWrap="wrap" justifyContent="center">
        {artists?.map((artist, index) => (
          <StyledCard
            key={index}
            title={artist.name}
            content={[artist.country]}
            item={artist}
            cancelButtonFunction={setOpenDeleteDialog}
            editButtonFunction={setOpenEditDialog}
            setCurrentItem={setCurrentArtist}
          />
        ))}
        <Toaster />
      </Flex>
      <EditArtistDialog
        open={openEditDialog}
        setOpen={setOpenEditDialog}
        artist={currentArtist}
        refreshPage={refreshPage}
      />
      <DeleteArtistDialog
        open={openDeleteDialog}
        setOpen={setOpenDeleteDialog}
        artist={currentArtist}
        refreshPage={refreshPage}
      />
      <CreateArtistDialog
        open={openCreateDialog}
        setOpen={setOpenCreateDialog}
        refreshPage={refreshPage}
      />
    </Box>
  );
};

export default Artists;

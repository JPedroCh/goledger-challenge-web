import { useCallback, useEffect, useState } from "react";
import Navbar from "../components/navbar";
import { Box, Button, Flex, HStack, IconButton, Input } from "@chakra-ui/react";
import { sendRequest } from "../services/request";
import { Toaster, toaster } from "../components/toaster";
import StyledCard from "../components/card";
import { useForm } from "react-hook-form";
import { Field } from "../components/field";
import { IoSearchOutline } from "react-icons/io5";
import EditArtistDialog from "../components/artist-dialog/edit-artist-dialog";
import { fetchAssets } from "../services/assets";
import DeleteArtistDialog from "../components/artist-dialog/delete-artist-dialog";
import CreateArtistDialog from "../components/artist-dialog/create-artist-dialog";
import { LuX } from "react-icons/lu";

type Result<T> = {
  metadata: any;
  result: T;
};

interface FormValues {
  name: string;
  country: string;
}

const Artists = () => {
  const [artists, setArtists] = useState<Artist[] | null>(null);
  const [isExpectedRefresh, setIsExpectedRefresh] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [openCreateDialog, setOpenCreateDialog] = useState<boolean>(false);
  const [currentArtist, setCurrentArtist] = useState<Artist | undefined>(
    undefined
  );
  const [payload, setPayload] = useState<FetchArtistPayload>({
    query: {
      selector: {
        "@assetType": "artist",
      },
    },
  });
  const refreshPage = () => setIsExpectedRefresh((prev: boolean) => !prev);

  useEffect(() => {
    handleFetchArtists();
  }, [isExpectedRefresh, payload]);

  const handleFetchArtists = useCallback(async () => {
    const response = await sendRequest<Result<Artist[]>>(fetchAssets(payload));

    if (response.type === "success") {
      setArtists(response?.value?.result);
    } else if (response.type === "error") {
      toaster.error({
        title: "Error",
        description: "It was not possible to fetch the artists!",
        type: "error",
      });
    }
  }, [payload]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormValues>();

  const [watchNameField, watchCountryField] = watch(["name", "country"]);

  const onSubmit = handleSubmit((data) => {
    const selector: ArtistSelector = { "@assetType": "artist" };

    if (data?.name) {
      selector.name = data.name;
    }

    if (data?.country) {
      selector.country = data.country;
    }

    setPayload({
      query: {
        selector,
      },
    });
  });

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
          <form onSubmit={onSubmit} id="search-form">
            <HStack justifyContent={"flex-end"} alignItems={"flex-end"}>
              {(watchNameField !== "" || watchCountryField !== "") && (
                <IconButton
                  aria-label="Remove item"
                  variant="outline"
                  _hover={{ bgColor: "red" }}
                  onClick={() => {
                    setValue("name", "");
                    setValue("country", "");
                    onSubmit();
                  }}
                >
                  <LuX color="white" />
                </IconButton>
              )}
              <Field
                unstyled
                label="Name"
                invalid={!!errors.name}
                errorText={errors.name?.message}
                color="white"
              >
                <Input
                  placeholder="Insert the artist's name"
                  variant="subtle"
                  color="black"
                  {...register("name")}
                />
              </Field>
              <Field
                unstyled
                label="Country"
                invalid={!!errors.country}
                errorText={errors.country?.message}
                color="white"
              >
                <Input
                  placeholder="Insert the artist's country"
                  variant="subtle"
                  color="black"
                  {...register("country")}
                />
              </Field>
              <IconButton
                aria-label="Remove item"
                bgColor="primary"
                type="submit"
              >
                <IoSearchOutline color="white" />
              </IconButton>
            </HStack>
          </form>
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

import { useCallback, useEffect, useState } from "react";
import Navbar from "../../components/navbar";
import {
  Box,
  Button,
  createListCollection,
  Flex,
  HStack,
  IconButton,
  Input,
} from "@chakra-ui/react";
import { sendRequest } from "../../services/request";
import { Toaster, toaster } from "../../components/toaster";
import StyledCard from "../../components/card";
import { Controller, useForm } from "react-hook-form";
import { Field } from "../../components/field";
import { IoSearchOutline } from "react-icons/io5";
import { fetchAssets } from "../../services/assets";
import { LuX } from "react-icons/lu";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import DeletePlaylistDialog from "../../components/playlist-dialog/delete-playlist";
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "../../components/select";

const formSchema = z.object({
  name: z.string(),
  privatePlaylist: z.string().array(),
});

type FormValues = z.infer<typeof formSchema>;

const Playlists = () => {
  const [playlists, setPlaylists] = useState<Playlist[] | null>(null);
  const [isExpectedRefresh, setIsExpectedRefresh] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | undefined>(
    undefined
  );
  const [payload, setPayload] = useState<FetchPlaylistPayload>({
    query: {
      selector: {
        "@assetType": "playlist",
      },
    },
  });
  const refreshPage = () => setIsExpectedRefresh((prev: boolean) => !prev);
  const navigate = useNavigate();

  useEffect(() => {
    handleFetchPlaylists();
  }, [isExpectedRefresh, payload]);

  const handleFetchPlaylists = useCallback(async () => {
    const response = await sendRequest<RequestResult<Playlist[]>>(
      fetchAssets(payload)
    );

    if (response.type === "success") {
      setPlaylists(response?.value?.result);
    } else if (response.type === "error") {
      toaster.error({
        title: "Error",
        description: "It was not possible to fetch the playlists!",
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
    control,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });
  const [watchNameField] = watch(["name"]);

  const onSubmit = handleSubmit((data) => {
    const selector: PlaylistSelector = { "@assetType": "playlist" };

    if (data?.name) {
      selector.name = data.name;
    }

    if (data?.privatePlaylist[0] === "Public") {
      selector.private = false;
    } else if (data?.privatePlaylist[0] === "Private") {
      selector.private = true;
    }

    setPayload({
      query: {
        selector,
      },
    });
  });

  const privacyFilterOptions = createListCollection({
    items: [
      { label: "Private", value: "Private" },
      { label: "Public", value: "Public" },
      { label: "Both", value: "Both" },
    ],
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
            onClick={() => navigate("/playlists/create")}
          >
            Add New Playlist
          </Button>
          <form onSubmit={onSubmit} id="search-form">
            <HStack justifyContent={"flex-end"} alignItems={"flex-end"}>
              {watchNameField !== "" && (
                <IconButton
                  aria-label="Remove item"
                  variant="outline"
                  _hover={{ bgColor: "red" }}
                  onClick={() => {
                    setValue("name", "");
                    onSubmit();
                  }}
                >
                  <LuX color="white" />
                </IconButton>
              )}
              <Field
                label="Name"
                invalid={!!errors.name}
                errorText={errors.name?.message}
                color="white"
              >
                <Input
                  placeholder="Insert the playlist's name"
                  variant="subtle"
                  color="black"
                  {...register("name")}
                />
              </Field>
              <Field
                label="Privacy Filter"
                invalid={!!errors.privatePlaylist}
                errorText={errors.privatePlaylist?.message}
                color="white"
              >
                <Controller
                  control={control}
                  name="privatePlaylist"
                  render={({ field }) => (
                    <SelectRoot
                      name={field.name}
                      value={field.value}
                      onValueChange={({ value }) => field.onChange(value)}
                      onInteractOutside={() => field.onBlur()}
                      collection={privacyFilterOptions}
                      variant="subtle"
                      color="black"
                    >
                      <SelectTrigger>
                        <SelectValueText placeholder="Select Option" />
                      </SelectTrigger>
                      <SelectContent>
                        {privacyFilterOptions.items.map((option) => (
                          <SelectItem item={option} key={option!.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </SelectRoot>
                  )}
                />
              </Field>
              <IconButton
                aria-label="Search item"
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
        {playlists?.map((playlist, index) => (
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

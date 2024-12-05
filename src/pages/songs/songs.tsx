import { useCallback, useEffect, useMemo, useState } from "react";
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
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "../../components/select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import DeleteSongDialog from "../../components/song-dialog/delete-song-dialog";

const formSchema = z.object({
  albumKey: z.string().array(),
  name: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

const Songs = () => {
  const [albums, setAlbums] = useState<Album[] | null>(null);
  const [songs, setSongs] = useState<Song[] | null>(null);
  const [isExpectedRefresh, setIsExpectedRefresh] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [currentSong, setCurrentSong] = useState<CompleteSongInfo | undefined>(
    undefined
  );
  const [payload, setPayload] = useState<FetchSongsPayload>({
    query: {
      selector: {
        "@assetType": "song",
      },
    },
  });
  const refreshPage = () => setIsExpectedRefresh((prev: boolean) => !prev);
  const navigate = useNavigate();

  useEffect(() => {
    handleFetchSongs();
    handleFetchAlbums();
  }, [isExpectedRefresh, payload]);

  const handleFetchSongs = useCallback(async () => {
    const response = await sendRequest<RequestResult<Song[]>>(
      fetchAssets(payload)
    );

    if (response.type === "success") {
      setSongs(response?.value?.result);
    } else if (response.type === "error") {
      toaster.error({
        title: "Error",
        description: "It was not possible to fetch the songs!",
        type: "error",
      });
    }
  }, [payload]);

  const handleFetchAlbums = useCallback(async () => {
    const response = await sendRequest<RequestResult<Album[]>>(
      fetchAssets({
        query: {
          selector: {
            "@assetType": "album",
          },
        },
      })
    );

    if (response.type === "success") {
      setAlbums(response?.value?.result);
    } else if (response.type === "error") {
      toaster.error({
        title: "Error",
        description: "It was not possible to fetch the albums!",
        type: "error",
      });
    }
  }, []);

  const albumsList = useMemo(() => {
    if (albums !== null) {
      return createListCollection({
        items: albums?.map((album) => ({
          label: album.name,
          value: album["@key"],
        })),
      });
    }
    return createListCollection({
      items: [{ label: "", value: "" }],
    });
  }, [albums]);

  const songWithAlbumList: CompleteSongInfo[] = useMemo(() => {
    const result: CompleteSongInfo[] =
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
      }) || [];
    return result;
  }, [songs, albums]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      albumKey: [],
    },
  });
  const [watchNameField, watchAlbumKey] = watch(["name", "albumKey"]);

  const onSubmit = handleSubmit((data) => {
    const selector: SongSelector = { "@assetType": "song" };

    if (data?.name) {
      selector.name = data.name;
    }

    if (data?.albumKey.length !== 0) {
      selector.album = {
        "@assetType": "album",
        "@key": data.albumKey[0],
      };
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
            onClick={() => navigate("/songs/create")}
          >
            Add New Song
          </Button>
          <form onSubmit={onSubmit} id="search-form">
            <HStack justifyContent={"flex-end"} alignItems={"flex-end"}>
              {(watchNameField !== "" || watchAlbumKey?.length !== 0) && (
                <IconButton
                  aria-label="Remove item"
                  variant="outline"
                  _hover={{ bgColor: "red" }}
                  onClick={() => {
                    setValue("name", "");
                    setValue("albumKey", []);
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
                  placeholder="Insert the song's name"
                  variant="subtle"
                  color="black"
                  {...register("name")}
                />
              </Field>
              <Field
                label="Album"
                invalid={!!errors.albumKey}
                errorText={errors.albumKey?.message}
                color="white"
              >
                <Controller
                  control={control}
                  name="albumKey"
                  render={({ field }) => (
                    <SelectRoot
                      name={field.name}
                      value={field.value}
                      onValueChange={({ value }) => field.onChange(value)}
                      onInteractOutside={() => field.onBlur()}
                      collection={albumsList}
                      variant="subtle"
                      color="black"
                    >
                      <SelectTrigger>
                        <SelectValueText placeholder="Select album" />
                      </SelectTrigger>
                      <SelectContent>
                        {albumsList.items.map((artist) => (
                          <SelectItem item={artist} key={artist!.value}>
                            {artist.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </SelectRoot>
                  )}
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
        {songWithAlbumList?.map((song, index) => (
          <StyledCard
            key={index}
            title={song.name}
            content={[song.album.name || "", song.album.year.toString()]}
            item={song}
            cancelButtonFunction={setOpenDeleteDialog}
            viewAddress="/songs/view"
            setCurrentItem={setCurrentSong}
          />
        ))}
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

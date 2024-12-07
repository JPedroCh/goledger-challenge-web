import { useCallback, useEffect, useMemo, useState } from "react";
import Navbar from "../../components/navbar";
import {
  Box,
  createListCollection,
  DataListItemLabel,
  Flex,
  Stack,
  Text,
} from "@chakra-ui/react";
import { sendRequest } from "../../services/request";
import { toaster, Toaster } from "../../components/toaster";
import { updateAsset } from "../../services/assets";
import { useLocation, useNavigate } from "react-router-dom";
import { DataListItem, DataListRoot } from "../../components/data-list";
import { Button } from "../../components/button";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Field } from "../../components/field";
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "../../components/select";
import { handleFetchArtists } from "../../services/artists";
import { handleFetchAlbumInfo } from "../../services/albums";
import { handleFetchPlaylists } from "../../services/playlists";

const formSchema = z.object({
  selectedPlaylist: z.string({ message: "Playlist is required" }).array(),
});

type FormValues = z.infer<typeof formSchema>;

const AddSongToPlaylist = () => {
  const [albumCompleteInfo, setAlbumCompleteInfo] = useState<Album | null>(
    null
  );
  const [artistCompleteInfo, setArtistCompleteInfo] = useState<Artist[] | null>(
    null
  );
  const [playlists, setPlaylists] = useState<Playlist[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const location = useLocation();
  const currentSong: CompleteSongInfo = location.state || {};
  const navigate = useNavigate();

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const handleEditPlaylist = useCallback(
    async (payload: UpdatePlaylistPayload) => {
      const response = await sendRequest<RequestResult<Playlist>>(
        updateAsset(payload)
      );
      setIsLoading(false);
      if (response.type === "success") {
        toaster.success({
          title: "Success",
          description: "Playlist edited succesfully!",
          type: "success",
        });
        navigate("/playlists/");
      } else if (response.type === "error") {
        toaster.error({
          title: "Error",
          description: "It was not possible to edit the playlist!",
          type: "error",
        });
      }
    },
    []
  );

  useEffect(() => {
    handleFetchAlbumInfo({
      setResult: setAlbumCompleteInfo,
      key: currentSong?.album?.["@key"],
    });
    handleFetchPlaylists({ setResult: setPlaylists });
    if (albumCompleteInfo !== null) {
      handleFetchArtists({
        setResult: setArtistCompleteInfo,
        selector: {
          "@assetType": "artist",
          "@key": albumCompleteInfo?.artist?.["@key"],
        },
      });
    }
  }, [albumCompleteInfo]);

  const playlistList = useMemo(() => {
    if (playlists !== null) {
      return createListCollection({
        items: playlists?.map((playlist) => ({
          label: playlist.name,
          value: playlist["@key"],
        })),
      });
    }
    return createListCollection({
      items: [{ label: "", value: "" }],
    });
  }, [playlists]);

  const onSubmit = handleSubmit((data) => {
    setIsLoading(true);

    const selectedPlaylistFullInfo = playlists?.find(
      (playlist) => playlist?.["@key"] === data?.selectedPlaylist?.[0]
    );

    if (
      selectedPlaylistFullInfo?.songs.find(
        (item) => currentSong["@key"] === item?.["@key"]
      )
    ) {
      toaster.error({
        title: "Error",
        description: "This song is already in the playlist!",
        type: "error",
      });
      setIsLoading(false);
      return;
    }

    const currentSongObject: SongWithOnlyKey = {
      "@assetType": "song",
      "@key": currentSong?.["@key"],
    };

    const payload: UpdatePlaylistPayload = {
      update: {
        "@assetType": "playlist",
        name: selectedPlaylistFullInfo?.name || "",
        private: selectedPlaylistFullInfo?.private ? true : false,
        songs: [...(selectedPlaylistFullInfo?.songs || []), currentSongObject],
      },
    };

    handleEditPlaylist(payload);
  });

  return (
    <Box minH="100vh" bgGradient="radialGradient">
      <Navbar />
      <Flex padding="3rem" justifyContent="center">
        <form onSubmit={onSubmit} id="create-album-form">
          <Stack
            gap="4"
            minW="600px"
            bgColor="white"
            padding="4rem"
            borderRadius="50px"
            shadow="-1px 9px 9px -1px rgba(0,0,0,0.75)"
            divideY="2px"
          >
            <Text fontSize={"24px"} textAlign="center" mb="1rem">
              Add Song To Playlist
            </Text>
            <DataListRoot orientation="horizontal" mb={4}>
              <DataListItemLabel mt={4}>Song Information</DataListItemLabel>
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
                value={artistCompleteInfo?.[0]?.name}
              />
              <DataListItem
                label="Artist's Country"
                value={artistCompleteInfo?.[0]?.country}
              />
            </DataListRoot>
            <DataListRoot orientation="horizontal" mb={4}>
              <DataListItemLabel mt={4}>Select a Playlist</DataListItemLabel>
              <Field
                label="Artist"
                invalid={!!errors.selectedPlaylist}
                errorText={errors.selectedPlaylist?.message}
                color="white"
              >
                <Controller
                  control={control}
                  name="selectedPlaylist"
                  render={({ field }) => (
                    <SelectRoot
                      name={field.name}
                      value={field.value}
                      onValueChange={({ value }) => field.onChange(value)}
                      onInteractOutside={() => field.onBlur()}
                      collection={playlistList}
                      variant="subtle"
                      color="black"
                    >
                      <SelectTrigger>
                        <SelectValueText placeholder="Select playlist" />
                      </SelectTrigger>
                      <SelectContent>
                        {playlistList.items.map((playlist) => (
                          <SelectItem item={playlist} key={playlist!.value}>
                            {playlist.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </SelectRoot>
                  )}
                />
              </Field>
            </DataListRoot>

            <Flex gap="4" justifyContent="center">
              <Button
                variant="outline"
                _hover={{ bgColor: "red", color: "white" }}
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                bgColor="secondary"
                _hover={{ bgColor: "primary" }}
                loading={isLoading}
              >
                Confirm
              </Button>
            </Flex>
          </Stack>
        </form>
      </Flex>
      <Toaster />
    </Box>
  );
};

export default AddSongToPlaylist;

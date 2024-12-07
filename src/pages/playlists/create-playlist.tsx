import { useEffect, useMemo, useState } from "react";
import Navbar from "../../components/navbar";
import {
  Box,
  CheckboxGroup,
  Fieldset,
  Flex,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { sendRequest } from "../../services/request";
import { toaster } from "../../components/toaster";
import { Controller, useController, useForm } from "react-hook-form";
import { Field } from "../../components/field";
import { createAsset } from "../../services/assets";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/button";
import { Checkbox } from "../../components/checkbox";
import { CheckboxCard } from "../../components/checkbox-card";
import { handleFetchAlbums } from "../../services/albums";
import { handleFetchSongs } from "../../services/songs";
import { Skeleton } from "../../components/skeleton";

const formSchema = z.object({
  playlistSongs: z.array(z.string()),
  name: z.string().min(1, { message: "Name is required" }),
  privatePlaylist: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

const CreatePlaylist = () => {
  const [songs, setSongs] = useState<Song[] | null>(null);
  const [albums, setAlbums] = useState<Album[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      privatePlaylist: false,
    },
  });

  const playlistSongs = useController({
    control,
    name: "playlistSongs",
    defaultValue: [],
  });

  const handleCreatePlaylist = async (payload: CreatePlaylistPayload) => {
    const response = await sendRequest<RequestResult<Playlist>>(
      createAsset(payload)
    );
    setIsLoading(false);
    if (response.type === "success") {
      toaster.success({
        title: "Success",
        description: "Playlist created succesfully!",
        type: "success",
      });
      navigate("/playlists/");
    } else if (response.type === "error") {
      toaster.error({
        title: "Error",
        description: "It was not possible to create the playlist!",
        type: "error",
      });
    }
  };

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

  const songsList = useMemo(() => {
    if (songWithAlbumList !== null) {
      return songWithAlbumList?.map((song: CompleteSongInfo) => ({
        title: `${song.name}`,
        value: song["@key"],
        description: `${song.album.name} - ${song.album.year}`,
      }));
    }
    return [{ title: "", value: "", description: "" }];
  }, [songWithAlbumList]);

  useEffect(() => {
    handleFetchSongs({ setResult: setSongs });
    handleFetchAlbums({ setResult: setAlbums });
  }, []);

  const onSubmit = handleSubmit((data) => {
    setIsLoading(true);
    const payload: CreatePlaylistPayload = {
      asset: [
        {
          "@assetType": "playlist",
          name: data?.name || "",
          private: data?.privatePlaylist ? true : false,
          songs: data?.playlistSongs.map((song) => ({
            "@assetType": "song",
            "@key": song,
          })),
        },
      ],
    };

    handleCreatePlaylist(payload);
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
          >
            <Text fontSize={"24px"} textAlign="center" mb="1rem">
              Add New Playlist
            </Text>
            <Field
              label="Name"
              invalid={!!errors.name}
              errorText={errors.name?.message}
            >
              <Input
                placeholder="Insert the playlist's name"
                variant="subtle"
                color="black"
                {...register("name")}
              />
            </Field>
            <Controller
              control={control}
              name="privatePlaylist"
              render={({ field }) => (
                <Field
                  disabled={field.disabled}
                  invalid={!!errors.privatePlaylist}
                  errorText={errors.privatePlaylist?.message}
                >
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={({ checked }) => field.onChange(checked)}
                  >
                    Private
                  </Checkbox>
                </Field>
              )}
            />
            <Fieldset.Root invalid={!!errors.playlistSongs}>
              <CheckboxGroup
                invalid={!!errors.playlistSongs}
                value={playlistSongs.field.value}
                onValueChange={playlistSongs.field.onChange}
                name={playlistSongs.field.name}
              >
                <Text textStyle="md" fontWeight="medium">
                  Select song(s)
                </Text>
                <Fieldset.Content>
                  <Flex gap="2" flexWrap="wrap">
                    {songsList.map((item) => (
                      <CheckboxCard
                        label={item.title}
                        description={item.description}
                        key={item.value}
                        value={item.value}
                        minW="300px"
                        maxW="300px"
                        color="white"
                        bgGradient="linear-gradient(90deg, rgba(25,4,130,1) 0%, rgba(119,82,254,1) 91%);"
                      />
                    ))}
                    {songsList.length === 0 &&
                      [...Array(20)].map((item) => (
                        <Skeleton
                          width="300px"
                          height="100px"
                          key={item}
                          bgColor="primary"
                        />
                      ))}
                  </Flex>
                </Fieldset.Content>
              </CheckboxGroup>

              {errors.playlistSongs && (
                <Fieldset.ErrorText>
                  {errors.playlistSongs.message}
                </Fieldset.ErrorText>
              )}
            </Fieldset.Root>
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
    </Box>
  );
};

export default CreatePlaylist;
